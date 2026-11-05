#!/usr/bin/env node

/**
 * Script de Publicação Automática em Redes Sociais (Facebook e Pinterest)
 * Melhores Fones (melhoresfones.com)
 *
 * Utiliza o Agente Especialista (agents-social-media/01-especialista-social-media.md)
 * com Google Gemini API para adaptar a copy do artigo e postar nas APIs oficiais.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'yaml';

const BASE_URL = 'https://melhoresfones.com';

// 1. Obter lista de arquivos a processar
function getFilesToProcess() {
  const cliArg = process.argv[2];
  if (cliArg && fs.existsSync(cliArg)) {
    return [cliArg];
  }

  // Se executado no GitHub Actions ou sem argumento, detecta arquivos alterados no último commit
  try {
    const diffOutput = execSync('git diff --name-only --diff-filter=AM HEAD~1 HEAD', { encoding: 'utf-8' });
    const changed = diffOutput
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.startsWith('src/content/posts/') && line.endsWith('.md'));
    if (changed.length > 0) {
      return changed;
    }
  } catch (e) {
    // Caso não seja um git diff válido (ex: primeiro commit ou execução manual)
  }

  // Fallback: pega o post mais recente pelo mtime
  const postsDir = path.resolve('src/content/posts');
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({ name: f, time: fs.statSync(path.join(postsDir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);
    if (files.length > 0) {
      return [path.join('src/content/posts', files[0].name)];
    }
  }

  return [];
}

// 2. Extrair dados do Markdown
function parseArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const rawYaml = match[1];
  const body = match[2].trim();
  const frontmatter = yaml.parse(rawYaml) || {};

  const slug = frontmatter.slug || path.basename(filePath, '.md');
  const title = frontmatter.title || slug;
  const description = frontmatter.description || '';
  const category = frontmatter.category || 'duvidas';
  const image = frontmatter.image || `/images/posts/${slug}/capa.jpg`;
  const canonicalUrl = `${BASE_URL}/${slug}/`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  return {
    filePath,
    slug,
    title,
    description,
    category,
    image,
    imageUrl,
    canonicalUrl,
    body: body.slice(0, 4000) // Primeiras 4000 caracteres para contexto
  };
}

// 3. Carregar instruções do especialista
function getSpecialistPrompt() {
  const promptPath = path.resolve('agents-social-media/01-especialista-social-media.md');
  if (fs.existsSync(promptPath)) {
    return fs.readFileSync(promptPath, 'utf-8');
  }
  return 'Você é um especialista em redes sociais para o portal Melhores Fones. Crie copy para Facebook e Pinterest.';
}

// 4. Chamar a IA (Gemini API)
async function generateSocialCopies(article, apiKey) {
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY não encontrada. Gerando copy básica local de fallback.');
    return generateFallbackCopies(article);
  }

  const systemInstructions = getSpecialistPrompt();
  const userPrompt = `
Por favor, analise as informações do artigo abaixo e crie as postagens para o Facebook e Pinterest:

- Título: ${article.title}
- Descrição: ${article.description}
- Categoria: ${article.category}
- URL Canônica: ${article.canonicalUrl}
- Imagem: ${article.imageUrl}
- Conteúdo resumido:
${article.body.slice(0, 2000)}

Retorne OBRIGATORIAMENTE APENAS um objeto JSON válido, sem blocos de código markdown adicionais, com esta estrutura:
{
  "facebook": {
    "message": "Texto completo da copy para o Facebook com emojis, ganchos nas primeiras 2 linhas, bullets, chamada de ação e hashtags."
  },
  "pinterest": {
    "title": "Título otimizado para o Pin (máx 100 caracteres)",
    "description": "Descrição rica em SEO para o Pin (máx 500 caracteres com hashtags)",
    "overlayText": "Texto chamativo para colocar na arte vertical",
    "suggestedBoard": "Dicas de Fones de Ouvido"
  }
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstructions}\n\n---\n\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro ao chamar Gemini API (${response.status}):`, errorText);
    return generateFallbackCopies(article);
  }

  const result = await response.json();
  const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    return generateFallbackCopies(article);
  }

  try {
    return JSON.parse(textOutput);
  } catch (e) {
    console.error('Falha ao parsear JSON retornado pelo Gemini:', textOutput);
    return generateFallbackCopies(article);
  }
}

// Fallback sem IA se a chave não estiver configurada
function generateFallbackCopies(article) {
  return {
    facebook: {
      message: `🎧 Novo artigo no Melhores Fones!\n\n👉 ${article.title}\n\n${article.description}\n\nConfira o guia completo e atualizado em nosso site:\n🔗 ${article.canonicalUrl}\n\n#FoneDeOuvido #Audio #Tecnologia #MelhoresFones`
    },
    pinterest: {
      title: article.title.length > 100 ? article.title.slice(0, 97) + '...' : article.title,
      description: `${article.description} Acesse o tutorial passo a passo no Melhores Fones! #FonesDeOuvido #FoneBluetooth #Tecnologia`,
      overlayText: article.title,
      suggestedBoard: article.category === 'melhores' ? 'Melhores Fones de Ouvido' : 'Dicas de Fones de Ouvido'
    }
  };
}

// 5. Publicar no Facebook
async function publishToFacebook(article, fbData) {
  const pageId = process.env.FB_PAGE_ID;
  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    console.log('\n🟡 [Facebook] Tokens (FB_PAGE_ID ou FB_PAGE_ACCESS_TOKEN) não configurados.');
    console.log('📌 Copy gerada para publicação manual:');
    console.log('--------------------------------------------------');
    console.log(fbData.message);
    console.log(`Link: ${article.canonicalUrl}`);
    console.log('--------------------------------------------------\n');
    return { success: false, reason: 'missing_tokens' };
  }

  console.log(`🔵 [Facebook] Publicando na página ID: ${pageId}...`);
  const endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: fbData.message,
      link: article.canonicalUrl,
      access_token: accessToken
    })
  });

  const resJson = await response.json();
  if (!response.ok) {
    console.error('❌ [Facebook] Falha ao publicar:', resJson);
    return { success: false, error: resJson };
  }

  console.log(`✅ [Facebook] Post publicado com sucesso! Post ID: ${resJson.id}`);
  return { success: true, id: resJson.id };
}

// 6. Publicar no Pinterest
async function publishToPinterest(article, pinData) {
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID;

  if (!accessToken || !boardId) {
    console.log('\n🟡 [Pinterest] Tokens (PINTEREST_ACCESS_TOKEN ou PINTEREST_BOARD_ID) não configurados.');
    console.log('📌 Dados gerados para Pin manual:');
    console.log('--------------------------------------------------');
    console.log(`Título: ${pinData.title}`);
    console.log(`Descrição: ${pinData.description}`);
    console.log(`Link: ${article.canonicalUrl}`);
    console.log(`Imagem: ${article.imageUrl}`);
    console.log(`Pasta Sugerida: ${pinData.suggestedBoard}`);
    console.log('--------------------------------------------------\n');
    return { success: false, reason: 'missing_tokens' };
  }

  console.log(`🔴 [Pinterest] Criando Pin no Board ID: ${boardId}...`);
  const endpoint = 'https://api.pinterest.com/v5/pins';

  const payload = {
    board_id: boardId,
    title: pinData.title.slice(0, 100),
    description: pinData.description.slice(0, 500),
    link: article.canonicalUrl,
    media_source: {
      source_type: 'image_url',
      url: article.imageUrl
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json();
  if (!response.ok) {
    console.error('❌ [Pinterest] Falha ao criar Pin:', resJson);
    return { success: false, error: resJson };
  }

  console.log(`✅ [Pinterest] Pin criado com sucesso! Pin ID: ${resJson.id}`);
  return { success: true, id: resJson.id };
}

// Execução Principal
async function main() {
  console.log('🚀 Iniciando Automação de Postagens para Redes Sociais...\n');

  const files = getFilesToProcess();
  if (files.length === 0) {
    console.log('ℹ️ Nenhum artigo novo ou modificado em src/content/posts/*.md para processar.');
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  for (const file of files) {
    console.log(`📄 Processando artigo: ${file}`);
    const article = parseArticle(file);
    if (!article) {
      console.warn(`⚠️ Não foi possível ler o frontmatter de: ${file}`);
      continue;
    }

    console.log(`🧠 Acionando Agente Especialista para: "${article.title}"...`);
    const socialCopies = await generateSocialCopies(article, apiKey);

    // Publicações
    await publishToFacebook(article, socialCopies.facebook);
    await publishToPinterest(article, socialCopies.pinterest);
  }

  console.log('🏁 Processamento de redes sociais concluído.');
}

main().catch(err => {
  console.error('Erro na execução do script:', err);
  process.exit(1);
});
