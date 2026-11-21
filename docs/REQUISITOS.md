# Mapa da atividade

| Item | Implementação | Onde conferir |
| --- | --- | --- |
| Stack | Vite, React, Tailwind, shadcn/ui, Axios e TanStack Query | `package.json`, `components.json`, `vite.config.ts` |
| Instância Axios única | `baseURL` de `VITE_API_URL`; endpoints nos serviços | `src/lib/axios.ts`, `src/services` |
| Leituras | `useQuery` em todos os recursos | `src/hooks/use-menu.ts` |
| Gravações | `useMutation` para CRUD e status; invalidação após sucesso | `src/hooks/use-menu.ts` |
| 3.1 Categorias — 1,5 | CRUD, nome, ícone, ordem, situação e confirmação | `categories-page.tsx`, `category-form.tsx` |
| 3.2 Produtos — 2,0 | CRUD de todos os campos, select da API, filtro, reais e indicadores | `products-page.tsx`, `product-form.tsx` |
| 3.3 Mesas — 1,5 | CRUD de Spot e confirmação | `spots-page.tsx`, `spot-form.tsx` |
| 3.4 Comandas — 1,5 | Somente OPENED, mesa, abertura, total e detalhe; nenhum formulário de abertura | `guest-checks-page.tsx`, `guest-check-detail-page.tsx` |
| 3.5 Pedidos — 2,5 | Itens, quantidades, preço unitário, subtotais, total, badge e status livre | `order-card.tsx`, hook `useOrderStatus` |
| 3.6 Qualidade — 1,0 | Navegação, estados de leitura, feedback, validação e organização | Layout, componentes compartilhados, formulários e hooks |
| Bônus Kanban | Quatro colunas, cartões, drag and drop, PATCH e releitura após F5 | `order-kanban.tsx`, `orders-page.tsx` |
| Repositório | Público, README, `.env.example` e commits por etapa | Raiz do projeto e histórico Git |
| Vídeo | Roteiro de cerca de sete minutos | `docs/ROTEIRO_VIDEO.md`; gravação e publicação cabem ao aluno |

O mapa indica cobertura implementada, não uma garantia de nota. A avaliação depende da execução, do histórico aceito pelo professor e da entrega do vídeo pelo aluno.
