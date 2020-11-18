const { Log } = require("./models");

/* Функция принимает "Имя кеша" и "Время обработки запроса"
  И возвращает словарь ~ { timeDB: 620 } 
**/

// Не понятно зачем нужна эта функция. Она возвращает имя кеша и время которые у тебя и так есть.
function checkingCacheName(cacheName, timeQuery) {
  if (cacheName == "Node") {
    return { timeNode: timeQuery };
  }
  if (cacheName == "Redis") {
    return { timeRedis: timeQuery };
  }
  if (cacheName == "DB") {
    return { timeDB: timeQuery };
  }
}

// Лог не совсем верно работает.
// Он не должен проверять есть ли уже такая запись в базе, но записывать каждое новое обращение за данными
// и фиксировать сколько времени оно заняло

/* Функция принимает "Имя кеша", "Время старта запроса", "Имя запроса" и расчитывает "Время обработки запроса",
 **/
async function timeRequest(cacheName, reqStart, requestName) {
  const timeQuery = new Date() - reqStart;

  const data = {
    requestName,
    cacheName,
    timeQuery,
  };

  // Пытается найти по Имени запроса строку в БД
  const log = await Log.findOne({ where: { Request: data.requestName } });

  /* Если все плохо фрмирует новую запись,
  логично предположить, что еcли это новая запись,
  то запрос идет из БД
  **/
  if (log === null) {
    console.log(`${data.requestName} - Not found`.red);
    Log.create({
      Request: data.requestName,
      timeDB: data.timeQuery,
      timeRedis: 0,
      timeNode: 0,
    });
    console.log(`${data.requestName} - Saved`.blue);
  } else {
    /* 
  Если есть что-то по "Имени запроса", то обновляет данные
  в соответствующих полях
  **/
    const checking = Object.keys(
      checkingCacheName(data.cacheName, data.timeQuery)
    )[0];
    log[checking] = data.timeQuery;
    await log.save();
    console.log(`${data.requestName} - Updated`.blue);
  }
}

module.exports = timeRequest;
