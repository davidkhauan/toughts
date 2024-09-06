const { Sequelize } = require ('sequelize')

const sequelize = new Sequelize ('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log ('Conexão bem sucedida!')
} catch (error) {
    console.log (`Não foi possível conectar: ${error}`)
}

module.exports = sequelize