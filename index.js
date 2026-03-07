require('dotenv').config()

const express = require('express')
const app = express()
/* Indica que todas as requisições podem receber Body em JSON. A partir 
disso, o Express aplica um JSON.parse para o conteúdo recebido */
app.use(express.json())
app.get('/', function (req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')
res.send('CaixaGigantes')
})

async function adicionarMovimento(){

let dados = {

data_movimento: document.getElementById("data").value,
categoria_id: document.getElementById("categoria").value,
descricao: document.getElementById("descricao").value,
valor: document.getElementById("valor").value,
associado_id: document.getElementById("associado").value,
nome_manual: document.getElementById("nome_manual").value

}

await fetch("http://localhost:3000/caixa",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(dados)

})

carregarCaixa()

}

console.log(process.env.PORTA)
app.listen(process.env.PORTA)