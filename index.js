require('dotenv').config();
const port = process.env.PORT;


const express = require("express");
const app = express();


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
});

const registro = require(__dirname + "\\models\\registro.js")(sequelize, Sequelize.DataTypes)

registro.sync();

app.get('/health', (req, res) => {
    const retornarRegistro = async function(){
        const registros = await registro.findAll({attributes: ['nombre', 'vers']});
        res.json({nombre: registros[0].dataValues.nombre, version: registros[0].dataValues.vers});
    }
    retornarRegistro()
});

app.listen(port, () => {
    console.log("Escuchando en el puerto " + port)
});