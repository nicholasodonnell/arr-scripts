import type { ILogger } from './types'

export class Logger implements ILogger {
  private readonly LOG_LEVELS = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    WARN: 'WARN',
  }

  private log(message: string, level: string) {
    console.log(`[${new Date().toLocaleString('sv')}] [${level}]: ${message}`)
  }

  info(message: string) {
    this.log(message, this.LOG_LEVELS.INFO)
  }

  warn(message: string) {
    this.log(message, this.LOG_LEVELS.WARN)
  }

  error(message: string) {
    this.log(message, this.LOG_LEVELS.ERROR)
  }
}
