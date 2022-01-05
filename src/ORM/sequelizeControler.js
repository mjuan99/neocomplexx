class PrivateSequelizeController {
    constructor() {
        // Sequelize initialization
        const DBConfig = require('../../config/config.js')[process.env.NODE_ENV ||'development'];
        const { Sequelize, DataTypes } = require('sequelize');
        this.sequelize = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
            host: DBConfig.host,
            dialect: DBConfig.dialect,
            logging: false
        });
        
        this.projectInfo = require('../models/registro.js')(this.sequelize, Sequelize.DataTypes);
        this.user = require("../models/user.js")(this.sequelize, Sequelize.DataTypes);

        this.projectInfo.sync();
        this.user.sync();
    }

}


class SequelizeControllerSingleton {
    constructor() {
        throw new Error('Use SequelizeControllerSingleton.getInstance()');
    }
    
    static getInstance() {
        if (!SequelizeControllerSingleton.instance) {
            SequelizeControllerSingleton.instance = new PrivateSequelizeController();
        }
        return SequelizeControllerSingleton.instance;
    }
}


module.exports = SequelizeControllerSingleton;