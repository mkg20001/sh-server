#!/usr/bin/env node

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
const express = require("express")
const app = express()
app.use(require("morgan")("combined"))
new sh({
  app,
  port: argv.port,
  path: argv.dir
})
console.log("Online @ 127.0.0.1:", argv.port)
