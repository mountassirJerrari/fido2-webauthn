
const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');

const User = require('../models/user');
const RP_NAME = 'localhost';
const TIMEOUT =  1000 * 120;
const RP_ID = 'localhost' ;




module.exports.registrationReq = async (req, res) => {

  console.log('coming in');
    let user = await req.session.user
    try {
       const excludeCredentials = [];
       
       if (user.credentials.length > 0) {
         for (let cred of user.credentials) {
           excludeCredentials.push({
             id: cred.credId,
             type: 'public-key',
             transports: ['internal'],
           });
         }}
       
    ////
    const pubKeyCredParams = [];
    // const params = [-7, -35, -36, -257, -258, -259, -37, -38, -39, -8];
    const params = [-7, -257];
    for (let param of params) {
      pubKeyCredParams.push({ type: 'public-key', alg: param });
    }
    
    
    const as = {}; // authenticatorSelection
    const aa = req.body.authenticatorSelection.authenticatorAttachment;
    const rr = req.body.authenticatorSelection.requireResidentKey;
    const uv = req.body.authenticatorSelection.userVerification;
    const cp = req.body.attestation; // attestationConveyancePreference
    let asFlag = false;
    let authenticatorSelection;
    let attestation = 'none';

    if (aa && (aa == 'platform' || aa == 'cross-platform')) {
      asFlag = true;
      as.authenticatorAttachment = aa;
    }
    if (rr && typeof rr == 'boolean') {
      asFlag = true;
      as.requireResidentKey = rr;
    }
    if (uv && (uv == 'required' || uv == 'preferred' || uv == 'discouraged')) {
      asFlag = true;
      as.userVerification = uv;
    }
    if (asFlag) {
      authenticatorSelection = as;
    }
    if (cp && (cp == 'none' || cp == 'indirect' || cp == 'direct')) {
      attestation = cp;
    }
    const options = generateRegistrationOptions({
      rpName: RP_NAME,
      
      userID: user.id,
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
    
    res.json(options)
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

module.exports.registrationRes =  async (req, res) => {
  const username = req.session.username;
  const expectedChallenge = req.session.challenge;
  const expectedOrigin = 'to do';
  const expectedRPID =RP_ID;
  const credId = req.body.id;
  const type = req.body.type;

  try {
    const { body } = req;

    const verification = await verifyRegistrationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
    });

    const { verified, authenticatorInfo } = verification;

    if (!verified) {
      throw 'User verification failed.';
    }

    const { base64PublicKey, base64CredentialID, counter } = authenticatorInfo;

    const user = User.find(username);

    const existingCred = user.credentials.find(
      (cred) => cred.credID === base64CredentialID,
    );

    if (!existingCred) {
      /**
       * Add the returned device to the user's list of devices
       */
      user.credentials.push({
        publicKey: base64PublicKey,
        credId: base64CredentialID,
        prevCounter: counter,
      });
    }

    db.get('users').find({ username: username }).assign(user).write();

    delete req.session.challenge;

    // Respond with user info
    res.json(user);
  } catch (e) {
    delete req.session.challenge;
    res.status(400).send({ error: e.message });
  }
};

