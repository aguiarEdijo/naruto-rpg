# Adicionar Campo `updated_at` nas Tabelas

Este documento explica como adicionar o campo `updated_at` em todas as tabelas do sistema para habilitar rastreamento de alterações e futura implementação de changelog.

## 📋 Motivação

1. **Rastreamento de Alterações**: Permitir saber quando cada registro foi modificado pela última vez
2. **Controle de Versões**: Base para futura implementação de changelog do sistema
3. **Auditoria**: Ajudar a identificar quando mudanças foram feitas no sistema
4. **Atualização de Status GM**: Facilita alteração de usuários para GM pelo banco de dados

## 🚀 Executando a Migração

### Opção 1: Via SQL Editor do Supabase (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Copie e cole o conteúdo do arquivo `add-updated-at-columns.sql`
4. Execute o script

### Opção 2: Via Script Node.js (Futuro)

```bash
# Seria possível criar um script similar ao setup-database.js
node scripts/add-updated-at-columns.js
```

## ✅ Tabelas que Serão Modificadas

O script adiciona `updated_at` nas seguintes tabelas (se ainda não tiverem):

- ✅ `users` - **Já possui** (com trigger)
- ✅ `items` - **Já possui** (com trigger)
- ⚠️ `clans` - **Será adicionado**
- ⚠️ `enhancements` - **Será adicionado**
- ⚠️ `defects` - **Será adicionado**
- ⚠️ `skills` - **Será adicionado**
- ⚠️ `level_progression` - **Será adicionado**

## 🔧 O que o Script Faz

1. **Cria/Atualiza a Função Trigger**: Garante que a função `update_updated_at_column()` existe
2. **Adiciona Coluna `updated_at`**: Em cada tabela que não possui
3. **Cria Triggers Automáticos**: Para atualizar `updated_at` automaticamente em UPDATEs
4. **Inicializa Valores**: Para registros existentes, define `updated_at = created_at`
5. **Verificação Final**: Mostra quais tabelas têm ou não o campo

## 📊 Verificação

Após executar, você pode verificar com:

```sql
-- Verificar estrutura de uma tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'clans'
ORDER BY ordinal_position;

-- Verificar triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%updated_at%';
```

## 🔮 Futuro: Sistema de Changelog

Com `updated_at` em todas as tabelas, será possível implementar:

1. **Tabela de Changelog**: Registrar mudanças importantes
2. **Histórico de Alterações**: Ver o que mudou e quando
3. **Backup Automático**: Antes de alterações críticas
4. **Notificações**: Avisar jogadores sobre mudanças no sistema
5. **Rollback**: Reverter mudanças se necessário

## 📝 Exemplo de Uso Futuro

```sql
-- Criar tabela de changelog (futuro)
CREATE TABLE system_changelog (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para registrar mudanças (futuro)
CREATE TRIGGER log_clan_changes
    AFTER UPDATE ON clans
    FOR EACH ROW
    EXECUTE FUNCTION log_changes();
```

## ⚠️ Notas Importantes

- O script é **idempotente**: pode ser executado múltiplas vezes sem causar erros
- Não afeta dados existentes: apenas adiciona a coluna e inicializa com `created_at`
- Triggers são criados automaticamente para manter `updated_at` atualizado
- A função trigger é compartilhada entre todas as tabelas (DRY principle)

