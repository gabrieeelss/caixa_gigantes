function fnLimparCampos() {
    document.getElementById("form-cad-associado").reset()
}

function fnCadastrarAssociado(){
    let dadosAssociado = {
        data: document.getElementById("data_cadastro").value,
        nome: document.getElementById("nome_associado").value,
        email: document.getElementById("email_associado").value,
        telefone: document.getElementById("telefone_associado").value

    }

    fetch('http://localhost:3000/cad-associado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAssociado),
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
        alert("Associado Cadastrado com sucesso! ID: " + dados)
    })
    .catch(erro => alert("Falha ao cadastrar o associado: " + erro.message))
}

let btn_salvar = document.getElementById("btn-cad-associado")
btn_salvar.addEventListener("click", fnCadastrarAssociado)