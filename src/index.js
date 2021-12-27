require('dotenv').config();

// Express initialization
const express = require("express");
const app = express();
app.use(express.json());


// Sequelize initialization
const DBConfig = require('../config/config.js')[process.env.NODE_ENV];
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
    host: DBConfig.host,
    dialect: DBConfig.dialect,
    logging: false
});

const projectInfo = require(__dirname + "\\models\\registro.js")(sequelize, Sequelize.DataTypes);
const user = require(__dirname + "\\models\\user.js")(sequelize, Sequelize.DataTypes);

projectInfo.sync();
user.sync();

/*
const createEndpoints = require('./routes/userController.js');
createEndpoints(app);
*/


// Checks if <userEmail> and <userPassword> corresponds to a user in the database (<userPassword> can be omited)
async function existsUser(userEmail, userPassword){
    if(userEmail != undefined){
        let userCheck;
        if(userPassword != undefined)
            userCheck = await user.findAll({attributes: ['email', 'password'], where: {email: userEmail, password: userPassword}});
        else
            userCheck = await user.findAll({attributes: ['email', 'password'], where: {email: userEmail}});
        return userCheck.length == 1;
    }
    else
        return false;
}


// Endopoints

// GET /health --> returns {"nombre": "Neocomplexx", "version": "1.0.0"}
app.get('/health', (req, res) => {
    const getProjectInfo = async function(){
        const info = await projectInfo.findAll({attributes: ['nombre', 'vers']});
        res.json({nombre: info[0].dataValues.nombre, version: info[0].dataValues.vers});
    }
    getProjectInfo();
});

// POST /users  body: {"email": "<userEmail>", "password": "<userPassword>"} --> creates a user with <userEmail> and <userPassowrd> if it doesn't exists
app.post('/users', (req, res) => {
    const registerUser = async function(userEmail, userPassword){
        if(! await existsUser(userEmail)){
            await user.create({email: userEmail, password: userPassword});
            res.send("Se creo el usuario");
        }
        else
            res.send("El usuario indicado ya se encuentra registrado");
    }
    
    const userEmail = req.body.email
    const userPassword = req.body.password
    if(userEmail != undefined && userPassword != undefined)
        registerUser(userEmail, userPassword);
    else
        res.send("Parametros incorrectos");
});

// GET /login?email=<userEmail>&password=<userPassword> --> checks if <userEmail> and <userPassword> corresponds to a registered user
app.get('/login', (req, res) => {
    const login = async function(userEmail, userPassword){
        if(await existsUser(userEmail, userPassword))
            res.send("Usuario logueado");
        else
            res.send("Usuario invalido");
    }
    if(req.query.email != undefined && req.query.password != undefined)
        login(req.query.email, req.query.password);
    else
        res.send("Parametros incorrectos");
})

// GET /users?password=admin --> returns the emails and passwords of all the registered users
app.get('/users', (req, res) => {
    if(req.query.password != undefined && req.query.password == "admin"){
        const returnUsers = async function(){
            const users = await user.findAll({attributes: ['email', 'password']});
            const result = [];
            users.forEach(element => {
                result.push(element.dataValues);
            });
            res.send(result);
        }
        returnUsers();
    }
    else
        res.send("Contraseña incorrecta");
})


// Start server
app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto " + process.env.PORT)
});