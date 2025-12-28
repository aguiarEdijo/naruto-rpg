# Como Corrigir Erro de Permissões RLS na Tabela Characters

## Problema

O erro `Erro ao buscar personagens: {}` indica que as políticas RLS (Row Level Security) estão bloqueando o acesso à tabela `characters`.

## Solução

Execute o script SQL no Supabase para configurar as políticas corretamente.

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para [https://app.supabase.com](https://app.supabase.com)
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New query**

3. **Cole e Execute o Script**
   - Abra o arquivo `database/fix-characters-rls-policies.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** ou pressione `Ctrl+Enter`

4. **Verifique o Resultado**
   - O script vai mostrar uma tabela com as políticas criadas
   - Você deve ver 5 políticas criadas:
     - `Users can view their own characters`
     - `GMs can view all characters`
     - `Users can insert their own characters`
     - `Users can update their own characters`
     - `Users can delete their own characters`

## Opcional: Permitir Múltiplas Fichas por Usuário

Se você quiser permitir que um usuário tenha múltiplas fichas (removendo a restrição de 1 ficha por usuário):

1. **Primeiro, verifique se a constraint existe:**
   ```sql
   SELECT constraint_name 
   FROM information_schema.table_constraints 
   WHERE table_name = 'characters' 
   AND constraint_type = 'UNIQUE';
   ```

2. **Se existir, remova a constraint:**
   ```sql
   ALTER TABLE characters DROP CONSTRAINT IF EXISTS characters_user_id_key;
   ```
   
   **OU** (dependendo do nome da constraint):
   ```sql
   ALTER TABLE characters DROP CONSTRAINT IF EXISTS characters_user_id_unique;
   ```

3. **Reexecute o script de políticas acima**

## Verificação

Após executar o script, teste novamente a aplicação:

1. Tente criar uma nova ficha
2. Tente visualizar suas fichas existentes
3. Se você for GM, verifique se consegue ver todas as fichas

## Troubleshooting

### Se ainda der erro:

1. **Verifique se você está autenticado:**
   - Certifique-se de estar logado na aplicação
   - Verifique se a sessão do Supabase Auth está válida

2. **Verifique se RLS está habilitado:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'characters';
   ```
   - `rowsecurity` deve ser `true`

3. **Verifique as políticas criadas:**
   ```sql
   SELECT policyname, cmd, qual, with_check
   FROM pg_policies
   WHERE tablename = 'characters';
   ```

4. **Teste diretamente no SQL:**
   ```sql
   -- Isso deve retornar suas fichas (se você estiver autenticado)
   SELECT * FROM characters WHERE user_id = auth.uid();
   ```

### Erro: "permission denied for table characters"

Isso significa que as políticas não foram criadas corretamente ou RLS não está habilitado. Execute o script novamente.

### Erro: "duplicate key value violates unique constraint"

Isso significa que você está tentando criar uma segunda ficha, mas a constraint `UNIQUE(user_id)` ainda existe. Remova a constraint conforme instruções acima.

