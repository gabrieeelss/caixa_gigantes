function fnCarregarAssociados(associado) {
    let data_nascimento = new Date(associado.data_nascimento)
    let data_associacao = new Date(associado.data_associacao)
    let linha = `
                            <tr>
                                <td>${associado.id}</td>
                                <td>${data_associacao.toLocaleDateString('pt-BR')}</td>
                                <td>${associado.nome}</td>
                                <td>${associado.email}</td>
                                <td>${associado.telefone}</td>
                                <td>${associado.rg}</td>
                                <td>${associado.cpf}</td>
                                <td>${data_nascimento.toLocaleDateString('pt-BR')}</td>
                                <td>${associado.status}</td>
                                <td>
                            </tr>
    `

    document.querySelector("#tabela_associados").innerHTML += linha
}

function fnCarregarDados() {
    fetch('http://127.0.0.1:3000/exibir-associados', { method: 'GET', credentials: 'include' })

        .then(resposta => {
            if (!resposta.ok) {
                return resposta.json().then(err => {
                throw new Error(err.erro || "Erro " + resposta.status)
                })
            }
            return resposta.json()
        })
        .then(associados => {
            if (Array.isArray(associados)) {
            associados.forEach(fnCarregarAssociados)
            }else{
                console.log("Falha ao carregar associados:", associados)
            }
        })
        .catch(erro => console.log(erro.message))

}

fnCarregarDados()