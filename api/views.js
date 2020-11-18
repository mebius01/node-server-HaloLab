const client = require("./redis");
const timeRequest = require("./timeRequest");

const ttlLocal = 15; //15
const ttlRedis = 30; //30
let queryRedis = { fake: "fake" };
let queryLocal = { fake: "fake" };

function setCache(key, object) {
  queryLocal = { [key]: object };
  queryRedis = { [key]: object };
  client.set(key, JSON.stringify(object));
}

function delCache(keyCache) {
  setTimeout(() => {
    queryLocal = { fake: "fake" };
    console.log("Node Cache Del".red);
  }, 1000 * ttlLocal);

  setTimeout(() => {
    client.del(keyCache, (err) => {
      if (err) console.log(err.message)
      queryRedis = { fake: "fake" };
      console.log("Redis Cache Del".red);
    });
  }, 1000 * ttlRedis);
}

function testCache(key, obj) {
  const objKey = Object.keys(obj)[0]
  return key === objKey
}

// Подумай пожалуйста как убрать вложенные if-else, их очень сложно читать
// Вот статья которая может помочь https://blog.codinghorror.com/flattening-arrow-code/
function getOneData(obj) {
  return async (req, res) => {
    try {
      const pk = req.params.id;
      let req_start = new Date();
      const keyCache = req.originalUrl; 

      // ----------------- Cache block Start
      if ( testCache(keyCache, queryLocal) ) {
        const object = queryLocal[keyCache];
        res.status(200).json(object);
        timeRequest("timeNode", req_start, keyCache);
        console.log('Node Cache'.green);
      }

      else {
        if ( testCache(keyCache, queryRedis) ) {
          client.get(keyCache, (err, value) => {
            if (err) {console.log(err.message)}
            res.status(200).json(JSON.parse(value))
            timeRequest("timeRedis", req_start, keyCache)
          });
          console.log('Redis Cache'.green);
        }
        else {
          const object = await obj.findByPk(+pk)
          res.status(200).json(object)
          timeRequest("timeDB", req_start, keyCache)
          delCache(keyCache)
          setCache(keyCache, object)
          console.log('DB Cache'.green);
        }
      }
    // ----------------- Cache block Stop
      
    } catch (error) {
      res.status(400).json({ msg: "400 Bad Request" });
    }
  };
}

function getAllData(obj) {
  return async (req, res) => {
    try {
      const object = await obj.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
      });
      res.status(200).json(object);
    } catch (error) {
      res.status(400).json({ msg: "400 Bad Request" });
    }
  };
}

module.exports = { getAllData, getOneData };
