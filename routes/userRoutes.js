
//express
const express = require('express')
const router = express.Router()
router.use(express.static('public'))
router.use(express.json())
router.use(express.urlencoded({extended: true}))
//model
const userModel = require('../models/userModel')
//bcrypt
const bcrypt = require('bcrypt')
//passport
const passport = require('passport')
//metho override
const methodOverride = require('method-override')
router.use(methodOverride('_method'))


//signup
router.post('/signup', async (req, res) => {
    try{
        let hashedPassword = await bcrypt.hash(req.body.password, 10)
        let newUser = new userModel({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            username: req.body.username,
            profilePictureUrl: req.body.profilePictureUrl,
            password: hashedPassword
        })
        let saveduser = await newUser.save()
        if(saveduser){
            return res.redirect(307, '/users/login')
        }
    } catch(err){
        res.status(500).send(err.message)
    }
})

//login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/login-success',
    failureRedirect: '/users/login-failed'
}))

//login success
router.get('/login-success', (req, res) => {
    try{
        res.status(200).redirect('/feed')
    } catch(err){
        res.status(500).send(err.message)
    }
})

//login faild
router.get('/login-failed', (req, res) => {
    try{
        res.status(400).send('login failed')
    } catch(err){
        res.status(500).send(err.message)
    }
})

//logout
router.delete('/logout', (req, res) => {
    try{
        req.logout()
        res.redirect('/')
    } catch(err){
        res.status(500).send(err.message)
    }
})

module.exports = router