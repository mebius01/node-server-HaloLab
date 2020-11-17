const { Router } = require('express');
const router = Router();
const {Category, Product, Log} = require('./models');
const { getAllData, getOneData } = require('./views');

router.get('/category', getAllData(Category));

router.get('/product', getAllData(Product));

router.get('/product/:id', getOneData(Product));

router.get('/category/:id', getOneData(Category));

router.get('/log', getAllData(Log));


module.exports = router;