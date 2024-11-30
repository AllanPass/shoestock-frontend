const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'produtos_cadastrados',
  timestamps: true
});

// Sincroniza o modelo com o banco de dados
Produto.sync();

module.exports = Produto;
