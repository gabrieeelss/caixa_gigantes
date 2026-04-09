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

const associadosRoutes = require('./routes/associadoRoutes')
app.use(associadosRoutes)

const caixaRoutes = require('./routes/caixaRoutes')
app.use(caixaRoutes)

const mensalidadeRoutes = require('./routes/mensalidadeRoutes')
app.use(mensalidadeRoutes)

const usuariosRoutes = require('./routes/usuariosRoutes')
app.use(usuariosRoutes)

app.listen(process.env.PORTA, () => {
  console.log(`✅ API rodando na porta ${process.env.PORTA}`)
})