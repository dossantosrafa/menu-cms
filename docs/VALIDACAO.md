# Validação executada

Data: 21/11/2026. Referências analisadas: `menu-backend` no commit `8a743abc9c03bb6206ea4b48c47e928c3bea8192` e `menu-frontend` no commit `981ce46e82f0c599e1f9fd8bab3a598fba703eb5`.

## Compilação e testes

| Verificação | Resultado |
| --- | --- |
| CMS: `npm run build` | Aprovado: TypeScript e build Vite |
| CMS: `npm test` | 4 testes aprovados: preços, URLs, totais em centavos e valores do enum |
| Backend: `npm run test:cms` | 10 grupos de integração aprovados com servidor NestJS real e PostgreSQL WASM isolado |

### Integração HTTP no backend

1. Categorias: criar, listar em ordem, editar nome, ordem, ícone e situação; remover ícone com `null`.
2. Produtos: criar inativo com indicadores, incluir inativos na administração, manter somente ativos na consulta padrão, editar preço, indicadores e imagem, remover imagem e filtrar por categoria.
3. Mesas: criar, alterar nome/situação e listar.
4. Pedidos: primeiro pedido abre comanda; segundo pedido da mesma mesa reutiliza a comanda; consulta contém mesa, itens e produto; preços e total acumulado conferidos.
5. Status: as **16 combinações** entre os quatro estados foram gravadas e confirmadas em nova consulta, inclusive retornos a estados anteriores.
6. Validação: nome vazio, preço zero, pedido sem itens, UUID inválido e o nome legado de status foram rejeitados.
7. Integridade: exclusão de categoria, produto ou mesa com vínculos devolve HTTP 409.
8. Exclusão de registros sem vínculos: categorias, produtos e mesas retornam 204; consulta posterior de produto excluído retorna 404.
9. Filtro de comandas: após fechar uma comanda, a consulta `status=OPENED` deixa de retorná-la.
10. Migração: um enum convertido de volta para `DELIVERY` em banco isolado foi migrado para `DELIVERED`, preservando os pedidos.

O teste reproduzível está no backend em `test/cms.integration.mjs` e usa banco temporário. Não depende de credenciais reais do restaurante.

## Verificação no navegador

Foi utilizado o CMS com a API NestJS e banco isolado. Os dados de teste foram inseridos pela API e não integram o código da aplicação entregue.

- Navegação por categorias, produtos, mesas, comandas e pedidos.
- Cadastro de categoria, edição de nome e situação e atualização automática da lista.
- Abertura do diálogo de exclusão e cancelamento sem remover o registro.
- Filtro de produtos por categoria, cadastro com preço em reais, indicadores e impedimento de preço zero antes de enviar.
- Cadastro de mesa e feedback de sucesso.
- Listagem de comandas com mesa, data e total; detalhe com quantidade, preço unitário, subtotal e total do pedido.
- Kanban com quatro colunas e cartões contendo mesa, itens e horário.
- Arrastar um pedido de `NEW` para `PREPARING`, confirmar sucesso, recarregar a página e observar o mesmo pedido em `PREPARING`.
- Alterar status também pelo select do detalhe do pedido.
- Lista vazia após busca sem correspondência e resposta de erro para comanda inexistente, com botão de nova tentativa.

## Limites

- Não foram usados o banco nem as credenciais particulares do aluno. A conexão com o PostgreSQL/Supabase no computador dele precisa ser conferida ao executar.
- A coleção Insomnia foi preparada para importação; a execução automatizada das rotas foi feita por HTTP no teste de integração, e não pela interface do Insomnia.
- O CMS depende da versão do backend ajustada para os campos, relações e rotas da atividade.
- O layout usa regras responsivas; a validação visual principal foi realizada em navegador desktop.
- A compilação do CMS pode emitir um aviso de tamanho de bundle. Isso é um aviso de otimização, não erro de compilação.
- O vídeo não foi gravado: a atividade exige a voz do próprio aluno. O roteiro está preparado.
- Commits usam datas reais. O projeto não fabrica um histórico de desenvolvimento ao longo do bimestre.
