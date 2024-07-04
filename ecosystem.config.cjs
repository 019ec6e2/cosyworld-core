require('dotenv').config()
module.exports = {
  apps: [
    {
      "name": "server",
      "script": "./server/index.mjs"
    },
    {
      "name": "ai",
      "script": "./services/intelligence-processor.mjs"
    },
    {
      "name": "agents",
      "script": "./agent_manager/main.js"
    },
    {
      "name": "listener",
      "script": "./services/listener.mjs"
    }],
  restart_delay: 10000, // 10 seconds delay before restarting
  max_restarts: 3,
  min_uptime: 1000 * 60 * 60 // considered successfully started after an hour
}
