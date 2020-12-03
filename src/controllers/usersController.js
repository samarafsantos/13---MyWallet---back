const joi = require("joi");
const connection = require('../database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");

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

async function signIn(req, res) {
    const userInfo = req.body;

    try{
        const user = await connection.query('SELECT * FROM users WHERE email = $1', [userInfo.email]);
        if(!user){
            res.sendStatus(404);
        }
        if(user.rows[0].email === userInfo.email){
            if(!bcrypt.compareSync(userInfo.password, user.rows[0].password)){
                res.sendStatus(422);
            }
            else{
                const newSession = {
                    userId: user.rows[0].id,
                    token: uuidv4(),
                };
                  await connection.query('INSERT INTO sessions ("userId", token) VALUES ($1, $2)', [newSession.userId, newSession.token]);
                  res.status(200).send(newSession);
            }
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }

    //RECEBER INFO CHECK
    //TRY VERIFICAR EMAIL NO BD
    //CATCH 500
    //SE EXISTIR, VERIFICAR SE SENHA ENCRIPTADA BATE COM A SALVA
    //SE SIM, GERAR E RETORNAR 200 MAIS TOKEN
    //SE NÃO, RETORNAR ERRO 422
}

// async function signOut(req, res) {

// }

module.exports = {
    signUp,
    signIn,
    // signOut
};
