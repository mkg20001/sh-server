module.exports = {
  header: (args, req, res, cb) => {
    res.setHeader(args[0], args[1])
    cb()
  },
  status: (args, req, res, cb) => {
    res.status(parseInt(args[0], 10))
    cb()
  }
}
