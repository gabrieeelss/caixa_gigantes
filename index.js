require('dotenv').config()
const cors = require('cors')
const session = require("express-session")
const express = require('express')
const app = express()

const conexao = require('./db')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: 'http://127.0.0.1:5500', // origem do front-end
  credentials: true                // permite cookies/sessão
}))

app.use(session({
    secret: "caixa_gigantes",
    resave: false,
    saveUninitialized: false
}))

app.get('/', function (req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')
res.send('CaixaGigantes')
})

const loginRoutes = require('./routes/loginRoutes')
app.use(loginRoutes)

const cadAssociadosRoutes = require('./routes/cadAssociadoRoutes')
app.use(cadAssociadosRoutes)

const caixaRoutes = require('./routes/caixaRoutes')
app.use(caixaRoutes)

// CADASTRAR MENSALIDADE
// app.post("/cad-mensalidade", function (req, res) {
//     const data = req.body

//     console.log(data)

//     conexao.query('INSERT INTO mensalidades SET ?', data, function (erro, resultado) {
//         if (erro) {
//             console.log("Erro ao inserir:", erro)
//             return res.status(500).json({
//                 erro: "Erro ao cadastrar mensalidade",
//                 detalhes: erro.sqlMessage
//             })
//         }

//         return res.json(resultado.insertId)
//     })
// })

app.listen(process.env.PORTA, () => {
  console.log(`Servidor rodando na porta ${process.env.PORTA}`)
})