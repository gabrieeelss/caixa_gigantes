const bcrypt = require("bcrypt")

async function gerarHash() {
    const senha = "Ssoentrar,0812G"
    const hash = await bcrypt.hash(senha, 10)
    console.log(hash)
}

gerarHash()