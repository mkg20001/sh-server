"use strict"

const toPull = require("stream-to-pull-stream")
const toStream = require("pull-stream-to-stream")
const pushable = require("pull-pushable")
const queue = require("pull-queue")
const pull = require("pull-stream")
const utf8 = require("pull-utf8-decoder")
const split = require("pull-split")
const cmds = require("./cmds")
const bl = require("bl")

module.exports = function Client(p, req, res, next) {
  const self = this
  self.push = pushable()
  const push = sth => self.push.push(JSON.stringify(sth) + "\n")

  //stdio=stdin,stdout,stderr,ipc

  const input = toPull.source(p.stdio[3])
  const output = toStream.source(self.push)
  //const fileStream = toPull.source(p.stdio[1])
  //const errStream = toPull.source(p.stdio[2])
  output.pipe(p.stdio[0])
  setupConnection()

  let isFinalized = false

  function finalize() {
    isFinalized = true
    p.stdio[1].pipe(res)
  }

  function setupConnection() {
    return pull(
      input,
      utf8(),
      split(),
      queue((end, data, cb) => {
        if (end && !isFinalized) finalize()
        if (end) return cb(end)
        let r = []
        const f = () => cb(null, r)
        if (data) {
          let out = data.replace(/([^\\])(\|)(\|)/g, "$1$2.$3").replace(/([^\|][^\\])(\|)/g, "$1.$2").split(/[^\\]\|/g).map(s => s.replace(/\\\|/g, "|"))
          if (out.length < 2) return f()
          const id = parseInt(out.pop(), 10)
          if (isNaN(id) || !id) return f()
          const cmd = out.shift()
          if (!cmd.match(/^[a-z]+$/)) return f()
          r.push({
            id,
            cmd,
            args: out
          })
        }
        cb(null, r)
      }, {
        sendMany: true
      }),
      pull.drain(data => {
        if (!cmds[data.cmd]) return push({
          error: "CMD " + data.cmd + " unknown!"
        })
        try {
          cmds[data.cmd](data.args, req, res, (err, res) => {
            if (err) throw err
            push(res)
          })
        } catch (e) {
          console.error(e)
          return push({
            error: "Internal Error!"
          })
        }
      })
    )
  }
}
