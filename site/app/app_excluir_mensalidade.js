function fnExcluirMensalidade(id, elemento) {

    if (!confirm("Tem certeza que deseja excluir esta mensalidade?")) {
        return;
    }

    fetch('http://127.0.0.1:3000/mensalidades/' + id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    })
    .then(resposta => resposta.json())
    .then((dados) => {
        elemento.closest("tr").remove()
        alert("Mensalidade excluída com sucesso!")
    })
    .catch(erro => console.log(erro.message))
}