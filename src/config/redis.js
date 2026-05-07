const Redis = require('ioredis');

let redis;

const connectRedis = async () => {
  try {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: () => null,   // don't retry — fail fast
      lazyConnect: true,
    });
    await redis.connect();
    console.log('Redis connected');
  } catch (err) {
    console.warn('Redis not available — continuing without cache:', err.message);
    redis = null;
  }
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };


