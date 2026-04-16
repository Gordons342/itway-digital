function corsHeaders(extra) {
  return Object.assign(
    {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type'
    },
    extra || {}
  );
}

function clean(v) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, 2000);
}

async function telegramCall(token, method, payload) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const raw = await resp.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`telegram_bad_json:${resp.status}:${raw.slice(0, 200)}`);
  }
  return data;
}

async function sendTelegram(token, chatIdRaw, chatIdOk, text) {
  if (!token || !chatIdRaw || !chatIdOk) throw new Error('telegram_not_configured');
  const data = await telegramCall(token, 'sendMessage', {
    chat_id: chatIdRaw,
    text
  });
  if (!data.ok) {
    console.error('Telegram sendMessage:', data.description || JSON.stringify(data).slice(0, 300));
    throw new Error(`telegram_api:${data.description || 'unknown'}`);
  }
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'method_not_allowed' })
    };
  }

  const token = String(process.env.ITWAY_TELEGRAM_BOT_TOKEN || '').trim();
  const chatIdRaw = String(process.env.ITWAY_TELEGRAM_CHAT_ID || '').trim();
  const chatIdOk = /^-?\d+$/.test(chatIdRaw);

  if (!token || !chatIdRaw) {
    return {
      statusCode: 500,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'not_configured' })
    };
  }
  if (!chatIdOk) {
    return {
      statusCode: 500,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'bad_chat_id' })
    };
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : null;
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'bad_body', detail: 'Невалідний JSON.' })
    };
  }

  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    return {
      statusCode: 400,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'bad_body', detail: 'Очікується JSON.' })
    };
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const company = clean(body.company);
  const message = clean(body.message);
  const lang = clean(body.lang) || 'uk';

  if (!name || !email) {
    return {
      statusCode: 400,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'validation' })
    };
  }

  const title = lang === 'en' ? 'New lead from ITWAY website' : 'Нова заявка з сайту ITWAY';
  const lines = [
    title,
    '',
    `Ім'я / Name: ${name}`,
    `Email: ${email}`,
    phone ? `Телефон / Phone: ${phone}` : null,
    company ? `Компанія / Company: ${company}` : null,
    message ? '' : null,
    message ? `Повідомлення / Message:\n${message}` : null
  ].filter((x) => x !== null);

  try {
    await sendTelegram(token, chatIdRaw, chatIdOk, lines.join('\n'));
    return {
      statusCode: 200,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error('Telegram request failed:', e && e.message ? e.message : e);
    return {
      statusCode: 502,
      headers: corsHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ ok: false, code: 'telegram_failed' })
    };
  }
};

