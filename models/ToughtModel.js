const { DataTypes } = require ('sequelize')

const DB = require ('../db/connection')

const User = require ('./UserModel')

const Tought = DB.define ('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})

Tought.belongsTo (User)
User.hasMany (Tought)

module.exports = Tought