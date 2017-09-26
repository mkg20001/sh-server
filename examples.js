const sh = require("./src")
new sh({
  port: 8080,
  path: require("path").join(__dirname, "examples")
})
console.log("Online @ 127.0.0.1:8080")
