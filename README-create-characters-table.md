# Como Criar a Tabela Characters no Supabase

## Problema

Erro: `"Could not find the table 'public.characters' in the schema cache"`

Isso significa que a tabela `characters` ainda não foi criada no seu banco de dados Supabase.

## Solução

Execute o script SQL completo para criar a tabela e configurar as permissões.

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para [https://app.supabase.com](https://app.supabase.com)
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New query**

3. **Execute o Script**
   - Abra o arquivo `database/create-characters-table-complete.sql`
   - Copie **TODO** o conteúdo do arquivo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** ou pressione `Ctrl+Enter`

4. **Verifique o Resultado**
   - O script vai mostrar 3 tabelas no final:
     - **Primeira tabela**: Colunas da tabela `characters` (deve mostrar todas as colunas)
     - **Segunda tabela**: Confirmação que RLS está habilitado (`rls_enabled = true`)
     - **Terceira tabela**: Políticas RLS criadas (deve mostrar 5 políticas)

## O que o Script Faz:

✅ Cria a tabela `characters` com todas as colunas necessárias  
✅ Cria índices para melhorar performance  
✅ Habilita RLS (Row Level Security)  
✅ Cria políticas de segurança para:
   - Usuários visualizarem suas próprias fichas
   - GMs visualizarem todas as fichas
   - Usuários criarem/atualizarem/deletarem suas próprias fichas  
✅ Cria trigger para atualizar `updated_at` automaticamente  

## Verificação

Após executar o script, você deve ver:

1. **Tabela criada**: Na aba **Table Editor** do Supabase, você deve ver a tabela `characters`
2. **Políticas ativas**: Execute a query de verificação no final do script
3. **Teste na aplicação**: Tente criar uma ficha novamente

## Troubleshooting

### Erro: "relation already exists"
- A tabela já existe. Execute apenas o script `fix-characters-rls-policies.sql` para corrigir as políticas.

### Erro: "permission denied"
- Certifique-se de estar usando a conta de administrador do Supabase
- Ou execute usando o SQL Editor (que tem permissões administrativas)

### Erro: "function update_updated_at_column already exists"
- Isso é normal se você já executou outros scripts. O script usa `CREATE OR REPLACE`, então vai atualizar a função.

### Tabela criada mas ainda não funciona
1. Verifique se RLS está habilitado:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE tablename = 'characters';
   ```

2. Verifique se as políticas foram criadas:
   ```sql
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'characters';
   ```

3. Se as políticas não existirem, execute o script `fix-characters-rls-policies.sql`

## Próximos Passos

Depois de criar a tabela `characters`, você também pode precisar criar as tabelas relacionadas:

- `custom_skills` (perícias customizadas)
- `jutsus` (técnicas ninja)
- `items` (itens e equipamentos)
- `character_enhancements` (aprimoramentos do personagem)
- `character_defects` (defeitos do personagem)

Mas essas são criadas automaticamente quando você salva uma ficha, então não precisa se preocupar agora.

