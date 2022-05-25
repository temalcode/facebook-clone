const passport = require('passport')
const localstrategy = require('passport-local').Strategy
const userModel = require('./models/userModel')
const bcrypt = require('bcrypt')


async function initialize(username, password, done) {
    try{
        let userProfile = await userModel.findOne({username: username})
        if(!userProfile){
            console.log('username not found')
            return done(null, false)
        }
        let isPasswordCorrect = await bcrypt.compare(password, userProfile.password)
        if(!isPasswordCorrect){
            console.log('password incorrect')
            return done(null, false)
        } else{
            return done(null, userProfile)
        }
    } catch(err){
        done(err)
    }
}


let ppStategy = new localstrategy(initialize)
passport.use(ppStategy)

passport.serializeUser((user, done) => {
    // console.log('serial')
    // console.log(user)
    // console.log('serial' + user._id)
    done(null, user._id)
});

passport.deserializeUser(async (userId, done) => {
    // console.log('deserial')
    // console.log(userId)
    try{
        let userProfile = await userModel.findById(userId)
        if(userProfile){
            return done(null, userProfile)
        }
    } catch(err){
        return done(err)
    }
    
});



module.exports = initialize