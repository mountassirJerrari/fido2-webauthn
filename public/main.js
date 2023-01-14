import { _fetch } from '/client.js';
const form = document.querySelector('#registration_form');
form.submit.addEventListener('click', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const cred = {};
    formData.forEach((v, k) => cred[k] = v);
    _fetch(form.action, cred)
        .then(user => {
            console.log(user)
            location.href = '/auth'
        }).catch(e => {
            alert(e);
        });
});