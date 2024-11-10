## API de gerenciamento de veículo
O projeto é um CRUD de carros, onde podemos cadastrar novos veículos e seus itens; buscar os veículos com base em suas características e seus IDs, como também listá-los todos; podemos atualizar veículos e suas propriedades, bem como deletá-los. A comunicação com o banco é feita pelo knex e o banco configurado para a execução é o MySQL.

## Configurando o ambiente
1. Criar uma database no MySQL, a database deverá se chamar compasscar;
2. Abrir o projeto no terminal de sua preferência e executar o comando *npm install*. Com isso, teremos a instalação da pasta node_modules e seus arquivos.
3. Criar um arquivo .env na raiz do projeto, nele deverá conter a seguinte estrutura e informações:
- PORT=*Porta em que o server rodará. EX: 3000*
- SQL_HOST=*Host da conexão do MySQL*
- SQL_USER=*Nome de usuário da conexão do MySQL*
- SQL_PASS=*Senha do MySQL*
- SQL_DATABASE=*Nome da database que criamos no primeiro passo. No caso: compasscar*
- SQL_PORT=*Porta da conexão do MySQL*
4. No terminal com o projeto aberto, execute o comando *npx knex migrate:latest*. Com esse comando estamos criando as nossas duas tabelas ('cars' e 'cars_items') no banco de dados.
5. *Passo Opcional* - Na raiz do projeto, temos uma pasta chamada 'seeds', nela temos 50 dados (carros) para a tabela 'cars', também temos 65 dados (itens) para a tabela 'cars_items', esses itens são para 30 carros aleatórios da tabela 'cars'. Se quiser preencher as tabelas com esses dados, no terminal, deverá executar o comando *npx knex seed:run*. Com isso, teremos dados nas tabelas para executarmos consultas.
6. *Passo Opcional Facilitador* - Podemos agora instalar uma ferramenta de desenvolvimento de API, assim podemos testar/executar nosso projeto de uma forma facilitada. Recomendo o Postman, mas existem inúmeras ferramentas que te darão o mesmo resultado, a preferência é sua.

## Rodando a API
1. *Explicação para o seguimento do passo a passo* - Toda vez que for citada uma rota, tenha em mente que acompanhando ela precisará estar o host e a porta. Ex: http://localhost:3000*rota*. O projeto tem uma rota raiz */api/v1/cars*, para simplificar no passo a passo, será referenciado as rotas já contando também a rota raiz. Ex: http://localhost:3000/api/v1/cars/*restante da rota*.
1. No terminal de sua preferência, execute o comando *npm run dev*. Agora temos nossa API rodando.
2. Adicionar veículo: Utilizando o método *POST* na rota raiz, adicionaremos um veículo. Para adicionar, os dados do veículo devem ser enviados no corpo da requisição (body) no formato JSON, contendo as informações essenciais, como brand, model, year, e plate. Em caso de sucesso da requisição, retornará uma resposta com o status '201 Created' e os detalhes do veículo adicionado, incluindo o id e o momento da criação. No caso da requisição ser infrutífera, retornará uma resposta com a informação do que falhou.
3. Consultar veículos: Utilizando o método *GET* na rota raiz, consultaremos os veículos. Temos a possibilidade de filtrarmos a nossa pesquisa, os métodos de filtro são:
- *year* (Seleciona os veículos com base no ano informado. A requisição trará veículos que correspondem igualmente ou superior ao ano informado.);
- *final_plate* (Seleciona os veículos com base no último caractere da placa. A requisição trará os veículos que tenham em sua placa, no último caractere, o parâmetro informado.);
- *brand* (Seleciona os veículos com base no modelo informado. A requisição trará apenas os veículos que possuam o modelo informado.);
- *page* (Seleciona a página desejada da consulta. Por padrão, se nenhum parâmetro for informado, a requisição trará a primeira página.);
- *limit* (No limit, podemos passar a quantidade de dados por página que a requisição poderá trazer. Por padrão, se nenhum parâmetro for informado, a requisição trará cinco dados por página.).
Exemplo de requisição: Rota raiz*?year=2020&final_plate=9&brand=Mercedes&page=1&limit=3*. Não precisamos passar todos os dados, eles são opcionais, podemos tanto fazer uma requisição com os 5 filtros, com 3 filtros ou até mesmo com nenhum filtro, fica a critério do usuário.
4. Consultar veículo: Utilizando o método *GET* na rota: 'Rota raiz/*id do veículo*', consultaremos um veículo em específico, através de seu ID. Em caso de sucesso da requisição, retornará uma resposta com o status '200 Ok' e os detalhes do referido veículo.
- Exemplo de rota: *http://localhost:3000/api/v1/cars/1*
5. Adicionar itens: Utilizando o método *PUT* na rota: 'Rota raiz/*id do veículo*/items', adicionaremos itens a um veículo em específico. Para adicionarmos os itens de um veículo, devemos enviar os dados no corpo da requisição (body) no formato JSON, vale ressaltar que não podemos passar mais de cinco itens por veículo. Em caso de sucesso da requisição, retornará uma resposta com o status '204 No Content'.
- Exemplo de rota: *http://localhost:3000/api/v1/cars/50/items*
6. Modificar veículo: Utilizando o método *PATCH* na rota: 'Rota raiz/*id do veículo*', conseguiremos modificar propriedades do veículo desejado. As propriedades disponíveis para modificação são: brand, model, year, plate. Não é necessário passar parâmetros para todos, apenas para os quais quer realizar alterações, vale ressaltar que se for realizar a alteração de brand, também será necessário passar o parâmetro model. Em caso de sucesso da requisição, retornará uma resposta com o status '204 No Content'. No caso da requisição ser infrutífera, retornará uma resposta com a informação do que falhou.
- Exemplo de rota: *http://localhost:3000/api/v1/cars/2*
7. Deletar veículo: Utilizando o método *DELETE* na rota: 'Rota raiz/*id do veículo*, deletaremos o veículo desejado. Em caso de sucesso da requisição, retornará uma resposta com o status '204 No Content'.
- Exemplo de rota: *http://localhost:3000/api/v1/cars/3*
8. Exemplos de body:
    - **POST**:
      ```json
      {
        "brand": "hyundai",
        "model": "veloster",
        "year": "2015",
        "plate": "RLC-7900"
      }
      ```
    - **PUT**:
      ```json
      {
        "items": [
          "airbag",
          "GPS",
          "ABS",
          "radio",
          "bluetooth"
        ]
      }
      ```
    - **PATCH**:
      ```json
      {
        "brand": "Ford",
        "model": "Ká",
        "plate": "BBC-7911"
      }
      ```
