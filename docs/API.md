# 📘 API Reference — NXT Smart Logger

This document describes the full API of the `ConsoleInterceptor` class and its logger instance returned by `.getLogger()`.

---

## 🎯 ConsoleInterceptor Constructor

```ts
new ConsoleInterceptor(options?: ConsoleInterceptorOptions)
```

### Options

| Name              | Type                        | Default      | Description                                  |
| ----------------- | --------------------------- | ------------ | -------------------------------------------- |
| `batchSize`       | `number`                    | `5`          | Max logs per batch                           |
| `flushInterval`   | `number`                    | `5000`       | Flush every N ms                             |
| `enableGTM`       | `boolean`                   | `true`       | Push logs to `window.dataLayer` if available |
| `enableServer`    | `boolean`                   | `true`       | Enable server logging via `serverLogger`     |
| `contextProvider` | `() => Record<string, any>` | `() => ({})` | Injects log-time context                     |
| `serverLogger`    | `(logs) => Promise<void>`   | `null`       | Function to send logs to your backend        |
| `customLevels`    | `string[]`                  | `[]`         | Add custom log levels like `audit`, `track`  |
| `filterLevels`    | `string[]`                  | all          | Only intercept these console levels          |
| `generateTraceId` | `() => string`              | `uuidv4`     | Custom trace ID generator                    |

---

## 🔥 Logger Methods (via `getLogger()`)

### Base Levels

```ts
logger.log(...args)
logger.info(...args)
logger.warn(...args)
logger.error(...args)
logger.debug(...args)
```

### Custom Levels (if provided)

```ts
logger.audit(...args)
logger.track(...args)
```

### Contextual APIs

```ts
logger.withTags(tags: string[]): Logger
logger.withContext(context: object): Logger
logger.withMeta(meta: object): Logger
logger.withAll({ context, tags, meta }): Logger
```

---

## 🧠 Persistent Context API

```ts
interceptor.setContext(context: object)
interceptor.clearContext()
interceptor.clearTags()
```

Set or clear context that applies across all logs.

---

## 🧪 DevTool / Debug API

```ts
interceptor.logQueue     // Inspect queued logs
interceptor.flushLogs()  // Manually flush logs now
```

---

## 🧾 Structured Log Format

```ts
interface StructuredLog {
  timestamp: string;
  level: string;
  message: string;
  tags?: string[];
  context: Record<string, any>;
  meta: {
    url: string;
    userAgent?: string;
    traceId?: string;
    sessionId?: string;
    [key: string]: any;
  };
  data?: any;
}
```

---

## 💡 Tips

* Use `.withTags()` to label events (`auth`, `error`, `checkout`)
* Use `.withContext()` to attach feature/state info
* `setContext()` is great for globally shared fields like `userId`, `appVersion`
