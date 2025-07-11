const responseMiddleware = (err, req, res, next) => {
  const originalResponse = res.json
  res.json = function (data) {
    let message = res.locals.message || data?.message || ""

    if (data?.message) {
      delete data.message
      data = null
    }
    const response = {
      status: "success",
      code: res.statusCode,
      data: data,
      message: message
    }
    return originalResponse.call(this, response)
  }
  next()
}

export default responseMiddleware
