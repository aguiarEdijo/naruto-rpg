# Como Importar Defeitos do arquivo emoções.md

## Pré-requisitos

1. Certifique-se de que você tem um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

   **Onde encontrar essas informações:**
   - Acesse o [Supabase Dashboard](https://app.supabase.com)
   - Vá em **Settings** → **API**
   - **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (secret) = `SUPABASE_SERVICE_ROLE_KEY`

2. Certifique-se de que as dependências estão instaladas:
   ```bash
   npm install
   ```

## Executando o Script

### Opção 1: Usando npm script (Recomendado)

```bash
npm run import-defects
```

### Opção 2: Executando diretamente com Node.js

```bash
node scripts/import-defects-from-emotions.js
```

## O que o script faz?

1. **Lê o arquivo** `docs/emoções.md`
2. **Faz parse** do markdown para extrair os defeitos
3. **Verifica** quais defeitos já existem no banco de dados
4. **Insere apenas** os defeitos novos que ainda não foram importados
5. **Exibe um relatório** de quantos defeitos foram importados

## Saída Esperada

O script mostrará algo como:

```
🚀 Iniciando importação de defeitos do arquivo emoções.md...
📖 Fazendo parse do arquivo markdown...
✅ Encontrados 21 defeitos no arquivo
🔍 Verificando defeitos existentes no banco...
📊 Encontrados 13 defeitos já cadastrados
✨ 8 defeitos novos para importar

📋 Defeitos que serão importados:
  1. Abandonado pela Fé (Emocional/Psicológico)
  2. Abraçado pelas Trevas (Emocional/Psicológico)
  ...

💾 Inserindo defeitos no banco de dados...
✅ 8 defeitos importados com sucesso!

📊 Resumo:
   Total no arquivo: 21
   Já existentes: 13
   Novos importados: 8

✅ Importação concluída!
```

## Resolução de Problemas

### Erro: "NEXT_PUBLIC_SUPABASE_URL não encontrada"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que as variáveis estão escritas corretamente

### Erro: "SUPABASE_SERVICE_ROLE_KEY não encontrada"
- Adicione a `SUPABASE_SERVICE_ROLE_KEY` no arquivo `.env`
- Use a **service_role** key (não a anon key)

### Erro ao fazer parse do arquivo
- Verifique se o arquivo `docs/emoções.md` existe
- Certifique-se de que o arquivo tem a estrutura correta (seções e defeitos)

### Erro de permissão no banco
- Certifique-se de que está usando a `service_role` key (não a anon key)
- A service_role key tem permissões completas no banco

