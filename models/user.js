const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique : true
  },
  displayName: {
    type: String,
    required: true,
    unique : true
  },
  id : {
    type : String , 
    required : true
  } ,
  credentials:[{ credId: String, type: String , transports:[String] }]
  ,
  createdAt: {
    type: Date,
    default: Date.now(),
  }

})

module.exports = mongoose.model('User', userSchema)