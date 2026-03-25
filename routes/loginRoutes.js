const express = require('express')
const router = express.Router()
const conexao = require('../db')

router.post('/login', function (req, res) {
    const login = req.body.login
    const senha = req.body.senha

    const sql = "SELECT * FROM usuarios WHERE login = ? AND senha = ?"
    conexao.query(sql,[login,senha], function (erro, resultado) {
        if (erro) {
            return res.status(500).json(erro)
        }
            if (resultado.length > 0) {
                req.session.usuario = {
                    id: resultado[0].id,
                    login: resultado[0].login,
                    nivel: resultado[0].nivel_acesso
                }
               return res.sendStatus(200)
            } else {
               return res.sendStatus(401)
        }
    })
})
module.exports = router