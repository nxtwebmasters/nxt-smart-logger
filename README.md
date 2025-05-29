````markdown
# nxt-smart-logger

A smart console interceptor for JavaScript/TypeScript applications that supports:
- Batched log transmission to server endpoints
- Integration with Google Tag Manager (`dataLayer`)
- Configurable log destinations (Server, GTM, or both)
- Works in Angular, React, or any JS environment

## 📦 Installation

```bash
npm install nxt-smart-logger
````

## 🛠️ Usage

### Basic Setup

```ts
import { SmartLogger } from 'nxt-smart-logger';

const logger = new SmartLogger({
  enableServerLogging: true,
  enableGtmLogging: true,
  serverEndpoint: '/api/logs', // your backend log API
  getUserContext: () => ({
    userId: '1234',
    sessionId: 'abcd-5678'
  })
});
```

### Config Options

| Option                | Type       | Required                               | Description                                            |
| --------------------- | ---------- | -------------------------------------- | ------------------------------------------------------ |
| `enableServerLogging` | `boolean`  | No                                     | Whether to push logs to your backend server            |
| `enableGtmLogging`    | `boolean`  | No                                     | Whether to push logs to GTM `dataLayer`                |
| `serverEndpoint`      | `string`   | Yes (if `enableServerLogging` is true) | Endpoint URL to push logs                              |
| `getUserContext`      | `function` | No                                     | Function returning an object with user/session context |

### Output Format (example)

```json
{
  "level": "log",
  "messages": ["User clicked on button"],
  "timestamp": "2025-05-29T10:00:00Z",
  "url": "http://localhost:4200/home",
  "context": {
    "userId": "1234",
    "sessionId": "abcd-5678"
  }
}
```

## 🔁 Automatic Flushing

* Logs are flushed in batches of 5 or every 5 seconds (whichever comes first).
* If the request fails, logs are re-queued and retried later.

## 📌 Works With

* Angular
* React
* Vue
* Vanilla JS
* Node.js (Browser-specific features like `window.location` won't work in Node)

---

## 📝 License

MIT

````

---

### 🔧 `rollup.config.js`

```js
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'SmartLogger',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser()
  ],
  external: []
};
````

---

### 📦 Directory Structure (Recommended)

```
nxt-smart-logger/
├── dist/
├── src/
│   └── index.ts
├── package.json
├── README.md
├── tsconfig.json
└── rollup.config.js
```

---

Would you like me to generate the `tsconfig.json` as well to go with this setup?
