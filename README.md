# 🚀 NXT Smart Logger | Advanced Console Interceptor

![npm](https://img.shields.io/npm/v/@nxtwebmasters/nxt-smart-logger)
![license](https://img.shields.io/npm/l/@nxtwebmasters/nxt-smart-logger)
![downloads](https://img.shields.io/npm/dm/@nxtwebmasters/nxt-smart-logger)

A sophisticated console interceptor that supercharges your logging capabilities with server integration, GTM support, context/meta injection, custom log levels, and reusable structured logs for modern applications.

## ✨ Features

* **🔀 Batched Log Transmission** - Optimize network calls with configurable batching
* **📊 GTM Integration** - Seamless integration with Google Tag Manager
* **👤 Contextual Logging** - Attach user/session context automatically
* **⚡ Multiple Destinations** - Send logs to server, GTM, or both simultaneously
* **🛡️ Error Resilient** - Automatic retries for failed transmissions
* **🔄 Framework Agnostic** - Works with Angular, React, Vue, or vanilla JS
* **🧹 Custom Logging** - Define your own log types and structured events
* **✨ Extendable API** - Inject tags, meta, or override per log call

## 📦 Installation

```bash
npm install @nxtwebmasters/nxt-smart-logger
# or
yarn add @nxtwebmasters/nxt-smart-logger
```

## 🚀 Quick Start

```ts
import { ConsoleInterceptor } from "@nxtwebmasters/nxt-smart-logger";

const interceptor = new ConsoleInterceptor({
  batchSize: 10,
  flushInterval: 5000,
  contextProvider: () => ({
    userId: "USER123",
    sessionId: "SESSION456",
    appVersion: "1.0.0",
  }),
  serverLogger: async (logs) => {
    await fetch("https://yourserver.com/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logs),
    });
  },
});

const logger = interceptor.getLogger();
logger.info("User logged in");
logger.withTags(["auth"]).warn("Login attempt");
logger.withContext({ feature: "search" }).error("Search failed");
logger.withMeta({ region: "us-east-1" }).debug("Region-specific check");
logger.withAll({
  tags: ["api"],
  context: { feature: "checkout" },
  meta: { version: "2.1.0" },
}).error("API timeout");

interceptor.setContext({ userId: "ADMIN" });
```

## ⚙️ Configuration Options

| Option            | Type                      | Default      | Description                           |
| ----------------- | ------------------------- | ------------ | ------------------------------------- |
| `batchSize`       | `number`                  | `5`          | Max logs per batch                    |
| `flushInterval`   | `number`                  | `5000`       | Max wait time (ms) between flushes    |
| `contextProvider` | `() => object`            | `() => ({})` | Provides dynamic context              |
| `serverLogger`    | `(logs) => Promise<void>` | `null`       | Function to POST logs to your backend |
| `customLevels`    | `string[]`                | `[]`         | Custom log levels (e.g. audit, track) |
| `filterLevels`    | `string[]`                | all levels   | Log levels to capture from console    |
| `generateTraceId` | `() => string`            | uuidv4       | Custom trace ID generator             |

## 🧩 Structured Log Format

```json
{
  "level": "warn",
  "timestamp": "2025-05-31T12:34:56.789Z",
  "message": "Login failed {\"code\":401}",
  "tags": ["auth"],
  "context": {
    "userId": "USER123",
    "sessionId": "SESSION456",
    "feature": "login"
  },
  "meta": {
    "url": "https://nxtwebmasters.com/app",
    "userAgent": "Mozilla/5.0...",
    "traceId": "uuid-123",
    "sessionId": "SESSION456"
  },
  "data": {
    "code": 401
  }
}
```

# 🔌 Integration Examples — NXT Smart Logger

Here’s how to plug `@nxtwebmasters/nxt-smart-logger` into various environments:

---

## ⚛️ React Setup

```ts
// logger.ts
import { ConsoleInterceptor } from '@nxtwebmasters/nxt-smart-logger';

export const interceptor = new ConsoleInterceptor({
  contextProvider: () => ({
    userId: localStorage.getItem('userId'),
    sessionId: sessionStorage.getItem('sessId')
  }),
  serverLogger: async (logs) => {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logs),
    });
  }
});

export const logger = interceptor.getLogger();
```

```tsx
// App.tsx
import { logger } from './logger';

function App() {
  useEffect(() => {
    logger.info('App mounted');
  }, []);
  return <h1>Welcome</h1>;
}
```

---

## 🧩 Vue Setup

```ts
// logger.ts
import { ConsoleInterceptor } from '@nxtwebmasters/nxt-smart-logger';

const interceptor = new ConsoleInterceptor({
  contextProvider: () => ({ userId: 'vue-user', role: 'admin' })
});

export const logger = interceptor.getLogger();
```

```vue
<script setup>
import { onMounted } from 'vue';
import { logger } from './logger';

onMounted(() => {
  logger.info('Vue component mounted');
});
</script>
```

---

## 🖥️ Node.js Setup (e.g., CLI apps or SSR)

```ts
import { ConsoleInterceptor } from '@nxtwebmasters/nxt-smart-logger';

const interceptor = new ConsoleInterceptor({
  enableGTM: false,
  enableServer: true,
  contextProvider: () => ({ env: 'node', pid: process.pid }),
  serverLogger: async (logs) => {
    console.log('Sending logs to API:', logs);
  }
});

const logger = interceptor.getLogger();
logger.info('CLI started');
```

---

Use the logger the same way across all frameworks:

```ts
logger.error('Something went wrong', { details: '...' })
logger.withTags(['startup']).info('App ready')
```

---

## 🌍 Works Anywhere

* React (hooks, SSR, client)
* Vue 2/3 (setup API or options API)
* Vanilla JS / CDN
* Node.js (CLI, workers, Express)


## 🌐 Browser Support

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                          | Latest ✔                                                                                    | Latest ✔                                                                                             | Latest ✔                                                                                          |

## 🤝 Contributing

We welcome contributions! Please see our [Contribution Guidelines](CONTRIBUTING.md).

## 📜 License

MIT © [NXT WebMasters](https://github.com/nxtwebmasters)
