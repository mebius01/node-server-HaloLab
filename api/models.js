const Sequelize = require('sequelize');
const postgresql = require('./postgresql');


const Category = postgresql.define('category', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: "api_category_name_key"
  },
  slug: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: "api_category_slug_key"
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  lft: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  rght: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tree_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  parent_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'category',
      key: 'id'
    }
  }
});


const Product = postgresql.define('product', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(400),
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING(400),
    allowNull: false
  },
  vendor_code: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: "api_product_vendor_code_key"
  },
  vendor: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  available: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'category',
      key: 'id'
    }
  }
});

const Log = postgresql.define('log', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  Request: {
    type: Sequelize.STRING,
    allowNull: false,
    // unique: true
  },
  timeDB: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  timeRedis: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  timeNode: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
});

module.exports = {Category, Product, Log};