const connection = require('../database');
var dayjs = require('dayjs')

async function getLog(req, res) {
    const authHeader = req.header('Authorization');
    const token = authHeader.replace('Bearer ', '');

    try{
        const user = await connection.query('SELECT * FROM sessions WHERE token = $1',[token]);
        try{
            const logs = await connection.query('SELECT * FROM logs WHERE id_user = $1',[user.rows[0].userId]);
            res.status(200).send(logs.rows);
        }catch(e){
            res.sendStatus(500);
        }
    }catch(e){
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
            const logs = await connection.query('INSERT INTO logs ("id_user", date, description, value, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',[user.rows[0].userId, time, entries.description, entries.num, "add"]);
            res.status(201).send(logs.rows);
        }catch(e){
            res.sendStatus(500);
        }
    }catch(e){
        res.sendStatus(500);
    }

}

async function postPullOut(req, res){
    const entries = req.body;
    const authHeader = req.header('Authorization');
    const token = authHeader.replace('Bearer ', '');
    try{
        const user = await connection.query('SELECT * FROM sessions WHERE token = $1',[token]);
        try{
            const time = dayjs().format('DD/MM/YYYY');
            const logs = await connection.query('INSERT INTO logs ("id_user", date, description, value, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',[user.rows[0].userId, time, entries.description, entries.num, "sub"]);
            res.status(201).send(logs.rows);
        }catch(e){
            res.sendStatus(500);
        }
    }catch(e){
        res.sendStatus(500);
    }
}

module.exports = {
    getLog,
    postEntry,
    postPullOut
};
