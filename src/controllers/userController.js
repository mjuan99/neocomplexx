
const user = require('../ORM/sequelizeControler').getInstance().user;


// Endpoints controllers

// Creates a new user in the database if it doesn't exists
async function postUsersController(req, res){
    const {email, password} = req.body;
    try{
        if(email != undefined && password != undefined){
            const foundUser = await user.findOne({attributes: ['email', 'password'], where: {email: email}});
            if(foundUser != null)
                res.status(400).send("User Already Exists");
            else{
                await user.create({email: email, password: password});
                res.status(200).send("User Created");
            }
        }
        else
            res.status(400).send("Missing Required Parameters");
    }
    catch(error){
        res.status(500).send("Database Connection Error");
    }
}

// Checks if the email and password correspond to a registered user in the database
async function getLoginController(req, res){
    const {email, password} = req.query;
    try{
        if(email != undefined && password != undefined){
            const foundUser = await user.findOne({attributes: ['email', 'password'], where: {email: email, password: password}});
            if(foundUser != null)
                res.status(200).send("User Logged In");
            else
                res.status(400).send("Invalid User");
        }
        else
            res.status(400).send("Missing Required Parameters");
    }
    catch(error){
        res.status(500).send("Database Connection Error");
    }
}

// Returns the emails and passwords of all the users in the database
async function getUsersController(req, res){
    try{
        if(req.query.password != undefined && req.query.password == "admin"){
            const foundUsers = await user.findAll({attributes: ['email', 'password']})
            res.status(200).send(foundUsers.map(user => user.dataValues));
        }
        else
            res.status(400).send("Bad Request");
    }
    catch(error){
        res.status(500).send("Database Connection Error");
    }
}


module.exports = {
    getUsersController,
    postUsersController,
    getLoginController
}
