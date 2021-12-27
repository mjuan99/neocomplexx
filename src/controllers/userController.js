let user

// Initialize de ORM (sequelize) and connects to the database
async function initializeDatabase(){

    // Sequelize initialization
    const DBConfig = require('../../config/config.js')[process.env.NODE_ENV];
    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
        host: DBConfig.host,
        dialect: DBConfig.dialect,
        logging: false
    });

    user = require("../models/user.js")(sequelize, Sequelize.DataTypes);
    user.sync();
}

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

// Creates a user in the database with <userEmail> and <userPassowrd> if it doesn't exists
async function registerUser(userEmail, userPassword, res){
    if(! await existsUser(userEmail)){
        await user.create({email: userEmail, password: userPassword});
        return true;
    }
    else
    return false;
}

// Checks if <userEmail> and <userPassword> corresponds to a registered user in the database (<userPassword> shouldn't be omited)
async function login(userEmail, userPassword, res){
    if(await existsUser(userEmail, userPassword))
        return true;
    else
        return false;
}

// Returns the emails and passwords of all the users in the database
async function getUsers(){
    const users = await user.findAll({attributes: ['email', 'password']});
    const result = [];
    users.forEach(element => {
        result.push(element.dataValues);
    });
    return result;
}

module.exports = {
    initializeDatabase,
    registerUser,
    login,
    getUsers
}