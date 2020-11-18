const client = require("./redis");
const timeRequest = require("./timeRequest");
const { Log } = require("./models");

const ttlLocal = 15;
const ttlRedis = 30;
let queryRedis = { fake: "fake" };
let queryLocal = { fake: "fake" };

function setCache(key, object) {
  queryLocal = { [key]: object };
  queryRedis = { [key]: object };
  client.set(key, JSON.stringify(object));
}

// Подумай пожалуйста как убрать вложенные if-else, их очень сложно читать
// Вот статья которая может помочь https://blog.codinghorror.com/flattening-arrow-code/
function getOneData(obj) {
  return async (req, res) => {
    try {
      const pk = req.params.id;
      let req_start = new Date(); // Временная точка начала запроса
      const originalUrl = req.originalUrl; // Является ключом для кеша

      if (originalUrl === Object.keys(queryLocal)[0]) {
        // Если ключ есть в queryLocal то работает это блок
        const object = queryLocal[originalUrl];
        res.status(200).json(object); // Ответ в формате JSON
        timeRequest("Node", req_start, originalUrl); // Функция считает время работы блока
      } else {
        if (originalUrl === Object.keys(queryRedis)[0]) {
          // Если ключ есть в queryRedis то работает это блок
          client.get(originalUrl, (err, object) => {
            // Получить значение по ключу в Redis
            if (err) console.log(err.message); // Выкинуть ошибку Redis в консоль
            res.status(200).json(JSON.parse(object)); // Ответ в формате JSON
            timeRequest("Redis", req_start, originalUrl); // Функция считает время работы блока
          });
        } else {
          const object = await obj.findByPk(+pk); // Если queryLocal & queryRedis пусты работает этот блок
          res.status(200).json(object); // Ответ в формате JSON
          timeRequest("DB", req_start, originalUrl); // Функция считает время работы блока

          setTimeout(() => {
            // Сброс queryRedis, Redis
            client.del(originalUrl, (err, reply) => {
              if (err) {
                console.log(err.message);
              } else {
                queryRedis = { fake: "fake" };
                console.log("Redis Del", reply);
              }
            });
          }, 1000 * ttlRedis);

          setTimeout(() => {
            // Сброс queryLocal
            queryLocal = { fake: "fake" };
          }, 1000 * ttlLocal);

          setCache(originalUrl, object); // Устанавливает значения для queryLocal & queryRedis
        }
      }
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
