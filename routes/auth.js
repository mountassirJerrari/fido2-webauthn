const express = require('express')
const {registration}= require ('../controllers/auth')
const {username} = require('../controllers/user')


const router = express.Router()


router.post('/registerRequest', registration)
router.get('/',(req,res)=>{
    res.render('auth.html')
})

module.exports = router