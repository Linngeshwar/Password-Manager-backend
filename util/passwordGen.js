const crypto = require('crypto');

function passwordGen(length = 15) {
    length = Math.max(length, 15);

    const dataset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const buffer = crypto.randomBytes(length); 
    let password = "";

    for (let i = 0; i < length; i++) {
        password += dataset[buffer[i] % dataset.length]; 
    }

    return password;
}

module.exports = passwordGen;
