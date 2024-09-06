const Tought = require ('../models/ToughtModel')
const User = require ('../models/UserModel')

const { Op } = require ('sequelize')

class ToughtController {
    static async showToughts (requisition, response) {
        let search = ''

        if (requisition.query.search) {
            search = requisition.query.search
        }

        let order = 'DESC'

        if (requisition.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll ({
            include: User,
            where: {
                title: { [ Op.like ]: `%${search}%` }
            },
            order: [['createdAt', order]]
        })

        const toughts = toughtsData.map ((result) => result.get ({ plain: true }))

        let toughtsQty = toughts.length

        if (toughtsQty === 0) {
            toughtsQty = false
        }

        response.render ('toughts/home', { toughts, search, toughtsQty })
    }

    static createTought (requisition, response) {
        response.render ('toughts/create')
    }

    static async updateTought (requisition, response) {
        const id = requisition.params.id

        const tought = await Tought.findOne ({ where: { id: id }, raw: true })

        response.render ('toughts/edit', { tought })
    }

    static async removeTought (requisition, response) {
        const id = requisition.body.id
        const UserId = requisition.session.UserId

        try {
            await Tought.destroy ({ where: { id: id, UserId: UserId } })

            requisition.flash ('message', 'Pensamento removido com sucesso!')

            requisition.session.save (() => {
                response.redirect ('/toughts/dashboard')
            })
        } catch (error) {
            console.log ("Ocorreu um erro: " + error)
        }
    }

    static async updateToughtSave (requisition, response) {
        const id = requisition.body.id

        const tought = {
            title: requisition.body.title
        }

        try {
            await Tought.update (tought, { where: { id: id } })
    
            requisition.flash ('message', 'Pensamento atualizado com sucesso!')
    
            requisition.session.save (() => {
                response.redirect ('/toughts/dashboard')
            })
        } catch (error) {
            console.log ("Ocorreu um erro: " + error)
        }
    }

    static async createToughtSave (requisition, response) {
        const tought = {
            title: requisition.body.title,
            UserId: requisition.session.UserId
        }

        try {
            await Tought.create (tought)
    
            requisition.flash ('message', 'Pensamento criado com sucesso!')
    
            requisition.session.save (() => {
                response.redirect ('/toughts/dashboard')
            })
        } catch (error) {
            console.log ("Ocorreu um erro: " + error)
        }
    }

    static async showDashboard (requisition, response) {
        const UserId = requisition.session.UserId

        const user = await User.findOne ({ 
            where: { id: UserId },
            include: Tought,
            plain: true
        })

        if (!user) {
            response.redirect ('/login')
        }

        const toughts = user.Toughts.map ((result) => result.dataValues)

        let emptyToughts = false

        if (toughts.length === 0) {
            emptyToughts = true
        }

        response.render ('toughts/dashboard', { toughts, emptyToughts })
    }
}

module.exports = ToughtController