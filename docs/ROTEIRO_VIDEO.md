# Roteiro do vídeo — cerca de 7 minutos

Grave a tela com a sua própria voz. Câmera é opcional. Deixe o backend e o CMS funcionando, o VS Code aberto e o Insomnia preparado com um pedido real já cadastrado. Ensaie a sequência para ficar entre 5 e 8 minutos.

## 0:00–0:25 — Apresentar o projeto

**Na tela:** CMS e menu lateral.

**Explique com suas palavras:**

“Este é o Menu CMS, o painel administrativo do cardápio digital. Ele usa React com Vite, Tailwind, shadcn/ui, Axios e TanStack Query e consome a API NestJS do primeiro bimestre. Os cadastros e os pedidos vêm da API.”

## 0:25–1:15 — Categorias

**Demonstre:** listar, criar, editar e excluir uma categoria que não tenha produtos. Mostre o diálogo antes de confirmar a exclusão.

**Explique:** nome, ícone como URL, ordem de exibição e situação ativa/inativa. Ao salvar, a lista se atualiza após a API confirmar a gravação.

## 1:15–2:20 — Produtos

**Demonstre:** listar imagens, nomes, categorias, preços e indicadores; filtrar por categoria; cadastrar produto; editar preço e indicadores; excluir um produto criado apenas para a demonstração.

**Explique:** o select de categorias é alimentado pela API. Mostre rapidamente que o preço zero é rejeitado antes do envio, corrija o preço e salve. Mostre as opções de vegetariano, novidade e situação.

## 2:20–3:00 — Mesas

**Demonstre:** cadastrar, editar e excluir uma mesa sem vínculos. Cancele uma exclusão para mostrar a confirmação, depois confirme a exclusão do registro de teste.

**Explique:** as mesas usam a entidade `Spot` do backend, com nome e situação.

## 3:00–4:00 — Comandas e pedidos

**Demonstre:** lista de comandas abertas, mesa, abertura e total acumulado. Entre no detalhe e mostre produto, quantidade, preço unitário, subtotal e total.

**Explique:**

“O CMS apenas consulta as comandas. Elas são abertas automaticamente pelo backend no primeiro pedido da mesa. No detalhe consigo acompanhar os pedidos e alterar seu status livremente entre Novo, Em preparo, Pronto e Entregue.”

**Faça:** altere um status pelo select e mostre o badge atualizado. Se quiser, mostre no Insomnia a criação de outro pedido para a mesma mesa e a atualização do total.

## 4:00–4:50 — Kanban, incluindo a prova de persistência

**Demonstre:** as quatro colunas, mesa, itens e horário de cada cartão.

1. Arraste um cartão pela alça até outra coluna.
2. Aguarde a mensagem de sucesso e o cartão na nova coluna.
3. **Pressione F5.**
4. Mostre o cartão permanecendo na coluna correta.

**Explique:**

“Arrastar executa a mesma mutation usada no detalhe do pedido. O status é gravado com PATCH na API. Ao recarregar, o CMS consulta o banco novamente, por isso o cartão mantém sua coluna. Também deixei o select Mover para como alternativa ao arrastar.”

## 4:50–6:25 — Organização e integração no código

**Na tela:** VS Code, árvore de `src`, depois os arquivos abaixo.

| Arquivo | O que mostrar e explicar |
| --- | --- |
| `src/pages/products-page.tsx` | A página compõe listagem, formulário e ações, usando hooks |
| `src/services/product.service.ts` | Os endpoints ficam em serviços, separados da interface |
| `src/lib/axios.ts` | Uma única instância; `baseURL` vem de `import.meta.env.VITE_API_URL` |
| `src/main.tsx` | `QueryClientProvider` disponibiliza o cache para a aplicação |
| `src/hooks/use-menu.ts` | `useProducts` usa `useQuery`; `useCrudMutations` e `useOrderStatus` usam `useMutation`; no sucesso, `invalidateQueries` atualiza as consultas afetadas |
| `src/components/shared/query-state.tsx` | Estados de carregamento, erro com nova tentativa e lista vazia |

Não mostre credenciais do banco na gravação. Para falar das variáveis, mostre `.env.example`.

**Decisão técnica para justificar:**

“Usei o TanStack Query como estado dos dados do servidor, então não preciso manter cópias das listas manualmente. Depois de gravar, invalido as consultas afetadas. Também optei por mostrar no Kanban o estado confirmado pelo servidor: se a API falhar, o cartão não fica numa coluna que não foi salva.”

Se houver tempo, explique que as consultas de operação se atualizam a cada 15 segundos e que os totais usam centavos para tratar os preços recebidos do PostgreSQL.

## 6:25–7:05 — Verificação e encerramento

**Mostre:** `npm test`, `npm run build`, o histórico de commits e o README no GitHub.

**Explique:**

“Foram verificados os cadastros, filtros, relações das comandas, totais e as transições de status. O README contém os passos de instalação, as variáveis necessárias e as dependências adicionais. Para executar, é preciso manter o backend rodando e configurar VITE_API_URL.”

Encerre identificando seu nome e a atividade. Publique no YouTube como não listado ou no Drive com acesso por link e envie o link junto ao repositório.

## Perguntas para ensaiar

- Qual a diferença entre o frontend do cliente e o CMS?
- Por que separar serviço, hook, página e componente?
- O que `useQuery` faz? E `useMutation`?
- Por que chamar `invalidateQueries` depois de salvar?
- Como o CMS sabe a categoria de um produto e a mesa de uma comanda?
- Por que a comanda é criada no backend e não no CMS?
- Como provar que o Kanban gravou o status?
- O que acontece se a API ficar indisponível ou uma exclusão tiver vínculos?
