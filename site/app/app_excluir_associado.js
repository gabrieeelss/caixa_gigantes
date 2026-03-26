function fnExcluirAssociado(id, elemento) {

    if (!confirm("Tem certeza que deseja excluir este associado?")) {
        return;
    }

    fetch('http://127.0.0.1:3000/associados/' + id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    })
    .then(resposta => resposta.json())
    .then((dados) => {
        elemento.closest("tr").remove()
        alert("Associado excluido com sucesso!")
    })
    .catch(erro => console.log(erro.message))
}