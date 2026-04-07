# Caixa Gigantes

API de controle do fluxo de caixa da associação, desenvolvida em Node.js com Express e MySQL.

## Descrição

Esta API permite gerenciar associados, movimentações de caixa, mensalidades e usuários de uma associação. Inclui autenticação baseada em sessões e controle de permissões por níveis de usuário.

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **bcrypt** - Hashing de senhas
- **express-session** - Gerenciamento de sessões
- **CORS** - Controle de acesso cross-origin

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/gabrieeelss/caixa_gigantes.git
   cd caixa_gigantes
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados MySQL e crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   PORTA=3000
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=caixa_gigantes
   ```
SERVIDOR_BD=216.172.172.29
PORTA=3000
DATABASE=gigant71_caixa_gigantes
USER_BD=gigant71_gabriel
SENHA_BD=Ssoentrar,0812G


4. Execute o servidor:
   ```bash
   npm start
   ```
   Ou para desenvolvimento com nodemon:
   ```bash
   npm run dev
   ```

## Estrutura do Banco de Dados

O projeto utiliza as seguintes tabelas principais:
- `usuarios` - Usuários do sistema
- `associados` - Membros da associação
- `caixa` - Movimentações financeiras
- `categorias` - Categorias de entrada/saída
- `mensalidades` - Mensalidades dos associados

## Autenticação

A API utiliza sessões para autenticação. Após o login, o usuário recebe uma sessão que é validada em rotas protegidas.

### Níveis de Usuário
- `admin` - Acesso total
- `operador` - Acesso limitado (não pode excluir usuários ou associados)
- `visualizador` - Apenas leitura

## Endpoints da API

### Autenticação

#### POST /login
Realiza login no sistema.

**Corpo da Requisição:**
```json
{
  "login": "usuario",
  "senha": "senha"
}
```

**Resposta de Sucesso:**
```json
{
  "mensagem": "Login realizado com sucesso",
  "usuario": {
    "id": 1,
    "login": "usuario",
    "nivel": "admin"
  }
}
```

#### POST /logout
Realiza logout do sistema.

**Resposta:**
```json
{
  "mensagem": "Logout realizado"
}
```

### Associados

#### GET /exibir-associados
Lista todos os associados. (Requer login)

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "cpf": "12345678900",
    "rg": "1234567",
    "endereco": "Rua A, 123"
  }
]
```

#### POST /cad-associado
Cadastra um novo associado. (Requer permissão admin ou operador)

**Corpo da Requisição:**
```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "rg": "1234567",
  "endereco": "Rua A, 123"
}
```

**Resposta de Sucesso:**
```json
{
  "mensagem": "Associado cadastrado com sucesso!",
  "id": 1
}
```

#### GET /associado/:id
Busca um associado por ID. (Requer login)

#### PUT /associado/:id
Atualiza um associado. (Requer permissão admin ou operador)

#### DELETE /associados/:id
Exclui um associado. (Requer permissão admin)

### Caixa

#### GET /exibir-categorias
Lista todas as categorias. (Requer login)

#### POST /cad-movimentacao
Cadastra uma nova movimentação. (Requer permissão admin ou operador)

**Corpo da Requisição:**
```json
{
  "data_movimento": "2023-01-01",
  "associado_id": 1,
  "categoria_id": 1,
  "descricao": "Pagamento mensalidade",
  "valor": 50.00
}
```

#### GET /saldo
Retorna o saldo atual do caixa. (Requer login)

**Resposta:**
```json
{
  "saldo": 1500.50
}
```

#### GET /caixa
Lista todas as movimentações. (Requer login)

#### GET /caixa/:id
Busca uma movimentação por ID. (Requer login e permissão admin ou operador)

#### PUT /caixa/:id
Atualiza uma movimentação. (Requer login e permissão admin ou operador)

#### DELETE /caixa/:id
Exclui uma movimentação. (Requer permissão admin)

### Mensalidades

#### POST /cad-mensalidade
Cadastra uma mensalidade. (Requer permissão admin ou operador)

**Corpo da Requisição:**
```json
{
  "associado_id": 1,
  "mes": 1,
  "ano": 2023,
  "valor": 50.00,
  "data_pagamento": "2023-01-01",
  "status": "pago"
}
```

### Usuários

#### POST /cad-usuario
Cadastra um novo usuário. (Requer permissão admin)

**Corpo da Requisição:**
```json
{
  "login": "novo_usuario",
  "senha": "senha_segura",
  "nivel": "operador"
}
```

## Tratamento de Erros

A API retorna códigos HTTP apropriados e mensagens de erro em JSON:

- `400` - Dados inválidos
- `401` - Não autorizado
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

**Exemplo de Erro:**
```json
{
  "erro": "Campos obrigatórios: nome, cpf, rg e endereço"
}
```

## Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a ISC License.
