const path = require('path');
const express = require('express');
const paginate = require('express-paginate');
const sequelize = require('./api/postgresql');
const routes = require('./api/routes');
require('colors')

const app = express();
const PORT = process.env.PORT || 3000;


app.use(paginate.middleware(80, 50));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', routes);

app.get((req, res) => {
    res.sendFile('/index.html');
});


async function start() {
  try {
    await sequelize.sync();
    app.listen(PORT, () =>  console.log('\x1b[33m', `Server is running on the port ${PORT}...`));
  } catch (error) {
    console.log('\x1b[31m', error);
  }
}

start();
