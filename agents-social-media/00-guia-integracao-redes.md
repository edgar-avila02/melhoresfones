# 📱 Guia de Integração e Configuração das Redes Sociais

Este documento explica como obter as chaves de API e configurar os **GitHub Secrets** para que a automação via **GitHub Actions** publique automaticamente na sua **Página do Facebook** e no **Pinterest** sempre que um artigo novo ou atualizado subir para o site.

---

## 🔑 Lista de Chaves Necessárias (GitHub Secrets)

No seu repositório no GitHub, acesse:
**Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

Você cadastrará as seguintes 5 chaves:

| Nome do Secret | Descrição | Onde Obter |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Chave da IA do Google para gerar as copys | Google AI Studio (gratuito) |
| `FB_PAGE_ID` | Identificador numérico da sua Página no Facebook | Configurações da Página no Facebook |
| `FB_PAGE_ACCESS_TOKEN` | Token permanente de postagem da Página | Meta for Developers |
| `PINTEREST_ACCESS_TOKEN` | Token de autorização para criar Pins | Pinterest Developer Portal |
| `PINTEREST_BOARD_ID` | ID da pasta onde os Pins serão salvos | Pinterest Developer Portal / URL da pasta |

---

## 🛠️ Passo a Passo para Obter Cada Token

### 1. `GEMINI_API_KEY` (Google AI Studio) — 1 minuto
1. Acesse [https://aistudio.google.com/](https://aistudio.google.com/) e faça login com sua conta Google.
2. Clique no botão azul **"Get API key"**.
3. Clique em **"Create API key in new project"**.
4. Copie a chave gerada e salve no secret com o nome `GEMINI_API_KEY`.

---

### 2. Facebook: `FB_PAGE_ID` e `FB_PAGE_ACCESS_TOKEN`
Para postar automaticamente em uma página do Facebook sem expirar, você precisa de um **Page Access Token de longa duração (Never Expire)**:

#### Passo 2.1: Obter o `FB_PAGE_ID`
1. Acesse sua Página no Facebook.
2. Vá em **Configurações** > **Sobre** ou veja na URL da página o número de identificação da página.
3. Cadastre como `FB_PAGE_ID`.

#### Passo 2.2: Obter o `FB_PAGE_ACCESS_TOKEN`
1. Acesse o [Meta for Developers](https://developers.facebook.com/) e crie um App (tipo: **Empresa / Outros**).
2. Adicione o produto **"API do Graph"**.
3. Acesse o **Explorador da Graph API** (`https://developers.facebook.com/tools/explorer/`).
4. Em *Permissões*, adicione:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
5. Gere o Token do Usuário e, no campo de seleção de tokens, mude para o **Token da sua Página**.
6. Para transformar em um token permanente que nunca expira:
   - Abra a ferramenta **Access Token Debugger** (`https://developers.facebook.com/tools/debug/accesstoken/`).
   - Cole o token gerado e clique em **"Extend Access Token"**.
7. Copie o token final e salve como `FB_PAGE_ACCESS_TOKEN`.

---

### 3. Pinterest: `PINTEREST_ACCESS_TOKEN` e `PINTEREST_BOARD_ID`

#### Passo 3.1: Obter o `PINTEREST_ACCESS_TOKEN`
1. Acesse o [Pinterest Developer Portal](https://developers.pinterest.com/) com sua conta Business.
2. Crie uma aplicação (ex: *Melhores Fones Blog*).
3. Na seção de credenciais / tokens de acesso, gere um token com as permissões:
   - `boards:read`
   - `pins:read`
   - `pins:write`
4. Copie o token e salve como `PINTEREST_ACCESS_TOKEN`.

#### Passo 3.2: Obter o `PINTEREST_BOARD_ID`
1. Para descobrir o ID da pasta (Board) do Pinterest onde deseja salvar os Pins, faça uma chamada GET rápida na API do Pinterest ou use o endpoint de listagem de boards no próprio console de testes do Pinterest Developer.
2. Copie o ID da pasta e salve como `PINTEREST_BOARD_ID`.

---

## 🧪 Como Testar Localmente (Opcional)

Se quiser rodar o script no seu terminal antes de subir para o GitHub:
1. Crie um arquivo temporário `.env` com as chaves:
   ```env
   GEMINI_API_KEY=sua_chave
   FB_PAGE_ID=seu_id
   FB_PAGE_ACCESS_TOKEN=seu_token
   PINTEREST_ACCESS_TOKEN=seu_token
   PINTEREST_BOARD_ID=seu_id
   ```
2. Execute o comando apontando para qualquer artigo:
   ```bash
   node scripts/publish-social.js src/content/posts/como-conectar-os-dois-fones-bluetooth.md
   ```
3. O script exibirá o status da geração pela IA e da publicação nas duas redes!
