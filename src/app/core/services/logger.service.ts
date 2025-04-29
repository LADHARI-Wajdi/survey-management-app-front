// core/services/logger.service.ts
import { Injectable } from '@angular/core';
import { environements } from '../../../environements/environement';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  // Minimum level to show logs (configured based on environment)
  private level: LogLevel = environements.production
    ? LogLevel.WARN
    : LogLevel.DEBUG;

  // Enable remote logging to a server API
  private enableRemoteLogging: boolean = environements
  .production;

  // Maximum number of logs to keep in memory
  private maxLogsInMemory: number = 100;

  // In-memory log storage
  private logs: Array<{
    timestamp: Date;
    level: LogLevel;
    message: string;
    data?: any;
  }> = [];

  constructor() {}

  /**
   * Log a debug message
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: any, p0?: string): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: any, p0?: string): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get all logs stored in memory
   */
  getLogs(): Array<{
    timestamp: Date;
    level: LogLevel;
    message: string;
    data?: any;
  }> {
    return [...this.logs];
  }

  /**
   * Clear all logs from memory
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Enable or disable remote logging
   */
  setRemoteLogging(enable: boolean): void {
    this.enableRemoteLogging = enable;
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    // Only log if the level is sufficient
    if (level >= this.level) {
      const logEntry = {
        timestamp: new Date(),
        level,
        message,
        data,
      };

      // Add to in-memory logs, respecting the max size
      this.addToMemoryLogs(logEntry);

      // Output to console
      this.outputToConsole(level, message, data);

      // Send to remote server if enabled and level is sufficient
      if (this.enableRemoteLogging && level >= LogLevel.ERROR) {
        this.sendToRemoteServer(logEntry);
      }
    }
  }

  /**
   * Add a log entry to in-memory storage
   */
  private addToMemoryLogs(logEntry: any): void {
    this.logs.push(logEntry);

    // Trim if we exceed max logs
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs = this.logs.slice(-this.maxLogsInMemory);
    }
  }

  /**
   * Output log to console with appropriate styling
   */
  private outputToConsole(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '');
        break;
    }
  }

  /**
   * Send log to remote server for monitoring
   */
  private sendToRemoteServer(logEntry: any): void {
    // In a real application, this would call an API endpoint
    // to send logs to a remote server for monitoring
    // Example implementation (commented out):
    /*
    const apiUrl = environment.logApiUrl;
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
    }).catch(err => {
      // Silent failure for logging service
      console.error('Failed to send log to remote server', err);
    });
    */
  }
}
