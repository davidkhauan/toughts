const { DataTypes } = require ('sequelize')

const DB = require ('../db/connection')

const User = DB.define ('User', {
    name: {
        type: DataTypes.STRING,
        require: false
    },
    email: {
        type: DataTypes.STRING,
        require: true
    },
    password: {
        type: DataTypes.STRING,
        require: true
    }
})

module.exports = User