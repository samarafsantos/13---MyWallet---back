const joi = require("joi");
const connection = require('../database');
const bcrypt = require('bcrypt');

async function signUp(req, res) {
    const userInfo = req.body;

    const signUpSchema = joi.object({
        name: joi.string().pattern(/[a-zA-z]/).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(10).required(),
        passwordConfirmation: joi.ref('password')
    })

    const validation = signUpSchema.validate(userInfo);

    if(validation.error){
        console.log(validation.error);
        res.sendStatus(422);
    }

    const cryptPass = bcrypt.hashSync(userInfo.password, 10);
    
    try{
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [userInfo.name, userInfo.email, cryptPass]);
        res.sendStatus(201);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
}

// async function signIn(req, res) {
  
// }

// async function signOut(req, res) {

// }

module.exports = {
    signUp,
    // signIn,
    // signOut
};
