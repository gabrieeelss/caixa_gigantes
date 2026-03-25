const mysql = require('mysql')
require('dotenv').config()

const conexao = mysql.createPool({
    host: process.env.SERVIDOR_BD,
    user: process.env.USER_BD,
    password: process.env.SENHA_BD,
    database: process.env.DATABASE,
    connectionLimit: 10
})

module.exports = conexao
