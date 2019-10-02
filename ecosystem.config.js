module.exports = {
  apps : [
    {
      name: "parser-server",
      script: "./server/index.js",
      env: {
        MODE: "development",

      },
      env_production: {
        MODE: "production",
      },
      watch: ['server']
    }]
};


