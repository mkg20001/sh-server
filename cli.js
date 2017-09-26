"use strict"

const argv = require("yargs")
  .option("port", {
    desc: "Port to listen on",
    type: "number",
    required: true,
    default: 8080,
    alias: "p"
  })
  .option("dir", {
    desc: "Root directory for the webserver",
    type: "string",
    required: true,
    alias: "d"
  })
  .argv

const sh = require("./src")
const app = new sh({
  port: argv.port,
  path: argv.dir
})
console.log("Online @ 127.0.0.1:", argv.port)
