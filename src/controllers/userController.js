
const user = require('../ORM/sequelizeControler').getInstance().user;


// Checks if <userEmail> and <userPassword> corresponds to a user in the database (<userPassword> can be omited)
function existsUser(userEmail, userPassword){
    if(userEmail != undefined){
        let whereJson;
        if(userPassword != undefined)
            whereJson = {email: userEmail, password: userPassword};
        else
            whereJson = {email: userEmail};

        return new Promise((resolve, reject) => {
            user.findAll({attributes: ['email', 'password'], where: whereJson}).then(foundUsers => {
                if(foundUsers.length != 0)
                    resolve(true);
                else
                    resolve(false);
            }).catch(err => {
                reject(err);
            });

        });
    }
    else
        return false;
}


// Endpoints controllers

// Creates a new user in the database if it doesn't exists
function postUsersController(req, res){
    const userEmail = req.body.email
    const userPassword = req.body.password
    if(userEmail != undefined && userPassword != undefined){
        existsUser(userEmail).then(existsUserResult => {
            if(existsUserResult)
                res.status(400).send("User Already Exists");
            else{
                user.create({email: userEmail, password: userPassword}).then(() => {
                    res.status(200).send("User Created");
                }).catch(err => {
                    res.status(500).send("Database Connection Error");
                });
            }
        }).catch(err => {
            res.status(500).send("Database Connection Error");
        })
    }
    else
        res.status(400).send("Missing Required Parameters");
}

// Checks if the email and password correspond to a registered user in the database
function getLoginController(req, res){
    const userEmail = req.query.email
    const userPassword = req.query.password
    if(userEmail != undefined && userPassword != undefined){
        existsUser(userEmail, userPassword).then(existsUserResult => {
            if(existsUserResult)
                res.status(200).send("User Logged In");
            else
                res.status(400).send("Invalid User");
        }).catch(err => {
            res.status(500).send("Database Connection Error");
        })
    }
    else
        res.status(400).send("Missing Required Parameters");
}

// Returns the emails and passwords of all the users in the database
function getUsersController(req, res){
    if(req.query.password != undefined && req.query.password == "admin")
        user.findAll({attributes: ['email', 'password']}).then(foundUsers => {
            const usersArray = [];
            foundUsers.forEach(user => {
                usersArray.push(user.dataValues);
            });
            res.status(200).send(usersArray);
        }).catch(err => {
            res.status(500).send("Database Connection Error");
        });
    else
        res.status(400).send("Bad Request");
}


module.exports = {
    getUsersController,
    postUsersController,
    getLoginController
}
