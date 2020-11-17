
const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const client = redis.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
});

client.on('connect', () => {
    console.log("Client connetc to Redis..");
});

client.on('ready', () => {
    console.log("Client ready to use..");
});

client.on('error', (err) => {
    console.log(err.message);
});

client.on('end', () => {
    console.log("Clien disconected from Redis");
});

module.exports = client;