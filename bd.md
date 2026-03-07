Estrutura Final do Banco (MySQL)
1️⃣ Tabela de Associados
CREATE TABLE associados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(120),
    status ENUM('ativo','inativo') DEFAULT 'ativo',
    data_cadastro DATE
);
2️⃣ Tabela de Categorias

Define se é entrada ou saída.

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    tipo ENUM('entrada','saida')
);

Exemplo de registros:

id	nome	tipo
1	Mensalidade	entrada
2	Multa	entrada
3	Prestação de serviço	entrada
4	Doação	entrada
5	Despesa	saida
6	Pagamento serviço	saida
3️⃣ Tabela de Mensalidades

Cada registro representa uma mensalidade de um associado.

CREATE TABLE mensalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    associado_id INT,
    mes INT,
    ano INT,
    valor DECIMAL(10,2),
    data_pagamento DATE NULL,
    status ENUM('pendente','pago') DEFAULT 'pendente',

    FOREIGN KEY (associado_id) REFERENCES associados(id)
);
4️⃣ Tabela de Fluxo de Caixa

Todas entradas e saídas ficam aqui.

CREATE TABLE caixa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_movimento DATE,
    descricao VARCHAR(255),
    categoria_id INT,
    valor DECIMAL(10,2),
    associado_id INT NULL,

    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (associado_id) REFERENCES associados(id)
);

Exemplos de registros:

data	descrição	categoria	valor
02/01/2025	Mensalidade João	Mensalidade	40
05/01/2025	Multa atraso	Multa	10
10/01/2025	Compra bolas	Despesa	120
15/01/2025	Pagamento arbitragem	Pagamento serviço	200
Consultas Importantes do Sistema
1️⃣ Saldo automático
SELECT 
SUM(
    CASE 
        WHEN c.tipo = 'entrada' THEN caixa.valor
        ELSE -caixa.valor
    END
) AS saldo
FROM caixa
JOIN categorias c ON caixa.categoria_id = c.id;
2️⃣ Relatório Mensal
SELECT 
data_movimento,
descricao,
c.nome categoria,
c.tipo,
valor
FROM caixa
JOIN categorias c ON caixa.categoria_id = c.id
WHERE MONTH(data_movimento) = 3
AND YEAR(data_movimento) = 2025
ORDER BY data_movimento;

Resumo do mês:

SELECT 
c.tipo,
SUM(valor) total
FROM caixa
JOIN categorias c ON caixa.categoria_id = c.id
WHERE MONTH(data_movimento) = 3
AND YEAR(data_movimento) = 2025
GROUP BY c.tipo;
3️⃣ Relatório Anual
SELECT 
MONTH(data_movimento) mes,
c.tipo,
SUM(valor) total
FROM caixa
JOIN categorias c ON caixa.categoria_id = c.id
WHERE YEAR(data_movimento) = 2025
GROUP BY mes, c.tipo
ORDER BY mes;
4️⃣ Lista de Inadimplentes
SELECT 
a.nome,
m.mes,
m.ano,
m.valor
FROM mensalidades m
JOIN associados a ON m.associado_id = a.id
WHERE m.status = 'pendente'
ORDER BY a.nome;
5️⃣ Histórico Financeiro por Associado
SELECT
a.nome,
caixa.data_movimento,
caixa.descricao,
c.nome categoria,
caixa.valor
FROM caixa
JOIN categorias c ON caixa.categoria_id = c.id
JOIN associados a ON caixa.associado_id = a.id
WHERE a.id = 1
ORDER BY caixa.data_movimento;

Tabela usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('admin','operador') NOT NULL
);
Explicação dos campos
Campo	Função
id	Identificador do usuário
login	Nome de login (não pode repetir)
senha	Senha criptografada
nivel	Permissão do usuário

Inserindo um usuário administrador

Exemplo:

INSERT INTO usuarios (login, senha, nivel)
VALUES ('admin', '123456', 'admin');