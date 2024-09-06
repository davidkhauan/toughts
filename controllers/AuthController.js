const bcrypt = require ('bcryptjs')
const User = require ('../models/UserModel')

class AuthController {
    static login (requisition, response) {
        response.render ('auth/login')
    }

    static async loginPost (requisition, response) {
        const { email, password } = requisition.body

        const user = await User.findOne ({ where: { email: email } })

        if (!user) {
            requisition.flash ('message', 'Usuário não encontrado!')
            response.render ('auth/login')

            return
        }

        const passwordMatch = bcrypt.compareSync (password, user.password)

        if (!passwordMatch) {
            requisition.flash ('message', 'Senha inválida!')
            response.render ('auth/login')

            return
        }

        requisition.session.UserId = user.id

        requisition.flash ('message', 'Login realizado com sucesso!')

        requisition.session.save (() => {
            response.redirect ('/')
        })
    }

    static register (requisition, response) {
        response.render ('auth/register')
    }

    static async registerPost (requisition, response) {
        const { name, email, password, confirmepassword } = requisition.body

        if (password != confirmepassword) {
            requisition.flash ('message', 'Senhas erradas, tente novamente!')
            response.render ('auth/register')

            return
        }

        const checkIfUserExists = await User.findOne ({ where: { email: email } })

        if (checkIfUserExists) {
            requisition.flash ('message', 'Email já cadastrado, tente novamente!')
            response.render ('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync (10)
        const hashedPassword = bcrypt.hashSync (password, salt)

        const user = ({
            name,
            email,
            password: hashedPassword
        })

        try {
            const createdUser = await User.create (user)
            
            requisition.session.UserId = createdUser.id

            requisition.flash ('message', 'Cadastro realizado com sucesso!')

            requisition.session.save (() => {
                response.redirect ('/')
            })
        } catch (error) {
            console.log (error)
        }
    }

    static logout (requisition, response) {
        requisition.session.destroy()
        response.redirect ('/login')
    }
}

module.exports = AuthController