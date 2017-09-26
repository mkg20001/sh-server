module.exports = {
  header: (args, req, res, cb) => {
    res.setHeader(args[0], args[1])
    cb()
  }
}
