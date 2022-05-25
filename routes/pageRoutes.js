const express = require('express')
const router = express.Router()
router.use(express.static('public'))
router.use(express.json())
router.use(express.urlencoded({extended: true}))

const postModel = require('../models/postModel')

router.get('/feed', async (req, res) => {
    try{
        if(req.isUnauthenticated()){
            return res.redirect('/')
        }
        let allPosts = await postModel.find().sort({createdAt: -1})
        res.render('feed', {posts: allPosts, user: req.user})
    } catch(err){
        res.status(500).send(err.message)
    }
})



module.exports = router