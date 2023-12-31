import morgan from 'morgan'

import logger from '../utils/logger'

// logging middleware

const stream = {
  write: (message) => logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV || 'development'

  return env !== 'development'
}

const logging = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
)

const loggingMiddleware = {
  logging,
}

export default loggingMiddleware
