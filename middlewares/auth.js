function verificarLogin(req, res, next) {
    if (req.session && req.session.usuario) {
        next()
    } else {
        res.status(401).send('Não autorizado')
    }
}

function permitir(...niveisPermitidos) {
    return function (req, res, next) {
        if (!req.session || !req.session.usuario) {
            return res.status(401).send('Não autorizado')
        }
        const nivelUsuario = req.session.usuario.nivel
        if (niveisPermitidos.includes(nivelUsuario)) {
            next()
        } else {
            res.status(403).send('Acesso negado')
        }
    }
}

module.exports = {
    verificarLogin,
    permitir
}