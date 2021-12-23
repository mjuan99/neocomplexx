const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('neocomplexx', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

const registro = sequelize.define('registro', {
    nombre: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    vers: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'registro',
    timestamps: false
});

registro.sync();

const getRegistro = async function(){
    const registros = await registro.findAll({attributes: ['nombre', 'vers']});
    console.log("registros: ")
    console.log(registros[0].dataValues)
}

getRegistro()

/*sequelize.authenticate().then(() => {console.log('Conectado correctamente');}, () => {console.error('Error de conexion: ', error);})*/;

if (false){
    const mysql = require('mysql2');
    const con = mysql.createConnection({host: "localhost", user: "root", password: "root", database: "neocomplexx"});

    con.connect(err => {
        if (err)
            console.log("Error al conectarse a la base de datos");
        else{
            con.query("SELECT * FROM registro", (err, result, fields) => {
                if (!err)
                    console.log(result[0])
                else
                    res.send("Error de conexion")
            })
        }
    })
}