const path = require('path');
const fs = require('fs');
const Product = require('../models/product');


const file = path.join(__dirname, 'fixtures', 'Product4.json')
const rawData = fs.readFileSync(file)
const jsonData = JSON.parse(rawData)
let counter = 0

jsonData.forEach(async element => {
  try {
    let {fields} = element
    const product = await Product.create({
      id: element.pk,
      name: fields.name,
      slug: fields.slug,
      vendor_code: fields.vendor_code,
      vendor: fields.vendor,
      price: fields.price,
      stock: fields.stock,
      available: fields.available,
      created: fields.created,
      updated: fields.updated,
      category_id: fields.category,
    });
    const inst = product instanceof Product
    if (inst) {
      counter+=1
    }
    console.log(inst, counter+=1);
  } catch (error) {
    console.log(error);
  }
});

// {
//   model: 'api.product',
//   pk: 100,
//   fields: {
//     category: 81,
//     name: 'Фотобумага ColorWay матовая 108г/м, LT PM108-500_OEM',
//     slug: 'bumaga-cw-matovaia-108g-m-lt-pm108-500-oem-pm108500lt-oem',
//     vendor_code: 'PM108500LT_OEM',
//     vendor: 'ColorWay',
//     price: '245.98',
//     stock: 0,
//     available: false,
//     created: '2019-03-03T22:09:47.647Z',
//     updated: '2019-12-01T17:10:36.586Z'
//   }
// },
