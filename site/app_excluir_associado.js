function fnExcluirAssociado(id, elemento) {

    if (!confirm("Tem certeza que deseja excluir este associado?")) {
        return;
    }

    fetch('http://localhost:3000/associados/' + id, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(resposta => resposta.json())
    .then((dados) => {
        elemento.closest("tr").remove()
        alert("Associado excluido com sucesso!")
    })
    .catch(erro => console.log(erro.message))
}