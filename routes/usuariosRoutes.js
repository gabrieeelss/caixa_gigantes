const express = require('express')
const router = express.Router()
const conexao = require('../db')

const { verificarLogin, permitir } = require('../middlewares/auth')
const bcrypt = require("bcrypt")

router.post("/cad-usuario", permitir('admin'), async function (req, res) {
    try {
        const { login, senha, nivel_acesso } = req.body

        if (!login || !senha) {
            return res.status(400).json({ erro: "Preencha login e senha." })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const sql = `
            INSERT INTO usuarios (login, senha, nivel_acesso)
            VALUES (?, ?, ?)
        `

        conexao.query(sql, [login, senhaHash, nivel_acesso || "operador"], function (erro, resultado) {
            if (erro) {
                console.log("Erro ao cadastrar usuário:", erro)
                return res.status(500).json({ erro: "Erro ao cadastrar usuário." })
            }

            res.json({ mensagem: "Usuário cadastrado com sucesso." })
        })
    } catch (erro) {
        console.log("Erro no cadastro:", erro)
        res.status(500).json({ erro: "Erro interno." })
    }
})

module.exports = router