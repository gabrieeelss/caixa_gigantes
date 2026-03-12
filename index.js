const cors = require('cors')
const express = require('express')
const app = express()
/* Indica que todas as requisições podem receber Body em JSON. A partir 
disso, o Express aplica um JSON.parse para o conteúdo recebido */
app.use(express.json())
app.get('/', function (req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')
res.send('CaixaGigantes')
})

app.use(cors({
  origin: 'http://127.0.0.1:5500', // origem do front-end
  credentials: true                // permite cookies/sessão
}))

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

// CADASTRAR ASSOCIADO
app.post("/cad-associado", function (req, res) {
    const data = req.body

    console.log(data)
    conexao.query('INSERT INTO associados set ?', [data],
        function (erro, resultado) {
            if (erro) {
                res.json(erro);
            }
            res.send(resultado.insertId);
        });
})

console.log(process.env.PORTA)
app.listen(process.env.PORTA)
