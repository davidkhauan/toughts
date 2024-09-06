const express = require ('express')
const expHandlebars = require ('express-handlebars')
const session = require ('express-session')
const FileStore = require ('session-file-store') (session)
const flash = require ('express-flash')

const app = express()

const connection = require ('./db/connection')

const ToughtModel = require ('./models/ToughtModel')
const UserModel = require ('./models/UserModel')
const ToughtController = require ('./controllers/ToughtController')

const toughtsRoutes = require ('./routes/toughtsRoutes')
const authRoutes = require ('./routes/authRoutes')

app.engine ('handlebars', expHandlebars.engine())
app.set ('view engine', 'handlebars')

app.use (express.urlencoded ({ extended: true }))
app.use (express.json())

app.use (session ({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore ({
            logFn: function() {},
            path: require ('path').join (require ('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date (Date.now() + 360000),
            httpOnly: true
        }
    })
)

app.use (flash())
app.use (express.static ('public'))

app.use ((requisition, response, next) => {
    if (requisition.session.UserId) {
        response.locals.session = requisition.session
    }

    next()
})

app.use ('/toughts', toughtsRoutes)
app.use ('/', authRoutes)

app.get ('/', ToughtController.showToughts)

connection.sync()
    .then (() => {
        app.listen (3000)
    })
    .catch ((error) => console.error (error))