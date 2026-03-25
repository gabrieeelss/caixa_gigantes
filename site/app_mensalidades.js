function fnLimparCamposMensalidade() {
    document.getElementById("form-mensalidades").reset()
}

async function fnAdicionarMensalidade() {
    let dadosMensalidade = {
        associado_id: document.getElementById("associado_id_mensalidade").value,
        mes: document.getElementById("mes").value,
        ano: document.getElementById("ano").value,
        valor: document.getElementById("valor_mensalidade").value,
        data_pagamento: document.getElementById("data_pagamento").value
    }
    console.log(dadosMensalidade)

    try {
        const resposta = await fetch("http://127.0.0.1:3000/cad-mensalidade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosMensalidade),
            credentials: "include"
        })
        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao cadastrar mensalidade")
        }
        fnLimparCamposMensalidade()

        if (typeof fnCarregarSaldo === "function") {
            fnCarregarSaldo()
        }

        if (typeof fnCarregarCaixa === "function") {
            fnCarregarCaixa()
        }
        alert(dados.mensagem)

    } catch (erro) {
        console.log(erro)
        alert("Erro: " + erro.message)
    }
}

async function fnCarregarAssociadosMensalidade() {
    try {
        const resposta = await fetch("http://127.0.0.1:3000/exibir-associados", {
            method: 'GET',
            credentials: 'include'
        })
        const dados = await resposta.json()

        let select = document.getElementById("associado_id_mensalidade")
        select.innerHTML = `<option value="">Selecione o associado</option>`

        dados.forEach(a => {
            select.innerHTML += `
                <option value="${a.id}">${a.nome}</option>
            `
        })
    } catch (erro) {
        console.log("Erro ao carregar associados:", erro)
    }
}

document.getElementById("btn-add-mensalidade").addEventListener("click", fnAdicionarMensalidade)

fnCarregarAssociadosMensalidade()