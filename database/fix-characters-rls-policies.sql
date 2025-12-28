-- ============================================================
-- Script para corrigir políticas RLS da tabela characters
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- 1. Remover constraint UNIQUE(user_id) se existir (para permitir múltiplas fichas)
-- Se você quiser permitir múltiplas fichas por usuário, descomente a linha abaixo:
-- ALTER TABLE characters DROP CONSTRAINT IF EXISTS characters_user_id_key;

-- 2. Remover políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Users can view own characters" ON characters;
DROP POLICY IF EXISTS "Users can view their own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert their own characters" ON characters;
DROP POLICY IF EXISTS "Users can update own characters" ON characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON characters;
DROP POLICY IF EXISTS "GMs can view all characters" ON characters;
DROP POLICY IF EXISTS "GM can view all characters" ON characters;

-- 3. Criar políticas corretas para SELECT (visualização)
-- Usuários podem ver suas próprias fichas
CREATE POLICY "Users can view their own characters"
    ON characters
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- GMs podem ver todas as fichas
CREATE POLICY "GMs can view all characters"
    ON characters
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_gm = true
        )
    );

-- 4. Criar políticas para INSERT (criação)
CREATE POLICY "Users can insert their own characters"
    ON characters
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 5. Criar políticas para UPDATE (atualização)
CREATE POLICY "Users can update their own characters"
    ON characters
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Criar políticas para DELETE (exclusão)
CREATE POLICY "Users can delete their own characters"
    ON characters
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'characters'
ORDER BY policyname;

-- 8. Verificar se RLS está habilitado
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'characters';

