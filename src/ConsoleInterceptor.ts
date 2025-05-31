// src/ConsoleInterceptor.ts

import { v4 as uuidv4 } from 'uuid';

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export interface StructuredLog {
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

export class ConsoleInterceptor {
  private logQueue: StructuredLog[] = [];
  private batchSize: number;
  private flushInterval: number;
  private enableGTM: boolean;
  private enableServer: boolean;
  private contextProvider: () => Record<string, any>;
  private serverLogger: ((logs: StructuredLog[]) => Promise<void>) | null;
  private originalConsole: any;
  private customLevels: string[];
  private logger: Record<string, any> = {};
  private defaultSessionId: string = uuidv4();
  private generateTraceId: () => string = () => uuidv4();
  private persistentContext: Record<string, any> = {};
  private persistentTags: string[] = [];

  constructor(options: {
    batchSize?: number;
    flushInterval?: number;
    enableGTM?: boolean;
    enableServer?: boolean;
    contextProvider?: () => Record<string, any>;
    serverLogger?: (logs: StructuredLog[]) => Promise<void>;
    customLevels?: string[];
    generateTraceId?: () => string;
    filterLevels?: string[];
  } = {}) {
    this.batchSize = options.batchSize || 5;
    this.flushInterval = options.flushInterval || 5000;
    this.enableGTM = options.enableGTM ?? true;
    this.enableServer = options.enableServer ?? true;
    this.contextProvider = options.contextProvider || (() => ({}));
    this.serverLogger = options.serverLogger || null;
    this.customLevels = (
      options.filterLevels?.length
        ? ['log', 'error', 'warn', 'info', 'debug'].filter(lvl => options.filterLevels!.includes(lvl))
        : ['log', 'error', 'warn', 'info', 'debug']
    ).concat(options.customLevels || []);
    if (options.generateTraceId) {
      this.generateTraceId = options.generateTraceId;
    }

    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };

    this.overrideConsole();
    this.setupFlushInterval();
    this.setupCustomLogger();
  }

  overrideConsole() {
    for (const level of ['log', 'error', 'warn', 'info', 'debug'] as (keyof Console)[]) {
      (console as any)[level] = (...args: any[]) => {
        this.originalConsole[level].apply(console, args);
        this.enqueueLog(level, args);
      };
    }
  }

  setupCustomLogger() {
    for (const level of this.customLevels) {
      this.logger[level] = (...args: any[]) => {
        if (this.originalConsole[level]) {
          this.originalConsole[level].apply(console, args);
        }
        this.enqueueLog(level, args);
      };
    }

    this.logger.withTags = (tags: string[]) => {
      return Object.fromEntries(
        this.customLevels.map(level => [
          level,
          (...args: any[]) => {
            this.enqueueLog(level, args, tags);
          }
        ])
      );
    };

    this.logger.withContext = (extraContext: Record<string, any>) => {
      return Object.fromEntries(
        this.customLevels.map(level => [
          level,
          (...args: any[]) => {
            this.enqueueLog(level, args, undefined, extraContext);
          }
        ])
      );
    };

    this.logger.withMeta = (extraMeta: Record<string, any>) => {
      return Object.fromEntries(
        this.customLevels.map(level => [
          level,
          (...args: any[]) => {
            this.enqueueLog(level, args, undefined, undefined, extraMeta);
          }
        ])
      );
    };

    this.logger.withAll = ({ context, tags, meta }: {
      context?: Record<string, any>;
      tags?: string[];
      meta?: Record<string, any>;
    }) => {
      return Object.fromEntries(
        this.customLevels.map(level => [
          level,
          (...args: any[]) => {
            this.enqueueLog(level, args, tags, context, meta);
          }
        ])
      );
    };
  }

  setContext(ctx: Record<string, any>) {
    this.persistentContext = { ...this.persistentContext, ...ctx };
  }

  clearContext() {
    this.persistentContext = {};
  }

  clearTags() {
    this.persistentTags = [];
  }

  getLogger() {
    return this.logger;
  }

  enqueueLog(
    level: string,
    args: any[],
    tags?: string[],
    extraContext: Record<string, any> = {},
    extraMeta: Record<string, any> = {}
  ) {
    const dynamicContext = this.contextProvider();
    const context = { ...this.persistentContext, ...dynamicContext, ...extraContext };

    const sessionId = context.sessionId || this.defaultSessionId;
    const traceId = context.traceId || this.generateTraceId();

    const meta = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId,
      traceId,
      ...extraMeta
    };

    let data: any = null;
    const messageParts: string[] = [];

    for (const arg of args) {
      if (typeof arg === 'object' && arg !== null) {
        data = { ...data, ...arg };
        messageParts.push(JSON.stringify(arg));
      } else {
        messageParts.push(String(arg));
      }
    }

    const log: StructuredLog = {
      level,
      timestamp: new Date().toISOString(),
      message: messageParts.join(' '),
      tags: tags || this.persistentTags,
      context,
      meta,
      data
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