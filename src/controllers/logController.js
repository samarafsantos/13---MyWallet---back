const joi = require("joi");
const connection = require('../database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");

async function getLog(req, res) {
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    const token = authHeader.replace('Bearer ', '');

    try{
        const user = await connection.query('SELECT * FROM sessions WHERE token = $1',[token]);
        console.log('user',user);
        try{
            const logs = await connection.query('SELECT * FROM logs WHERE id_user = $1',[user.rows[0].userId]);
            console.log('log',logs.rows);
            res.status(200).send(logs.rows);
        }catch(e){
            console.log(e);
            res.sendStatus(500);
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
}

module.exports = {
    getLog
};
