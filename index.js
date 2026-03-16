const cors = require('cors')
const session = require("express-session")
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

app.use(session({
    secret: "caixa_gigantes",
    resave: false,
    saveUninitialized: true
}))

// LOGIN
app.post("/login/", function (req, res) {
    const login = req.body.login
    const senha = req.body.senha

    const sql = "SELECT * FROM usuarios WHERE login = ? AND senha = ?"
    conexao.query(sql,[login,senha], function (erro, resultado) {
        if (erro) {
            res.send(erro)
        } else {
            if (resultado.length > 0) {

                req.session.usuario = {
                    id: resultado[0].id,
                    login: resultado[0].login,
                    nivel: resultado[0].nivel_acesso
                }
                res.sendStatus(200)
            } else {
                res.sendStatus(401)
            }
        }
    })
})

// VERIFICAR LOGIN
function verificarLogin(req,res, next){
    if (req.session.usuario) {
        next()
    } else {
        res.status(401).json({ erro: "Não autorizado"})
    }
}

// PERMISSAO DE ADMIN
function somenteAdmin(req,res,next){
    if(req.session.usuario.nivel === "admin"){
        next()
    }else{
        res.status(403).send("Acesso negado")
    }
}

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

// EXIBIR ASSOCIADOS
app.get("/exibir-associados", function (req, res) {
    conexao.query("SELECT * FROM associados", function (erro, dados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar associados" })
        }
        res.json(dados)
    })
})


console.log(process.env.PORTA)
app.listen(process.env.PORTA)
