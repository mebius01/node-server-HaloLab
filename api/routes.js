const { Router } = require('express');
const router = Router();
const {Category, Product} = require('./models');
const {getAllData, getOneData} = require('./views')


router.get('/category', getAllData(Category));

router.get('/product', getAllData(Product));

router.get('/product/:id', getOneData(Product));

router.get('/category/:id', getOneData(Category));


module.exports = router;