
const mongoose = require('mongoose')

let Userschema = mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 100
    }
})

module.exports = mongoose.model('users', Userschema)