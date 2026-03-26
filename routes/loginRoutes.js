const express = require('express')
const router = express.Router()
const conexao = require('../db')

router.post("/login", function (req, res) {
    const { login, senha } = req.body;

    conexao.query(
        "SELECT * FROM usuarios WHERE login = ? AND senha = ?",
        [login, senha],
        function (erro, resultado) {
            if (erro) {
                return res.status(500).json({ erro: "Erro no servidor" });
            }

            if (resultado.length === 0) {
                return res.status(401).json({ erro: "Login inválido" });
            }

            req.session.usuario = {
                id: resultado[0].id,
                login: resultado[0].login,
                nivel: resultado[0].nivel
            };

            res.json({
                mensagem: "Login realizado com sucesso",
                usuario: req.session.usuario
            });
        }
    );
});

module.exports = router