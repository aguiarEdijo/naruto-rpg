# Sistema de Autenticação - Naruto RPG

## Configuração

### 1. Criar Tabela de Usuários

Execute o script SQL para criar a tabela `users`:

```sql
-- Arquivo: database/users-table.sql
```

Execute no SQL Editor do Supabase:

```bash
# Copiar e colar o conteúdo de database/users-table.sql no SQL Editor
# Executar o script
```

### 2. Configurar Row Level Security (RLS)

No SQL Editor do Supabase, execute:

```sql
-- Habilitar RLS na tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para usuários podem ler seus próprios dados
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Política para usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Política para inserir novos usuários (via API)
CREATE POLICY "Users can insert own data"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Política para administradores visualizarem todos os dados
CREATE POLICY "Admins can read all data"
ON public.users
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND is_gm = true
    )
);
```

### 3. Configurar Provider OAuth (Discord)

No Painel do Supabase:

1. Vá em **Authentication** > **Providers**
2. Ative **Discord**
3. Configure:
   - Client ID: Obtenha do Discord Developer Portal
   - Client Secret: Obtenha do Discord Developer Portal
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Discord Developer Portal

1. Acesse https://discord.com/developers/applications
2. Crie uma nova aplicação ou use existente
3. Vá em **OAuth2** > **General**
4. Copie o **Client ID** e **Client Secret**
5. Adicione Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 5. Email Confirmation (Opcional)

No Painel do Supabase:

1. Vá em **Authentication** > **Email Templates**
2. Configure os templates de email para confirmação
3. Ou desabilite confirmação de email (para desenvolvimento)

## Funcionalidades

### Login

O sistema suporta dois métodos de login:

1. **Email/Senha**: Login tradicional com email e senha
2. **Discord OAuth**: Login via Discord usando OAuth2

### Registro Automático

Quando um usuário faz login via Discord pela primeira vez, o sistema:

1. Cria registro na tabela `users` automaticamente
2. Extrai informações do Discord (nome, email, avatar)
3. Define `is_gm = false` por padrão

### Formulário de Registro

Usuários podem criar conta manualmente:

1. Acesse `/register`
2. Preencha:
   - Nome
   - Email
   - Senha
   - Confirmar Senha
   - Checkbox "Sou um Game Master" (opcional)
3. A conta será criada no Supabase Auth
4. Um registro será criado na tabela `users`

## Campos da Tabela users

```sql
- id (UUID): ID único do usuário (igual ao auth.users.id)
- email (TEXT): Email do usuário
- name (TEXT): Nome completo do usuário
- is_gm (BOOLEAN): Indica se o usuário é Game Master
- avatar_url (TEXT): URL do avatar do usuário
- created_at (TIMESTAMP): Data de criação
- updated_at (TIMESTAMP): Data de última atualização
```

## Troubleshooting

### Usuário Discord não aparece na tabela users

O sistema cria registro automaticamente na primeira vez que você faz login via Discord. Verifique:

1. Se a tabela `users` existe no Supabase
2. Se as políticas RLS estão configuradas corretamente
3. Se o usuário Discord tem email verificado

### Erro ao fazer login

Verifique:

1. Se o cliente Supabase está configurado corretamente em `src/lib/supabase.ts`
2. Se as variáveis de ambiente estão configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (para backend)

### Email não confirmado

No ambiente de desenvolvimento, você pode desabilitar confirmação de email no Supabase Dashboard.



