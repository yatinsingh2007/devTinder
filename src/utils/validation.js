const validator = require('validator');
const validateSignUpdata = (req) => {
    const { firstName, emailId, password } = req.body;

    if (!firstName ||  !emailId || !password) {
        throw new Error('All fields are required');
    }
    if (!validator.isEmail(emailId)){
        throw new Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }
    if (!validator.isAlpha(firstName)) {
        throw new Error('First name should contain only letters');
    }
}

const validateProfileEditData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'password' , 'age', 'photoUrl', 'gender' , 'about' , 'skills']
    for (let key in req.body){
        if (req.body.hasOwnProperty(key) && !allowedFields.includes(key)) {
            throw new Error(`Invalid field: ${key}`);
        }
    }
}

module.exports = {
    validateSignUpdata,
    validateProfileEditData
};