/**
 * Vercel Serverless: POST /api/lead (той самий контракт, що й Express у server/server.js).
 * Локально як і раніше: npm start → Express.
 */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function clean(v) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, 2000);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.body === 'string') {
      try {
        resolve(req.body ? JSON.parse(req.body) : null);
      } catch (e) {
        reject(e);
      }
      return;
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        const s = req.body.toString('utf8');
        resolve(s ? JSON.parse(s) : null);
      } catch (e) {
        reject(e);
      }
      return;
    }
    if (req.body != null && typeof req.body === 'object') {
      resolve(req.body);
      return;
    }
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : null);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

async function telegramCall(token, method, payload) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`telegram_bad_json:${resp.status}:${text.slice(0, 200)}`);
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

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, code: 'method_not_allowed' });
  }

  const token = (process.env.ITWAY_TELEGRAM_BOT_TOKEN || '').trim();
  const chatIdRaw = (process.env.ITWAY_TELEGRAM_CHAT_ID || '').trim();
  const chatIdOk = /^-?\d+$/.test(chatIdRaw);
  const chatId = chatIdOk ? Number(chatIdRaw) : null;

  if (!token || !chatIdRaw) {
    return res.status(500).json({ ok: false, code: 'not_configured' });
  }
  if (!chatIdOk || chatId === null) {
    return res.status(500).json({ ok: false, code: 'bad_chat_id' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({
      ok: false,
      code: 'bad_body',
      detail: 'Невалідний JSON.'
    });
  }

  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      ok: false,
      code: 'bad_body',
      detail: 'Очікується JSON.'
    });
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const company = clean(body.company);
  const message = clean(body.message);
  const lang = clean(body.lang) || 'uk';

  if (!name || !email) {
    return res.status(400).json({ ok: false, code: 'validation' });
  }

  const title =
    lang === 'en' ? 'New lead from ITWAY website' : 'Нова заявка з сайту ITWAY';
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
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Telegram request failed:', e?.message || e);
    return res.status(502).json({ ok: false, code: 'telegram_failed' });
  }
}
