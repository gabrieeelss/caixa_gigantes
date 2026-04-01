const express = require('express')
const router = express.Router()
const conexao = require('../db')
const bcrypt = require("bcrypt")

router.post("/login", function (req, res) {
    const { login, senha } = req.body

    if (!login || !senha) {
        return res.status(400).json({ erro: "Preencha login e senha." })
    }

    const sql = "SELECT * FROM usuarios WHERE login = ? LIMIT 1"

    conexao.query(sql, [login, senha], async function (erro, resultado) {
        if (erro) {
            console.log("Erro no login", erro)
            return res.status(500).json({ erro: "Erro no servidor" });
        }

        if (resultado.length === 0) {
            return res.status(401).json({ erro: "Login inválido" });
        }
        const usuario = resultado[0]

        try {
            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if (!senhaValida) {
                return res.status(401).json({ erro: "Login inválido" })
            }

            req.session.usuario = {
                id: usuario.id,
                login: usuario.login,
                nivel: usuario.nivel
            }

            res.json({
                mensagem: "Login realizado com sucesso",
                usuario: req.session.usuario
            })
        } catch (erro) {
            console.log("Erro ao comparar senha:", erro)
            return res.status(500).json({ erro: "Erro ao validar senha" })
        }
    })
})

router.post("/logout", function (req, res) {
    req.session.destroy();
    res.json({ mensagem: "Logout realizado" });
});

module.exports = router