"use strict"

const express = require("express")
const fs = require("fs")
const path = require("path")
const cp = require("child_process")
const wrapper = path.join(__dirname, "wrapper.sh")
const client = require("./client")
const debug = require("debug")
const log = debug("sh-server")

module.exports = function ShServer(opt) {
  const self = this
  const app = opt.app ? opt.app : express()
  log("creating new sh-server")
  if (opt.path) {
    if (!fs.existsSync(opt.path)) throw new Error(opt.path + " does not exist!")
    self.path = fs.realpathSync(opt.path)
  } else {
    throw new Error("No path defined!")
  }

  function getIndexFile(url) {
    let full = path.join(self.path, url)
    if (!fs.existsSync(full)) return
    const lstat = fs.lstatSync(full)
    if (lstat.isDirectory()) {
      full = path.join(full, "index.sh")
      if (!fs.existsSync(full)) return
      return full
    } else if (lstat.isFile()) {
      if (full.endsWith(".sh")) return full
    }
  }

  self.app = app
  app.use(function (req, res, cb) {
    let filePath
    if (!(filePath = getIndexFile(req.url))) return cb()
    log("handle %s as %s", req.url, filePath)
    if (!fs.existsSync(filePath)) return cb(new Error("ENOTFOUND: " + filePath))
    const spawnargs = [wrapper, filePath]
    let spawnopt = {
      cwd: path.dirname(filePath),
      stdio: ["pipe", "pipe", "pipe", "pipe"]
    }
    let env = spawnopt.env = {}
    for (var header in req.headers)
      env["WEB_" + header.toUpperCase().replace(/-/g, "_")] = req.headers[header]
    env.WRAPPER_SOURCE = __dirname
    new client(cp.spawn("bash", spawnargs, spawnopt), req, res, cb)
  })
  if (opt.http) app.listen(opt.http)
  if (opt.port) app.listen(opt.port)
}
