const express = require('express')
const {registrationReq ,registrationRes}= require ('../controllers/auth')
const {username} = require('../controllers/user')


const router = express.Router()


router.post('/registerRequest',registrationReq)
router.post('/registerResponse',registrationRes)
router.get('/',(req,res)=>{
    res.render('auth.html')
})

module.exports = router