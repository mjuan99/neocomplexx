module.exports =  (app) => {

    const userController = require('../controllers/userController.js')
    userController.initializeDatabase()
    

    // Endopoints
    
    // POST /users  body: {"email": "<userEmail>", "password": "<userPassword>"} --> creates a user with <userEmail> and <userPassowrd> if it doesn't exists
    app.post('/users', (req, res) => {
        const userEmail = req.body.email
        const userPassword = req.body.password
        if(userEmail != undefined && userPassword != undefined)
            (async () => {
                if(await userController.registerUser(userEmail, userPassword))
                    res.send("Se creo el usuario");
                else
                    res.send("El usuario indicado ya se encuentra registrado");
            })()
        else
            res.send("Parametros incorrectos");
    });
    
    // GET /login?email=<userEmail>&password=<userPassword> --> checks if <userEmail> and <userPassword> corresponds to a registered user
    app.get('/login', (req, res) => {
        const userEmail = req.query.email
        const userPassword = req.query.password
        if(userEmail != undefined && userPassword != undefined)
            (async () => {
                if(await userController.login(userEmail, userPassword))
                    res.send("Usuario logueado");
                else
                    res.send("Usuario invalido");
            })()
        else
            res.send("Parametros incorrectos");
    })
    
    // GET /users?password=admin --> returns the emails and passwords of all the registered users
    app.get('/users', (req, res) => {
        if(req.query.password != undefined && req.query.password == "admin"){
            (async () => {
                res.send(await userController.getUsers());
            })()
        }
        else
            res.send("Contraseña incorrecta");
    })
}
