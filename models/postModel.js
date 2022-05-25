
const mongoose = require('mongoose')

let postSchema = mongoose.Schema({

    caption: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 300
    }, 
    owner: {
        type: Object,
    }, 
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})


module.exports = mongoose.model('posts', postSchema)