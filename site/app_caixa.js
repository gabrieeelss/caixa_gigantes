async function carregarCaixa(){

    const resposta = await fetch("http://localhost:3000/caixa")
    const dados = await resposta.json()

    let tabela = document.getElementById("tabelaCaixa")
    tabela.innerHTML = ""

    let saldo = 0

    dados.forEach(item => {

        let classe = item.tipo === "entrada" ? "text-success" : "text-danger"

        if(item.tipo === "entrada"){
            saldo += parseFloat(item.valor)
        }else{
            saldo -= parseFloat(item.valor)
        }

        tabela.innerHTML += `
        <tr>

        <td>${item.data_movimento}</td>

        <td>${item.descricao}</td>

        <td>${item.categoria}</td>

        <td>${item.tipo}</td>

        <td class="${classe}">
        R$ ${item.valor}
        </td>

        </tr>
        `

    })

    document.getElementById("saldo").innerText = saldo.toFixed(2)

}



async function adicionarMovimento(){

    let dados = {

        data_movimento: document.getElementById("data").value,
        categoria_id: document.getElementById("categoria").value,
        descricao: document.getElementById("descricao").value,
        valor: document.getElementById("valor").value

    }

    await fetch("http://localhost:3000/caixa",{

        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(dados)

    })

    limparCampos()

    carregarCaixa()

}



function limparCampos(){

    document.getElementById("descricao").value = ""
    document.getElementById("valor").value = ""

}



document
.getElementById("btnAdicionar")
.addEventListener("click", adicionarMovimento)


async function carregarAssociados(){

const resposta = await fetch("http://localhost:3000/associados")
const dados = await resposta.json()

let select = document.getElementById("associado")

dados.forEach(a => {

select.innerHTML += `
<option value="${a.id}">
${a.nome}
</option>
`

})

}
carregarCaixa()