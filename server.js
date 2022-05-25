//express
const express = require('express')
const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs')
//dotenv
const dotenv = require('dotenv')
dotenv.config()
//mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, () => console.log('connected to the database'))
//mongo store
const mongoStore = require('connect-mongo')
//passport
const passport = require('passport')
require('./passportConfig')
//path
const path = require('path')

const session = require('express-session')
const sessionStore = mongoStore.create({ mongoUrl: process.env.DB_URL, collectionName: 'sessions' });
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    try{
        if(req.isAuthenticated()){
            return res.redirect('/feed')
        } else{
            res.sendFile(path.join(__dirname, '/public/home.html'));
        }
    } catch(err){
        res.status(500).send(err.message)
    }
})

const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const pageRoutes = require('./routes/pageRoutes')
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/', pageRoutes)

//404
app.get('*', (req, res) => {
    try{
        res.status(400).send('Resource not found, 404 !')
    } catch(err){
        res.status(500).send(err.message)
    }
})

app.listen(process.env.PORT | 5000, () => console.log('server is running'))