# Menu CMS

Painel administrativo do cardápio digital, desenvolvido por Rafael Fontana dos Santos para a atividade da Unidade 3. Consome a API NestJS do [menu-backend](https://github.com/dossantosrafa/menu-backend), com a mesma base tecnológica do [menu-frontend](https://github.com/dossantosrafa/menu-frontend).

## Funcionalidades

- Categorias: listar, cadastrar, editar e excluir; nome, ícone por URL, ordem de exibição e situação.
- Produtos: CRUD completo, imagem por URL, descrição, preço em reais, categoria, situação, vegetariano e novidade; filtro de categoria na API e busca por nome.
- Mesas: CRUD completo de nome e situação.
- Comandas: somente leitura das abertas, mesa, data e total acumulado; detalhe com os pedidos e seus itens.
- Pedidos: quantidade, preço unitário, subtotal, total e alteração livre entre `NEW`, `PREPARING`, `READY` e `DELIVERED`.
- Bônus: Kanban com quatro colunas, arrastar e soltar, gravação na API e persistência após F5. O select “Mover para” também permite operar sem arrastar.
- Estados de carregamento, erro com nova tentativa, lista vazia e feedback de sucesso/erro. Confirmação antes de cada exclusão.

O CMS não cria comandas nem pedidos. A API abre a comanda no primeiro pedido da mesa. Não há catálogo, mesas ou pedidos fixos no código, nem fallback para dados locais. Os números exibidos são calculados a partir das respostas da API.

## Instalar e executar

Requisitos: Node.js **22.18 ou superior**, npm, backend NestJS atualizado e acesso ao banco PostgreSQL configurado nele. O banco é configurado no backend; credenciais do banco não pertencem ao frontend.

1. Inicie o backend. Em uma pasta separada, instale as dependências, configure seu `.env` a partir do `.env.example` e execute:

   ```bash
   npm install
   npm run start:dev
   ```

2. Confira no Insomnia as rotas da API. Importe [docs/insomnia-menu-cms.json](docs/insomnia-menu-cms.json). Os passos estão no [guia de execução](docs/GUIA_EXECUCAO.md).

3. Em outro terminal, clone e abra este projeto:

   ```bash
   git clone https://github.com/dossantosrafa/menu-cms.git
   cd menu-cms
   npm install
   ```

4. Copie `.env.example` para `.env` e ajuste o endereço da sua API. No PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Conteúdo mínimo:

   ```dotenv
   VITE_API_URL=http://localhost:3000
   ```

5. Inicie o CMS:

   ```bash
   npm run dev
   ```

Abra o endereço exibido pelo Vite. Mantenha os dois terminais abertos. Depois de alterar `.env`, reinicie o Vite. Nenhuma URL de API está escrita nos componentes.

## Organização e decisões

| Caminho | Responsabilidade |
| --- | --- |
| `src/pages` | Categorias, produtos, mesas, comandas, detalhe e pedidos |
| `src/components` | Formulários, cartões, quadro Kanban e elementos compartilhados |
| `src/components/ui` | Componentes shadcn/ui, com Base UI e Tailwind |
| `src/services` | Chamadas dos recursos REST |
| `src/hooks/use-menu.ts` | `useQuery`, `useMutation`, chaves de cache e invalidações |
| `src/lib/axios.ts` | Única instância Axios com `VITE_API_URL`, timeout e tratamento de erros |
| `src/lib` | Formatação brasileira, validação e cálculo de totais |
| `src/types/api.ts` | Tipos das entidades e dos dados enviados à API |
| `tests` | Testes de preço, URLs, totais e contrato de status |
| `docs` | Execução, Insomnia, roteiro do vídeo, critérios e validação |

As leituras usam `useQuery`; todas as gravações usam `useMutation`. Após o sucesso, `invalidateQueries` atualiza as listas afetadas. Comandas e pedidos também são consultados a cada 15 segundos e ao retornar à janela. O intervalo é uma opção simples para acompanhar a operação sem acrescentar WebSockets à API.

O Kanban mostra o status confirmado pelo servidor. Ao soltar um cartão, é feito `PATCH /orders/:id/status`; a consulta é invalidada e os cartões são redesenhados com o retorno atualizado. Se houver erro, o pedido permanece no status anterior e aparece um aviso. O CMS não mantém uma segunda fonte de verdade no localStorage.

Os preços `numeric` do PostgreSQL podem chegar como strings. Os totais de comandas são calculados em centavos para evitar concatenação ou ruído decimal e incluem todos os pedidos da comanda, inclusive entregues. O preço de um pedido usa o valor registrado nos seus itens, preservando o histórico mesmo se o produto for editado depois.

Produtos inativos são incluídos na consulta administrativa com `includeInactive=true`. O comportamento padrão de `/products` continua adequado ao cardápio do cliente, exibindo apenas ativos. Categorias inativas não podem ser escolhidas para novos vínculos; o vínculo existente pode ser mantido numa edição.

## Dependências além da stack obrigatória

Stack obrigatória: Vite, ReactJS, Tailwind CSS, shadcn/ui, Axios e TanStack Query.

| Dependência | Justificativa |
| --- | --- |
| `react-dom` | Renderização do React no navegador |
| `react-router-dom` | Navegação entre páginas e detalhe por ID; também usada no frontend de referência |
| `@base-ui/react` | Primitivas acessíveis dos componentes shadcn/ui, seguindo o frontend de referência |
| `class-variance-authority` | Variantes visuais de botões e badges do shadcn/ui |
| `cn` | Composição das classes Tailwind, como no frontend de referência |
| `lucide-react` | Ícones da navegação e ações |
| `@fontsource-variable/inter` | Fonte local, sem depender de requisição a um serviço de fontes |
| `tw-animate-css` | Animações dos diálogos e componentes shadcn/ui |
| `@tailwindcss/vite` | Integração do Tailwind 4 com o Vite |
| `sonner` | Toasts de sucesso e erro, usado no ecossistema shadcn/ui |
| `@dnd-kit/core` | Arrastar e soltar no Kanban, com sensores de ponteiro e teclado |
| `vitest` (desenvolvimento) | Testes das regras de validação e de soma financeira |
| TypeScript, tipos, ESLint e plugin React do Vite (desenvolvimento) | Tipagem, compilação e ferramentas do projeto, presentes no frontend de referência |

Os componentes shadcn/ui ficam no repositório e são adaptáveis. A licença do código original está em [docs/shadcn-LICENSE.txt](docs/shadcn-LICENSE.txt).

## Verificações e entrega

```bash
npm test
npm run build
```

No backend, `npm run test:cms` executa os testes HTTP de integração em um banco temporário, sem utilizar seu banco configurado em `.env`.

- [Guia para executar e demonstrar](docs/GUIA_EXECUCAO.md)
- [Roteiro do vídeo de 5 a 8 minutos](docs/ROTEIRO_VIDEO.md)
- [Mapa dos requisitos da atividade](docs/REQUISITOS.md)
- [Resultados e limites da validação](docs/VALIDACAO.md)

O repositório contém commits por etapa, com datas reais de desenvolvimento. Eles não representam um histórico retroativo ao longo do bimestre.

O vídeo precisa ser gravado pelo próprio aluno, com sua voz, e publicado como não listado no YouTube ou com acesso por link no Drive. Para entregar, informe o link deste repositório e o link do vídeo no ambiente da disciplina.
