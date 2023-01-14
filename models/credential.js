const mongoose = require('mongoose')

const credantialSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
})

module.exports = mongoose.model('Credantial', credantialSchema)