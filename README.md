# 🚀 NXT Smart Logger | Advanced Console Interceptor

![npm](https://img.shields.io/npm/v/@nxtwebmasters/nxt-smart-logger)
![license](https://img.shields.io/npm/l/@nxtwebmasters/nxt-smart-logger)
![downloads](https://img.shields.io/npm/dm/@nxtwebmasters/nxt-smart-logger)

A sophisticated console interceptor that supercharges your logging capabilities with server integration, GTM support, and contextual logging for modern web applications.

## ✨ Features

- **🔁 Batched Log Transmission** - Optimize network calls with configurable batching
- **📊 GTM Integration** - Seamless integration with Google Tag Manager
- **👤 Contextual Logging** - Attach user/session context automatically
- **⚡ Multiple Destinations** - Send logs to server, GTM, or both simultaneously
- **🛡️ Error Resilient** - Automatic retries for failed transmissions
- **🔄 Framework Agnostic** - Works with Angular, React, Vue, or vanilla JS

## 📦 Installation

```bash
npm install @nxtwebmasters/nxt-smart-logger
# or
yarn add @nxtwebmasters/nxt-smart-logger
```

## 🚀 Quick Start

```javascript
import { ConsoleInterceptor } from '@nxtwebmasters/nxt-smart-logger';

const interceptor = new ConsoleInterceptor({
  enableGTM: true,
  enableServer: true,
  batchSize: 10,
  flushInterval: 5000,
  contextProvider: () => ({
    userId: 'USER123',
    sessionId: 'SESSION456',
    appVersion: '1.0.0'
  }),
  serverLogger: async (logs) => {
    await fetch('https://yourserver.com/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logs)
    });
  }
});
```

## ⚙️ Configuration Options

| Option              | Type       | Default | Description |
|---------------------|------------|---------|-------------|
| `serverEndpoint`    | `string`   | `null`  | Your log ingestion endpoint |
| `batchSize`        | `number`   | `5`     | Max logs per batch |
| `flushInterval`    | `number`   | `5000`  | Max wait time (ms) between flushes |
| `enableGtm`        | `boolean`  | `true`  | Push logs to GTM dataLayer |
| `enableServer`     | `boolean`  | `true`  | Send logs to your server |
| `contextProvider`  | `function` | `() => ({})` | Provides contextual metadata |
| `serverLogger`  | `(logs: Log[]) => Promise` | `null` | Function to POST logs to your backend |

## 📊 Sample Output

```json
{
  "level": "error",
  "messages": ["Checkout failed", {"code": 400}],
  "timestamp": "2025-05-29T12:34:56.789Z",
  "url": "https://nxtwebmasters.com/nxt-hospital",
  "context": {
    "userId": "mubeen-1234",
    "sessionId": "sess-5678",
    "device": "mobile"
  }
}
```

## 🌐 Browser Support

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) |
|--------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Latest ✔                                                                                         | Latest ✔                                                                                    | Latest ✔                                                                                           | Latest ✔                                                                                         |

## 🤝 Contributing

We welcome contributions! Please see our [Contribution Guidelines](CONTRIBUTING.md).

## 📜 License

MIT © [NXT WebMasters](https://github.com/nxtwebmasters)
