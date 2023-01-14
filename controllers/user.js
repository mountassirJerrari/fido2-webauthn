
const crypto = require('crypto');
const base64url = require('base64url');
const User = require('../models/user');


module.exports.username = async (req , res)=>{
       // this controller see if the user already exist in our database and return an user object 
        const {username,displayName} = req.body;
        // Only check username, no need to check dispalyName
        if (!username || !/[a-zA-Z0-9-_]+/.test(username)) {
          res.status(400).send({ error: 'Bad request ,  invalid username' });
          console.log('error');
          return;
        } else {
           
            let user = await User.findOne({username : username})
            if (!user) {
                user = {
                username: username,
                displayName: displayName,
                id: base64url.encode(crypto.randomBytes(32)),
                credentials: []
              }
             
              user = await User.create(user)
            }
          // Set username in the session
          req.session.user = user;
          req.session.username = user.username
          console.log('user stored to the session');
          res.json(user);
        }
    
}