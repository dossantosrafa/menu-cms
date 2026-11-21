# Como executar e apresentar

## 1. Preparar o backend

Se você já tem `menu-backend` no computador, abra a pasta no VS Code e confira se não há alterações locais antes de atualizar. No terminal:

```bash
git status
git pull --ff-only
npm install
```

Mantenha o `.env` que já utiliza. Se estiver configurando do zero, copie `.env.example` para `.env` e preencha `DATABASE_URL` e `DATABASE_SCHEMA` com os dados do seu PostgreSQL ou Supabase. Não envie esse arquivo ao GitHub.

```dotenv
PORT=3000
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO
DATABASE_SCHEMA=public
```

Para iniciar:

```bash
npm run start:dev
```

Antes da inicialização, o script `db:migrate:cms` converte o enum legado `DELIVERY` para `DELIVERED`, se ele existir. Não apaga pedidos. Depois, o TypeORM mantém a sincronização de entidades usada no projeto e cria os campos novos com valores padrão. Essa configuração de sincronização automática é a do projeto acadêmico.

O backend atualizado precisa ter `displayOrder` em Category, `isVegetarian` e `isNew` em Product, listagem de comandas, relações de mesa/produto/itens nas consultas de pedidos e as quatro opções de status previstas no trabalho. A versão anterior do repositório ainda não possuía tudo isso.

## 2. Conferir no Insomnia

1. No Insomnia, use a opção de importar arquivo e selecione `docs/insomnia-menu-cms.json` deste projeto.
2. No ambiente da coleção, ajuste `base_url` para o endereço do backend, normalmente `http://localhost:3000`.
3. Execute as consultas de categorias, produtos, mesas, comandas abertas e pedidos. Em banco vazio, o resultado correto das listas é `[]` com HTTP 200.
4. Para pedidos detalhados e alteração de status, preencha os IDs nas variáveis do ambiente conforme as respostas da API.

As gravações da coleção alteram o banco selecionado no Insomnia. Use os registros que você cadastrou para a demonstração.

## 3. Rodar o CMS

Em um segundo terminal, fora da pasta do backend:

```bash
git clone https://github.com/dossantosrafa/menu-cms.git
cd menu-cms
npm install
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Confira `VITE_API_URL` no `.env`. Depois:

```bash
npm run dev
```

Abra o endereço exibido no terminal. O cardápio do cliente, o backend e o CMS são três projetos distintos; cada frontend pode usar uma porta diferente escolhida pelo Vite. Não é necessário rodar o frontend do cliente para administrar os dados no CMS.

## 4. Preparar um pedido para demonstrar comandas e Kanban

1. No CMS, cadastre uma categoria ativa, um produto ativo com preço e uma mesa ativa.
2. No Insomnia, execute as listas e copie o `id` do produto e o `id` da mesa.
3. Preencha as variáveis `product_id` e `spot_id` da coleção.
4. Execute a requisição **Criar pedido da mesa**, cujo corpo é:

   ```json
   {
     "spotId": "ID_REAL_DA_MESA",
     "items": [
       { "productId": "ID_REAL_DO_PRODUTO", "quantity": 2 }
     ]
   }
   ```

5. A API cria a comanda automaticamente. No CMS, abra **Comandas**, clique em **Atualizar** e depois em **Ver pedidos**.
6. Mude o status no select, abra **Pedidos · Kanban** e arraste o cartão pela alça. Espere a mensagem de sucesso.
7. Pressione **F5** e mostre que o pedido permanece na coluna correspondente ao status salvo.

Se fizer um segundo pedido para a mesma mesa, a API reutiliza a comanda aberta e o total acumulado aumenta. O CMS não possui formulário de abertura de comanda nem de criação de pedido, conforme o enunciado.

## 5. Conferir antes de gravar

- Crie, edite e exclua uma categoria, um produto e uma mesa de teste. Para excluir a categoria, remova primeiro o produto vinculado.
- Para demonstrar exclusão sem afetar os pedidos, use um produto e uma mesa que ainda não tenham sido usados na operação.
- Mostre um produto vegetariano e outro com novidade, o filtro de categoria e um preço formatado em reais.
- Mostre os itens de um pedido e seu total; altere o status livremente, inclusive retornando a um anterior.
- No Kanban, arraste um cartão e dê F5 após a confirmação de sucesso.
- Execute `npm test` e `npm run build` no CMS. No backend, execute `npm run test:cms`.

## 6. Parar e iniciar novamente

Para parar cada projeto, use `Ctrl+C` no seu terminal. Para voltar a rodar outro dia:

```bash
# Na pasta menu-backend
npm run start:dev
```

```bash
# Em outro terminal, na pasta menu-cms
npm run dev
```

Não é necessário executar `npm install` toda vez, apenas na primeira instalação ou quando as dependências mudarem.

## Problemas comuns

| Sintoma | O que conferir |
| --- | --- |
| Erro de conexão nas listas | Backend rodando, `VITE_API_URL` correta e Vite reiniciado após editar `.env` |
| `/guest-checks` retorna 404 ou status não muda | Atualizar o backend; a versão anterior não tinha a listagem e tinha um erro na validação de status |
| Categorias ou produtos não aparecem | Conferir o banco e `DATABASE_SCHEMA` usados pelo backend; o CMS não tem dados de demonstração embutidos |
| Não consigo criar produto | Cadastrar ou ativar uma categoria primeiro |
| Exclusão retorna conflito | O registro tem vínculo com produtos, pedidos ou comandas; desative-o ou remova os vínculos permitidos |
| Foto ou ícone não carregam | A URL precisa apontar para uma imagem pública; a interface exibe um substituto quando falha |
| Erro de versão do Node | Usar Node.js 22.18 ou superior e instalar novamente as dependências |

## O que enviar

No ambiente da disciplina, informe:

1. Repositório público: `https://github.com/dossantosrafa/menu-cms`.
2. Link do vídeo gravado por você, de 5 a 8 minutos, com voz e todas as funcionalidades.

Antes de enviar, abra o link do vídeo em uma janela anônima e confirme que ele pode ser assistido. O roteiro está em `docs/ROTEIRO_VIDEO.md`.
