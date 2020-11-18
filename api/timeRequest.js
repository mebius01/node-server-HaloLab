const { Log } = require("./models");

async function timeRequest(cacheName, reqStart, requestName) {
  const timeQuery = new Date() - reqStart;

  const data = {
    requestName,
    cacheName,
    timeQuery,
  };

  await Log.create(
    {
      Request: data.requestName,
      [cacheName]: data.timeQuery
    }
  );
}

module.exports = timeRequest;
