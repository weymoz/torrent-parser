module.exports = {
  apps : [
    {
      name: "pars",
      script: "./server/index.js",
      env: {
        MODE: "development",
      },
      env_production: {
        MODE: "production",
      },
      watch: ['./server']
    }]
};


