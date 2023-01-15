

 
export const _fetch = async (path, payload = '') => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (payload && !(payload instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(payload);
  }
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: payload,
  });
  if (res.status === 200) {
    // Server authentication succeeded
    return res.json();
  } else {
    // Server authentication failed
    const result = await res.json();
    throw result.error;
  }
};




// register credential
export const registerCredential = async () => {
  const opts = {
    attestation: "none",
    authenticatorSelection: {
      
      userVerification: "preferred",
      requireResidentKey: false
    }
  };

  const options = await _fetch('/auth/registerRequest', opts);
  
  options.user.id =base64url.decode(options.user.id);
  
  options.challenge = base64url.decode(options.challenge);

  if (options.excludeCredentials) {
    for (let cred of options.excludeCredentials) {
      cred.id = base64url.decode(cred.id);
    }
  }
  
  const cred = '' ; 
try {
   cred = await navigator.credentials.create({
    publicKey: options
  });
} catch (error) {
  console.log(error);
}
  
  
   

  const credential = {};
  credential.id = cred.id;
  credential.rawId = base64url.encode(cred.rawId);
  credential.type = cred.type;

  if (cred.response) {
    const clientDataJSON =
      base64url.encode(cred.response.clientDataJSON);
    const attestationObject =
      base64url.encode(cred.response.attestationObject);
    credential.response = {
      clientDataJSON,
      attestationObject
    };
  }
  console.log(cred);
  //localStorage.setItem(`credId`, credential.id);
  
  //return await _fetch('/auth/registerResponse', credential);
};