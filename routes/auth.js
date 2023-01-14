const express = require('express')
const {registration}= require ('../controllers/auth')


const router = express.Router()


router.get('/', registration)
module.exports = router