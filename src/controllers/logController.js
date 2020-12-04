const connection = require('../database');
var dayjs = require('dayjs')

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

async function postEntry(req, res){
    const entries = req.body;
    const authHeader = req.header('Authorization');
    const token = authHeader.replace('Bearer ', '');
    try{
        const user = await connection.query('SELECT * FROM sessions WHERE token = $1',[token]);
        try{
            const time = dayjs().format('DD/MM/YYYY');
            console.log(time);
            const logs = await connection.query('INSERT INTO logs ("id_user", date, description, value, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',[user.rows[0].userId, time, entries.description, entries.num, "add"]);
            console.log('log',logs.rows);
            res.status(201).send(logs.rows);
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
    getLog,
    postEntry
};
