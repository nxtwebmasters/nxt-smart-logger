# 🚀 NXT Smart Logger — Examples & Usage

This guide shows how to leverage `@nxtwebmasters/nxt-smart-logger` in real-world scenarios. Copy/paste any snippet into your app or browser console.

---

## ✅ Minimal Setup

```ts
import { ConsoleInterceptor } from '@nxtwebmasters/nxt-smart-logger';

const interceptor = new ConsoleInterceptor();
console.log('Basic usage ready');
```

---

## 📦 Full Setup with Context & Server Logging

```ts
const interceptor = new ConsoleInterceptor({
  batchSize: 10,
  flushInterval: 4000,
  filterLevels: ['error', 'warn'],
  contextProvider: () => ({
    userId: 'USER42',
    env: 'production',
  }),
  serverLogger: async (logs) => {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logs),
    });
  },
});
```

---

## 🔧 Logging with Tags, Meta, and Extra Context

```ts
const logger = interceptor.getLogger();

logger.info('Simple log');
logger.withTags(['checkout']).warn('Payment gateway slow');
logger.withContext({ feature: 'profile' }).error('Profile fetch failed');
logger.withMeta({ region: 'us-west' }).debug('Geo split test');

logger.withAll({
  tags: ['auth'],
  context: { step: 'login' },
  meta: { version: 'v3' },
}).warn('Multi-setup login warning');
```

---

## 🧠 Best Practice: Set Common Context Once

```ts
interceptor.setContext({ appVersion: '1.3.0', sessionId: 'sess-7890' });
logger.info('Shared context across all logs');
```

---

## 🔍 DevTool / Console CLI Usage

Run these directly in your browser console:

### Preview current queue

```js
interceptor.logQueue
```

### Manually flush now

```js
interceptor.flushLogs()
```

### Clear persistent context

```js
interceptor.clearContext()
```

### Clear persistent tags

```js
interceptor.clearTags()
```

---

## 📊 Tip: Log Format Expectations

Each log is structured and may look like:

```json
{
  "level": "info",
  "message": "User created {\"id\":42}",
  "tags": ["user"],
  "timestamp": "2025-05-31T13:00:00Z",
  "context": {
    "userId": "USER42",
    "appVersion": "1.3.0"
  },
  "meta": {
    "url": "https://yourapp.com/page",
    "userAgent": "Mozilla/5.0",
    "sessionId": "sess-7890",
    "traceId": "uuid-1234"
  },
  "data": {
    "id": 42
  }
}
```

---

## 🔗 Links

* GitHub: [https://github.com/nxtwebmasters/nxt-smart-logger](https://github.com/nxtwebmasters/nxt-smart-logger)
* NPM: [https://www.npmjs.com/package/@nxtwebmasters/nxt-smart-logger](https://www.npmjs.com/package/@nxtwebmasters/nxt-smart-logger)
