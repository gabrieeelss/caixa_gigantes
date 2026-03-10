require('dotenv').config()

const express = require('express')
const app = express()
/* Indica que todas as requisições podem receber Body em JSON. A partir 
disso, o Express aplica um JSON.parse para o conteúdo recebido */
app.use(express.json())
app.get('/', function (req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')
res.send('CaixaGigantes')
})

let mysql = require('mysql')
let conexao = mysql.createConnection({
    host: "SERVIDOR_BD",
    user: "USER_BD",
    password: "SENHA_BD",
    database: "DATABASE"
})

console.log(process.env.PORTA)
app.listen(process.env.PORTA)