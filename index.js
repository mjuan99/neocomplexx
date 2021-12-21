require('dotenv').config();

// Inicializacion de express
const express = require("express");
const app = express();

app.use(express.json());

//Inicializacion de sequelize
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false
});

const registro = require(__dirname + "\\models\\registro.js")(sequelize, Sequelize.DataTypes);
const user = require(__dirname + "\\models\\user.js")(sequelize, Sequelize.DataTypes);

registro.sync();
user.sync();

// Consulta en la base de datos si existe un usuario con ese email y password (el password puede ser omitido)
async function existeUsuario(userEmail, userPassword){
    if(userEmail != undefined){
        let usuario;
        if(userPassword != undefined)
            usuario = await user.findAll({attributes: ['email', 'password'], where: {email: userEmail, password: userPassword}});
        else
            usuario = await user.findAll({attributes: ['email', 'password'], where: {email: userEmail}});
        return usuario.length == 1;
    }
    else
        return false;
}

// GET /health --> retorna {"nombre": "Neoxomplexx", "version": "1.0.0"}
app.get('/health', (req, res) => {
    const retornarRegistro = async function(){
        const registros = await registro.findAll({attributes: ['nombre', 'vers']});
        res.json({nombre: registros[0].dataValues.nombre, version: registros[0].dataValues.vers});
    }
    retornarRegistro();
});

// POST /users  body: {"email": "<userEmail>", "password": "<userPassword>"} --> crea un usuario con el email y password indicados en caso de que no exista
app.post('/users', (req, res) => {
    const registrarUsuario = async function(userEmail, userPassword){
        if(! await existeUsuario(userEmail)){
            await user.create({email: userEmail, password: userPassword});
            res.send("Se creo el usuario");
        }
        else
            res.send("El usuario indicado ya se encuentra registrado");
    }
    
    const userEmail = req.body.email
    const userPassword = req.body.password
    if(userEmail != undefined && userPassword != undefined)
        registrarUsuario(userEmail, userPassword);
    else
        res.send("Parametros incorrectos");
});

// GET /login?email=<userEmail>&password=<userPassword> --> indica si el email y password se corresponden con un usuario registrado
app.get('/login', (req, res) => {
    const login = async function(userEmail, userPassword){
        if(await existeUsuario(userEmail, userPassword))
            res.send("Usuario logueado");
        else
            res.send("Usuario invalido");
    }
    if(req.query.email != undefined && req.query.password != undefined)
        login(req.query.email, req.query.password);
    else
        res.send("Parametros incorrectos");
})

// GET /users?password=admin --> muestra los emails y passwords de los usuarios registrados
app.get('/users', (req, res) => {
    if(req.query.password != undefined && req.query.password == "admin"){
        const retornarUsuarios = async function(){
            const users = await user.findAll({attributes: ['email', 'password']});
            const resultado = [];
            users.forEach(element => {
                resultado.push(element.dataValues);
            });
            res.send(resultado);
        }
        retornarUsuarios();
    }
    else
        res.send("Contraseña incorrecta");
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto " + process.env.PORT)
});