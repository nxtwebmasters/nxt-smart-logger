// src/ConsoleInterceptor.js
export class ConsoleInterceptor {
  constructor(options = {}) {
    this.logQueue = [];
    this.batchSize = options.batchSize || 5;
    this.flushInterval = options.flushInterval || 5000;
    this.enableGTM = options.enableGTM ?? true;
    this.enableServer = options.enableServer ?? true;
    this.contextProvider = options.contextProvider || (() => ({}));
    this.serverLogger = options.serverLogger || null;

    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };

    this.overrideConsole();
    this.setupFlushInterval();
  }

  overrideConsole() {
    const intercept = (level) => (...args) => {
      this.originalConsole[level].apply(console, args);
      this.enqueueLog(level, args);
    };

    console.log = intercept('log');
    console.error = intercept('error');
    console.warn = intercept('warn');
    console.info = intercept('info');
    console.debug = intercept('debug');
  }

  enqueueLog(level, args) {
    const context = this.contextProvider();
    const log = {
      level,
      messages: args,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...context
    };

    this.logQueue.push(log);

    if (this.enableGTM && window.dataLayer) {
      window.dataLayer.push({ event: 'console_log', log });
    }

    if (this.logQueue.length >= this.batchSize) {
      this.flushLogs();
    }
  }

  setupFlushInterval() {
    setInterval(() => this.flushLogs(), this.flushInterval);
  }

  async flushLogs() {
    if (!this.enableServer || !this.serverLogger || this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    try {
      await this.serverLogger(logsToSend);
    } catch (err) {
      this.logQueue.unshift(...logsToSend);
    }
  }
}