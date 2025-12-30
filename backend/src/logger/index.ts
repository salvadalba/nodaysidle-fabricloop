import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { config } from '../config/index.js'

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`
    }
    return msg
  })
)

// JSON format for file logs
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create logs directory if it doesn't exist
const fs = await import('fs')
if (!fs.existsSync(config.LOG_DIR)) {
  fs.mkdirSync(config.LOG_DIR, { recursive: true })
}

// Create logger instance
export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: jsonFormat,
  transports: [
    // Error log file - rotates daily
    new DailyRotateFile({
      filename: `${config.LOG_DIR}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // Combined log file - rotates daily
    new DailyRotateFile({
      filename: `${config.LOG_DIR}/combined-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})

// Add console transport in development
if (config.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  )
}

// Request logging middleware
export function requestLogger(req: any, res: any, next: any) {
  const start = Date.now()
  const { method, url, ip } = req
  const userAgent = req.get('user-agent')

  res.on('finish', () => {
    const duration = Date.now() - start
    const { statusCode } = res

    logger.info('HTTP Request', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent,
      userId: req.user?.id,
    })
  })

  next()
}

export default logger
