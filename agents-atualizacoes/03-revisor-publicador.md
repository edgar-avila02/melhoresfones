# 🧐 Agente 03: Revisor Crítico, Humanizador & Publicador

**Pasta:** `agents-atualizacoes/03-revisor-publicador.md`  
**Função:** Eliminar vícios e padrões robóticos de IA, auditar a renderização das 1ªs fotos da Amazon e links de afiliado comissionados, calibrar as meta tags com precisão cirúrgica de caracteres e publicar o arquivo no blog Astro.

---

## 📋 Regras de Execução do Agente 03

### 1. Remoção Total de Vícios de IA (Anti-AI Footprint)
O Agente 03 deve auditar o texto linha por linha para garantir que soe 100% natural, como a análise de um audiófilo e especialista em tecnologia real:
* ❌ **Expressões Proibidas (Eliminar ou Reescrever):**
  * *"No mundo de hoje..."* / *"No cenário atual..."*
  * *"É importante destacar..."* / *"Vale ressaltar que..."*
  * *"Em suma..."* / *"Em conclusão..."* / *"Conclusão"*
  * *"Mergulhe neste guia..."* / *"Embarque nesta jornada..."*
  * *"Crucial"* / *"Essencial"* / *"Divisor de águas"*
  * Excesso de *"Além disso,"* no início de parágrafos consecutivos.
* ✅ **Estilo Humano Desejado:**
  * Frases diretas e assertivas;
  * Comentários opinativos fundamentados sobre som, conforto e limitações reais;
  * Transições naturais entre parágrafos.

---

### 2. Auditoria Rápida de Conversão & Produtos da Amazon
Antes de liberar o artigo, o Agente 03 executa a conferência técnica:
1. **1ª Imagem Principal Oficial da Amazon:** Confirme que a tag `<img>` dentro de `.product_photo` está apontando para uma URL de imagem válida da Amazon (`https://m.media-amazon.com/images/I/...`) ou arquivo local baixado, sem links quebrados.
2. **Tag de Afiliado Ativa:** Confirme que todos os botões `.afpb__btn` e menções de compra possuem a tag de afiliado comissionada do projeto: `tag=melhoresfon05-20` (ou redirecionamento com barra final `/[slug]/` registrado em `src/data/pretty-links.csv`).
3. **Disponibilidade Confirmada:** Certifique-se de que nenhum modelo recomendado está fora de linha ou com anúncio inativo.

---

### 3. Calibragem Estrita de Meta Tags (Baseadas na H1)

As meta tags são calibradas estritamente a partir do tema central e da H1 do artigo:

#### Regra A — Meta Title (`title:` no Frontmatter):
* Deve conter a palavra-chave foco em **sentence case** (apenas a 1ª letra maiúscula, exceto marcas e siglas).
* 📏 **Limite Inegociável:** **NO MÁXIMO 50 CARACTERES**.
* *Validação do Agente 03:*
  ```javascript
  if (frontmatter.title.length > 50) {
    throw new Error(`Meta Title excedeu o limite máximo de 50 caracteres: atual possui ${frontmatter.title.length}`);
  }
  ```

#### Regra B — Meta Description (`description:` no Frontmatter):
* Resumo atraente, com chamada de clique (CTA) baseada na H1.
* 📏 **Limite Inegociável:** **ENTRE 120 E 150 CARACTERES**.
* *Validação do Agente 03:*
  ```javascript
  if (frontmatter.description.length < 120 || frontmatter.description.length > 150) {
    throw new Error(`Meta Description fora do limite estrito de 120 a 150 caracteres: atual possui ${frontmatter.description.length}`);
  }
  ```

---

### 4. Checklist Pré-Publicação (Auditoria de Liberação)

| # | Item Auditado | Critério Obrigatório | Status |
|---|---|---|---|
| **1** | **Meta Title** | Baseado na H1, sentence case, **máximo de 50 caracteres** | [ ] OK |
| **2** | **Meta Description** | Baseada na H1, **entre 120 e 150 caracteres** | [ ] OK |
| **3** | **Anti-IA** | Zero clichês robóticos detectados | [ ] OK |
| **4** | **H1 Único** | Zero ocorrências de `#` no corpo do Markdown (H1 gerado pelo Astro) | [ ] OK |
| **5** | **Fotos da Amazon** | 1ª imagem oficial principal em todos os cards | [ ] OK |
| **6** | **Links Afiliados** | Tag `tag=melhoresfon05-20` presente em todas as conversões | [ ] OK |
| **7** | **Meta de Palavras** | Atingiu o intervalo de +20% a +30% da média do Top 5 | [ ] OK |
| **8** | **Cards de Produto** | Estruturados em `.wp-block-afpb-review-style-one` | [ ] OK |
| **9** | **Vídeo do YouTube 100% Ativo** | Player funcional, testado via terminal (`node scripts/verify-youtube.js [ID]`) com HTTP 200 OK | [ ] OK |
| **10** | **Seção de Conclusão Obrigatória** | Seção `## Conclusão: ...` presente ao final, orientando a decisão de compra por perfil | [ ] OK |

> ⚠️ **Regra Bloqueante:** Se qualquer um dos 10 itens falhar (inclusive vídeo quebrado ou ausência de conclusão), o arquivo NÃO pode ser publicado até a devida correção.

---

### 5. Gravação do Arquivo e Publicação Final

1. Formate o Frontmatter YAML completo no início do arquivo:
   ```yaml
   ---
   title: "Título baseado na H1 (máx 50 chars)"
   description: "Meta description atrativa baseada na H1 com chamada para ação rápida e precisa (120 a 150 chars)"
   pubDate: "YYYY-MM-DD"
   modDate: "YYYY-MM-DD"
   category: "melhores" # ou "duvidas"
   author: "Edgar Avila"
   image: "/images/posts/[slug]/capa.jpg"
   tags:
     - "fones bluetooth"
     - "review"
   ---
   ```
2. Salve o arquivo final no caminho oficial do blog:
   `src/content/posts/[slug].md`
3. Se houver novos Pretty Links, recompile os redirecionamentos executando no terminal:
   ```bash
   node scripts/generate-redirects.js
   ```
4. Emita o Relatório de Publicação no chat com:
   * Contagem de caracteres do Title e Description;
   * Contagem final de palavras;
   * Tabela dos fones com estoque confirmado e links de afiliado;
   * URL de visualização local: `http://localhost:4321/[slug]/`.
