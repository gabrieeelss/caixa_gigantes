function fnExcluirMovimentacao(id, elemento) {

    if (!confirm("Tem certeza que deseja excluir essa movimentação?")) {
        return;
    }

    fetch('http://127.0.0.1:3000/caixa/' + id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    })
    .then(resposta => resposta.json())
    .then((dados) => {
        elemento.closest("tr").remove()
        alert("Movimentação excluida com sucesso!")
    })
    .catch(erro => console.log(erro.message))
}