function fnLimparCampos() {
    document.getElementById("form-mensalidades").reset()
}

async function fnAdicionarMensalidade() {

let dadosMensalidade = {
    associado_id: document.getElementById("associado_id_mensalidade").value,
    mes: document.getElementById("mes").value,
    ano: document.getElementById("ano").value,
    valor: document.getElementById("valor").value,
    data_pagamento: document.getElementById("data_pagamento").value,
    status: "pago"
}
console.log(dadosMensalidade);

    await fetch("http://127.0.0.1:3000/cad-mensalidade", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosMensalidade),
        credentials: 'include'
    })
    .then(resposta => {
        if (!resposta.ok) {
            return resposta.json().then(err => {
                throw new Error(err.erro || "Erro " + resposta.status)
            })
        }
        return resposta.json()
    })
    .then(dados => {
        fnLimparCampos()
        console.log(dados)
        alert("Mensalidade Cadastrada Com Sucesso! ID: " + dados)
    })
    .catch(erro => console.log(erro))
}

async function fnCarregarAssociados() {
    const resposta = await fetch("http://127.0.0.1:3000/exibir-associados")
    const dados = await resposta.json()
    let select = document.getElementById("associado_id_mensalidade")
    dados.forEach(a => {
        select.innerHTML += `
<option value="${a.id}">
${a.nome}
</option>
`
    })
}

const btn_salvar_mensalidade = document.getElementById("btn-add-mensalidade")
btn_salvar_mensalidade.addEventListener("click", fnAdicionarMensalidade)
fnCarregarAssociados()