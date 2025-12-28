-- Criar tabela de usuários se não existir
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_gm BOOLEAN NOT NULL DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE public.users IS 'Tabela de usuários do sistema';
COMMENT ON COLUMN public.users.id IS 'ID do usuário (igual ao auth.users.id)';
COMMENT ON COLUMN public.users.email IS 'Email do usuário';
COMMENT ON COLUMN public.users.name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.users.is_gm IS 'Indica se o usuário é Game Master';
COMMENT ON COLUMN public.users.avatar_url IS 'URL do avatar do usuário';
COMMENT ON COLUMN public.users.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.users.updated_at IS 'Data da última atualização do registro';
