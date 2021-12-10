import log, { LogLevelDesc } from "loglevel";

const DEFAULT_LOGGER_LEVEL:LogLevelDesc = 'debug';

export class Logger {
    static init(): void {
        log.setDefaultLevel(DEFAULT_LOGGER_LEVEL);
    }

    static info(message: string, caller?: string): void {
        log.info(`[INFO]  ${message} ${caller ? `(${caller})` : ''}`)
    }

    static debug(message: string, caller?: string): void {
        log.debug(`[DEBUG] ${message} ${caller ? `(${caller})` : ''}`)
    }

    static warn(message: string, caller?: string): void {
        log.warn(`[WARN]  ${message} ${caller ? `(${caller})` : ''}`)
    }

    static error(message: string, caller?: string): void {
        log.error(`[ERROR] ${message} ${caller ? `(${caller})` : ''}`)
    }
}