module.exports = {
  apps: [
    {
      name: "app1",
      script: "./dist/index.js",
      watch: false,
      ignore_watch: ["node_modules", "dist", "src"],
    },
  ],
};
