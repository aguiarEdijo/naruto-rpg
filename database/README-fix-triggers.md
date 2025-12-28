# Correção de Triggers `updated_at`

## 🐛 Problema

Ao tentar atualizar registros diretamente no banco de dados, você pode receber o erro:

```
record "new" has no field "updated_at"
```

Isso acontece quando:
- Um trigger foi criado antes da coluna `updated_at` existir na tabela
- O trigger tenta acessar `NEW.updated_at` mas a coluna não existe

## ✅ Solução

Execute o script `fix-updated-at-triggers.sql` que:

1. **Remove triggers quebrados** - Limpa triggers antigos que podem estar causando o erro
2. **Adiciona colunas faltantes** - Garante que todas as tabelas tenham `updated_at`
3. **Recria triggers corretamente** - Cria novos triggers apenas após a coluna existir
4. **Usa função segura** - A função verifica se a coluna existe antes de atualizar

## 🚀 Como Usar

### Via SQL Editor do Supabase

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Copie e cole o conteúdo de `fix-updated-at-triggers.sql`
4. Execute o script
5. Verifique a mensagem de sucesso no final

### Verificar se Funcionou

Após executar, você pode testar atualizando um registro:

```sql
-- Teste: Atualizar um usuário para GM
UPDATE users 
SET is_gm = true 
WHERE email = 'seu-email@exemplo.com';

-- Deve funcionar sem erros e atualizar o updated_at automaticamente
```

## 🔍 Diferença Entre os Scripts

### `add-updated-at-columns.sql`
- Script inicial para adicionar `updated_at` pela primeira vez
- Verifica se coluna existe antes de criar trigger
- Pode falhar se executado quando triggers já existem

### `fix-updated-at-triggers.sql` ⭐ RECOMENDADO
- Script de **correção** para problemas existentes
- **Remove triggers antigos primeiro** (evita conflitos)
- Recria tudo do zero de forma segura
- Função trigger com verificação adicional de segurança

## 📋 Tabelas Corrigidas

- ✅ `clans`
- ✅ `enhancements`
- ✅ `defects`
- ✅ `skills`
- ✅ `level_progression`
- ✅ `users` (já tinha, mantido)
- ✅ `items` (já tinha, mantido)

## ⚠️ Importante

Após executar o script de correção:
- Todos os triggers serão recriados
- A coluna `updated_at` será adicionada onde faltar
- Registros existentes terão `updated_at = created_at`
- Futuras atualizações atualizarão `updated_at` automaticamente

## 🧪 Teste Manual

Após executar o script, teste com:

```sql
-- 1. Verificar estrutura
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clans' 
ORDER BY ordinal_position;

-- 2. Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%updated_at%';

-- 3. Testar atualização
UPDATE clans 
SET nome = nome || ' (teste)'
WHERE id = 1;

-- 4. Verificar se updated_at foi atualizado
SELECT nome, created_at, updated_at 
FROM clans 
WHERE id = 1;
```

Se `updated_at` for diferente de `created_at`, o trigger está funcionando! ✅

