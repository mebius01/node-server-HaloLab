const { Sequelize } = require('sequelize');

const opts = {
  define: {
    freezeTableName: true,
    underscored: true,
  }
};

const postgres = 'postgres://jpvqpmem:5ybCzBTVg19wlyFLX3mEYcM_oOV79Waj@lallah.db.elephantsql.com:5432/jpvqpmem';

const sequelize = new Sequelize(postgres, opts);

module.exports = sequelize;