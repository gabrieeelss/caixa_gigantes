window.fnCarregarSaldo = async function () {
    try {
        const resposta = await fetch("http://127.0.0.1:3000/saldo")
        const dados = await resposta.json()

        const saldo = parseFloat(dados.saldo || 0)
        const saldoEl = document.getElementById("saldo")

        saldoEl.innerText = saldo.toFixed(2).replace(".", ",")

        saldoEl.classList.remove("text-success", "text-danger")

        if (saldo >= 0) {
            saldoEl.classList.add("text-success")
        } else {
            saldoEl.classList.add("text-danger")
        }

    } catch (erro) {
        console.log("Erro ao carregar saldo:", erro)
    }
}

fnCarregarSaldo()