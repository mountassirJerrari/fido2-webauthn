
const {generateRegistrationOptions} = require('@simplewebauthn/server');
const session = require ("express-session")

const User = require('../models/user');
const RP_NAME = 'test.ma';
const TIMEOUT = 30 * 1000 * 60;
const RP_ID='localhost'

module.exports.registration =  async (req, res) => {
   try{
        const {username , displayName  } = req.body
        const user = await User.create({username , displayName })
       /* const user = db.get('users').find({ username: username }).value();
        try {
          const excludeCredentials = [];
          if (user.credentials.length > 0) {
            for (let cred of user.credentials) {
              excludeCredentials.push({
                id: cred.credId,
                type: 'public-key',
                transports: ['internal'],
              });
            }
          }*/
          const excludeCredentials =[{
            id: "cred.credId",
            type: 'public-key',
            transports: ['internal']
          }]
          ////
          const pubKeyCredParams = [];
          // const params = [-7, -35, -36, -257, -258, -259, -37, -38, -39, -8];
          const params = [-7, -257];
          for (let param of params) {
            pubKeyCredParams.push({ type: 'public-key', alg: param });
          }
         const authenticatorSelection =  {
            "residentKey": false,
            "authenticatorAttachment": "cross-platform",
            "userVerification": "preferred"
        }
        const attestation = "direct" ;
          const options = generateRegistrationOptions({
            rpName: RP_NAME,
            rpID: RP_ID,
            userID: user._id,
            userName: user.username,
            timeout: TIMEOUT,
            // Prompt users for additional information about the authenticator.
            attestationType: attestation,
            // Prevent users from re-registering existing authenticators
            excludeCredentials,
            authenticatorSelection,
          });
          
           req.session.challenge = options.challenge;
      
          // Temporary hack until SimpleWebAuthn supports `pubKeyCredParams`
          options.pubKeyCredParams = [];
          for (let param of params) {
            options.pubKeyCredParams.push({ type: 'public-key', alg: param });
          }
          req.session.user=user
          
          res.json({options , user});
        } catch (e) {
            console.log(e);
          res.status(400).send({ error: e });
        }
     
      
    }
  
  