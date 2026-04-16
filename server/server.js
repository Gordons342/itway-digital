import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import nodeFetch from 'node-fetch';

/** Do not use fetch.bind(globalThis) — in Node it can throw “Illegal invocation”. */
function httpFetch(url, init) {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch(url, init);
  }
  return nodeFetch(url, init);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(rootDir, '.env');

console.log('.env path:', envPath, 'exists:', fs.existsSync(envPath));
dotenv.config({ path: envPath, override: true });

const requestLogPath = path.join(rootDir, 'itway-requests.log');

function logRequestLine(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(requestLogPath, line + '\n', { encoding: 'utf8' });
  } catch (_) {
    /* ignore */
  }
}

const app = express();

/** Якщо HTML відкрито з іншого порту (Live Server тощо), браузер шле запит на 8788 — потрібен CORS. */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use((req, res, next) => {
  logRequestLine(`${req.method} ${req.originalUrl}`);
  next();
});

process.on('unhandledRejection', (reason) => {
  console.error('ITWAY unhandledRejection:', reason);
});

/** Express 4 does not catch rejected promises from async route handlers — this forwards them to next(err). */
function asyncRoute(fn) {
  return function asyncRouteWrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.use(express.json({ limit: '32kb' }));

const token = (process.env.ITWAY_TELEGRAM_BOT_TOKEN || '').trim();
const chatIdRaw = (process.env.ITWAY_TELEGRAM_CHAT_ID || '').trim();
const chatIdOk = /^-?\d+$/.test(chatIdRaw);
const chatId = chatIdOk ? Number(chatIdRaw) : null;
console.log(
  `ITWAY Telegram: token=${token ? 'set' : 'missing'}, chatId=${chatIdRaw ? 'set' : 'missing'}`
);

function clean(v) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, 2000);
}

async function telegramCall(method, payload) {
  const resp = await httpFetch(`https://api.telegram.org/bot${token}/${method}`, {
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

async function telegramGetMe() {
  const resp = await httpFetch(`https://api.telegram.org/bot${token}/getMe`);
  const raw = await resp.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`telegram_bad_json:${resp.status}:${raw.slice(0, 200)}`);
  }
  return data;
}

async function sendTelegram(text) {
  if (!token || !chatIdRaw || !chatIdOk) throw new Error('telegram_not_configured');

  const data = await telegramCall('sendMessage', {
    chat_id: chatIdRaw,
    text
  });

  if (!data.ok) {
    console.error('Telegram sendMessage:', data.description || JSON.stringify(data).slice(0, 300));
    throw new Error(`telegram_api:${data.description || 'unknown'}`);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'itway' });
});

app.post(
  '/api/lead',
  asyncRoute(async (req, res) => {
    console.log('POST /api/lead', {
      ct: req.headers['content-type'],
      keys: req.body && typeof req.body === 'object' ? Object.keys(req.body) : []
    });

    if (!token || !chatIdRaw) {
      return res.status(500).json({ ok: false, code: 'not_configured' });
    }
    if (!chatIdOk || chatId === null) {
      return res.status(500).json({ ok: false, code: 'bad_chat_id' });
    }

    if (req.body == null || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        ok: false,
        code: 'bad_body',
        detail: 'Очікується JSON. Відкрийте сайт через http://localhost:8788 і натисніть Ctrl+F5.'
      });
    }

    const name = clean(req.body?.name);
    const email = clean(req.body?.email);
    const phone = clean(req.body?.phone);
    const company = clean(req.body?.company);
    const message = clean(req.body?.message);
    const lang = clean(req.body?.lang) || 'uk';

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
      await sendTelegram(lines.join('\n'));
      return res.json({ ok: true });
    } catch (e) {
      console.error('Telegram request failed:', e?.message || e);
      return res.status(502).json({ ok: false, code: 'telegram_failed' });
    }
  })
);

app.use(express.static(rootDir, { index: 'index.html', extensions: ['html'] }));

app.use((err, req, res, next) => {
  const url = req.originalUrl || req.url || '';
  if (!url.startsWith('/api')) {
    return next(err);
  }
  console.error('ITWAY API express error:', err?.statusCode || err?.status, err?.message || err);
  if (res.headersSent) {
    return next(err);
  }
  const status =
    err.statusCode && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : err.status && err.status >= 400 && err.status < 600
        ? err.status
        : 500;
  return res.status(status).json({
    ok: false,
    code: 'express_error',
    detail: String(err?.message || err).slice(0, 320)
  });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8788;
const listenHost = (process.env.HOST || '').trim();

function onListen() {
  (async () => {
    console.log(`ITWAY site + API: http://localhost:${port}`);
    console.log('Кожен запит логуються в cmd і в файлі:', requestLogPath);
    if (token) {
      try {
        const me = await telegramGetMe();
        if (me.ok) {
          console.log('Telegram getMe: OK @' + (me.result?.username || me.result?.first_name || '?'));
        } else {
          console.error('Telegram getMe failed:', me.description || me);
        }
      } catch (e) {
        console.error('Telegram getMe error:', e?.message || e);
      }
    }
  })();
}

if (listenHost) {
  app.listen(port, listenHost, onListen);
} else {
  app.listen(port, onListen);
}
