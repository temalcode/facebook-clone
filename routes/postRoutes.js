//express
const express = require('express')
const router = express.Router()
router.use(express.static('public'))
router.use(express.json())
router.use(express.urlencoded({extended: true}))
//model
const postModel = require('../models/postModel')
//metho override
const methodOverride = require('method-override')
router.use(methodOverride('_method'))
//dompurify
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

router.post('/create', async (req, res) => {
    try{
        if(req.isUnauthenticated()){
            return req.status(400).redirect('/')
        }
        let newPost = new postModel({
            caption: DOMPurify.sanitize(req.body.caption),
            owner: req.user
        })
        await newPost.save()
        res.redirect('/feed')
    } catch(err){
        res.status(500).send(err.message)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try{
        // res.send('test')
        if(req.isUnauthenticated()){
            return req.status(400).redirect('/')
        }
        let post = await postModel.findById(req.params.id)
        if(post.owner.username == req.user.username){
            await postModel.findByIdAndDelete(req.params.id)
            res.redirect('/feed')
        } else{
            res.status(400).send('You can only delete posts that you own')
        }
    } catch(err){
        res.status(500).send(err.message)
    }
})


module.exports = router