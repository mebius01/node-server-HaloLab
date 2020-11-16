const client = require('./redis');
const timeRequest = require('./timeRequest')

const ttlLocal = 3;
const ttlRedis = 5;
let queryRedis = {q:'q'};
let queryLocal = {q:'q'};


function setCache(key, object) {
  queryLocal = {[key]: object}
  queryRedis = {[key]: object}
  client.set(key, JSON.stringify(object));
}


function getOneData(obj) {
  return async (req, res) => {
    try {
      const pk = req.params.id;
      let req_start = new Date();                        // Временная точка начала запроса
      const originalUrl = req.originalUrl                // Является ключом для кеша

      if (originalUrl === Object.keys(queryLocal)[0]) {  // Если ключ есть в queryLocal то работает это блок
        const object = queryLocal[originalUrl]
        res.status(200).json(object);                    // Ответ в формате JSON
        timeRequest('LOCAL', req_start)                  // Функция считает время работы блока
      }

      else {
        if (originalUrl === Object.keys(queryRedis)[0]) { // Если ключ есть в queryRedis то работает это блок
          client.get(originalUrl, (err, object) => {      // Получить значение по ключу в Redis
            if (err) console.log(err.message)             // Выкинуть ошибку Redis в консоль
            res.status(200).json(JSON.parse(object));     // Ответ в формате JSON
            timeRequest('REDIS', req_start)               // Функция считает время работы блока
          })
        }

        else {
          const object = await obj.findByPk(+pk);         // Если queryLocal & queryRedis пусты работает этот блок
          res.status(200).json(object);                   // Ответ в формате JSON
          timeRequest('PostgreSQL', req_start)            // Функция считает время работы блока

          setTimeout(() => {                              // Сброс queryRedis, Redis 
            client.del(originalUrl, (err, reply) => {
              if (err) {
                console.log(err.message)
              }
              else {
                queryRedis = {q:'q'}
                console.log("Redis Del", reply);
              }
          }
          )}, 1000 * ttlRedis);

          setTimeout(() => {                              // Сброс queryLocal
            queryLocal = {q:'q'}
          }, 1000 * ttlLocal);

          setCache(originalUrl, object)                   // Устанавливает значения для queryLocal & queryRedis
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
      const object = await obj.findAll();
      res.status(200).json(object);
    } catch (error) {
      res.status(400).json({ msg: "400 Bad Request" });
    }
  };
}

module.exports = {getAllData, getOneData}