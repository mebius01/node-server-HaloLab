```bash
.
├── api
│   ├── models.js             # Файл описывает модели БД
│   ├── postgresql.js         # Файл настройки PostgreSQL
│   ├── redis.js              # Файл настройки Redis
│   ├── routes.js             # Логика маршрутов
│   ├── timeRequest.js        # Модуль логирует время ответа
│   └── views.js              # Логика обработки ответов запросов
├── public                    # Статика
│   ├── css
│   │   └── index.css
│   └── index.html
├── utils                     # Вспомогательные скрипты для загрузки данных в БД
│   ├── fixtures
│   │   ├── Category.json
│   │   └── Product.json
│   ├── uploadDataCategory.js
│   └── uploadDataProduct.js
├── index.js                  # Основной скрипт запуска
├── package.json
├── package-lock.json
└── README.md
 
```

# 0. Зависимости
 * Python >= 3.6
 * OS (Debian, Ubuntu)

# 1. Установить сервер Redis
```bash
apt install redis-server
```
# 2. Протестировать Redis
```bash
redis-cli # ping
```
## За работой Redis можно следить
```bash
redis-cli monitor
```
# 3. Скачать репозиторий 
```bash
git clone git@github.com:mebius01/node-server-HaloLab.git
```
# 4. Установить необходимые зависимости
```bash
npm install
```
# 5. Test App
```bash
npm run test
```
# 6. Запустить API сервер (Development mode)
```bash
npm run dev
```
# 7. Запустить API сервер (Production mode)
```bash
npm run start
```