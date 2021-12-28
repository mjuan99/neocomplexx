
const user = require('../ORM/sequelizeControler').getInstance().user;


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


// Endpoints controllers

// Creates a new user in the database if it doesn't exists
async function postUsersController(req, res){
    const userEmail = req.body.email
    const userPassword = req.body.password
    if(userEmail != undefined && userPassword != undefined)
        if(! await existsUser(userEmail)){
            await user.create({email: userEmail, password: userPassword});
            res.send("Se creo el usuario");
        }
        else
            res.send("El usuario indicado ya se encuentra registrado");
    else
        res.send("Parametros incorrectos");
}

// Checks if the email and password correspond to a registered user in the database
async function getLoginController(req, res){
    const userEmail = req.query.email
    const userPassword = req.query.password
    if(userEmail != undefined && userPassword != undefined)
        if(await existsUser(userEmail, userPassword))
            res.send("Usuario logueado");
        else
            res.send("Usuario invalido");
    else
        res.send("Parametros incorrectos");
}

// Returns the emails and passwords of all the users in the database
async function getUsersController(req, res){
    if(req.query.password != undefined && req.query.password == "admin"){
        const users = await user.findAll({attributes: ['email', 'password']});
        const result = [];
        users.forEach(element => {
            result.push(element.dataValues);
        });
        res.send(result);
    }
    else
        res.send("Contraseña incorrecta");
}


module.exports = {
    getUsersController,
    postUsersController,
    getLoginController
}
