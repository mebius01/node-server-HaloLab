const path = require('path');
const fs = require('fs');
const Category = require('../models/category')

const file = path.join(__dirname, 'fixtures', 'Category.json')

const rawData = fs.readFileSync(file)
const jsonData = JSON.parse(rawData)

jsonData.forEach(async element => {
  let {fields} = element
    const category = await Category.create({
      id: element.pk,
      name: fields.name,
      slug: fields.slug,
      description: fields.description,
      lft: fields.lft,
      rght: fields.rght,
      tree_id: fields.tree_id,
      level: fields.level,
      parent_id: fields.parent,
    });
    console.log(category instanceof Category);
});