function timeRequest(cacheName, reqStart, requestName) {
  const timeQuery = new Date() - reqStart

    const data = {
      requestName,
      cacheName,
      timeQuery
    }

    return data
}

module.exports = timeRequest