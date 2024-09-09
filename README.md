## Comando de execução do projeto
- Na pasta back, escrever o comando `node index.js`
- Na pasta crud-apice, escrever o comando `npm start`

# Situação Atual do Projeto

## Visão Geral

Atualmente, estou desenvolvendo uma aplicação de gerenciamento de pessoas e vendas utilizando as seguintes tecnologias:

- **Front-end:** React com a biblioteca PrimeReact para componentes de UI.
- **Back-end:** Node.js.
- **Banco de Dados:** MySQL.

## Funcionalidades Implementadas

1. **Tela de Venda:**
   - Permite a escolha de uma pessoa e um produto.
   - Calcula o total do valor do item (`vr_item`) no rodapé, com base na quantidade (`qtde`) e no valor de venda (`vr_venda`).
   - Permite incluir vários produtos em uma venda.
   - O usuário pode alterar o valor de venda de cada item.

2. **Tabelas do Banco de Dados:**
   - **Venda:** `id`, `dt_venda`, `pessoa`.
   - **Venda Itens:** `id_venda`, `id_produto`, `qtde`, `vr_venda`.
   - Decidi manter o campo `id` na tabela `venda_itens` igual ao campo `id` da tabela `venda` em vez de usar auto-incremento.

3. **Tela de Relatório de Pessoas:**
   - Em desenvolvimento para listar pessoas e aplicar filtros por parte do nome da pessoa, cidade e bairro.
   - Os dados solicitados estão sendo puxados perfeitamente, contudo o filtro não está funcionando como deveria, estarei trabalhando em uma correção.

4. **Tela de Relatório de Vendas:**
   - Em desenvolvimento para listar vendas com filtros por data inicial e final, pessoa e produto.
   - A tela está desenvolvida, mas tem que fazer os ajustes necessários para puxar os dados corretamente.

   **Tela de Cadastro de Cidades:**
   - Essa tela está funcionando perfeitamente bem, com todas as funcionalidades CRUD implementadas.
   
   **Tela de Cadastro de Bairros:**
   - Assim como a tela de cidade, está com todas as funcionalidades CRUD implementadas.

   **Tela de Cadastro de Pessoas:**
   - As funcionalidades CRUD estão implementadas, conduto alguns ajustes são necessários:
   - Ao selecionar a opção de editar, todos os dados são puxados para edição, menos a de `CEP`, o que o obriga a reescreve-lo caso não haja interesse em editá-lo, 
   até o momento a causa desse problema não foi identificada.
   - No card das pessoas cadastradas, a aba de cidade apenas mostra o `ID`, deve ajustar para pegar o `nome da cidade`.

   **Tela de Cadastro de Produtos:**
   - Funcionando de forma esperada assim como as telas de Cadastro de Cidade e Bairro.

   **Tela de Cadastro de Vendas:**
   - Funções CRUD implementadas, contudo, há ajustes a fazer referente à edição, visto que os dados de venda_itens não são puxados para a edição.

   **OBS:**
   - Todas as telas precisam receber um polimento visual.

## Próximos Passos

1. Corrigir os problemas presentes nas tela de Cadastro de Pessoa.
2. Corrigir os problemas presentes nas tela de Cadastro de Venda.
3. Finalizar a implementação da tela de relatório de pessoas.
4. Finalizar a implementação da tela de relatório de vendas.
5. Testar e validar todas as funcionalidades desenvolvidas.
6. Aplicar um css global em todas as telas


**By netorapg**
