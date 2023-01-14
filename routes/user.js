const express = require('express')

const {username} = require('../controllers/user')


const router = express.Router()



router.post('/username', username)
router.get('/',(req,res)=>{
    res.json({
        sus:"ds"
    })
})
module.exports = router