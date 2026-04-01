const express = require('express')
const router = express.Router()
const conexao = require('../db')
const { verificarLogin, permitir } = require('../middlewares/auth')
const bcrypt = require("bcrypt")


// CADASTRAR USUARIO
router.post("/cad-usuario", permitir('admin'), async function (req, res) {
    try {
        const { login, senha, nivel } = req.body

        if (!login || !senha || !nivel) {
            return res.status(400).json({ erro: "Preencha todos os campos." })
        }

        const sqlVerifica = "SELECT id FROM usuarios WHERE login = ? LIMIT 1"

        conexao.query(sqlVerifica, [login], async function (erroVerifica, resultadoVerifica) {
            if (erroVerifica) {
                console.log("Erro ao verificar usuário:", erroVerifica)
                return res.status(500).json({ erro: "Erro ao verificar usuário." })
            }

            if (resultadoVerifica.length > 0) {
                return res.status(400).json({ erro: "Já existe um usuário com esse login." })
            }

            try {
                const senhaHash = await bcrypt.hash(senha, 10)

                const sql = `
                    INSERT INTO usuarios (login, senha, nivel)
                    VALUES (?, ?, ?)
                `

                conexao.query(
                    sql,
                    [login, senhaHash, nivel],
                    function (erro, resultado) {
                        if (erro) {
                            console.log("Erro ao cadastrar usuário:", erro)
                            return res.status(500).json({ erro: "Erro ao cadastrar usuário." })
                        }

                        return res.json({
                            mensagem: "Usuário cadastrado com sucesso.",
                            id_usuario: resultado.insertId
                        })
                    }
                )
            } catch (erroHash) {
                console.log("Erro ao gerar hash:", erroHash)
                return res.status(500).json({ erro: "Erro ao proteger a senha." })
            }
        })

    } catch (erro) {
        console.log("Erro no cadastro:", erro)
        return res.status(500).json({ erro: "Erro interno." })
    }
})

// EXIBIR USUARIOS
router.get("/exibir-usuarios", verificarLogin, function (req, res) {
    conexao.query("SELECT * FROM usuarios", function (erro, dados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar usuarios" })
        }
        res.json(dados)
    })
})
module.exports = router