import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Criar cliente Supabase para o servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
}

const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (error) {
            console.error('❌ Erro ao parsear JSON:', error);
            return NextResponse.json(
                { error: 'Dados inválidos. Verifique o formato da requisição.' },
                { status: 400 }
            );
        }

        const { name, email, password, isGM } = body;

        console.log('📝 Dados recebidos:', { name, email, isGM, passwordLength: password?.length });

        // Validações básicas
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Nome é obrigatório' },
                { status: 400 }
            );
        }

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Senha é obrigatória' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'A senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
            );
        }

        console.log('📝 Tentando criar usuário:', { email, name, isGM });

        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    is_gm: isGM,
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/characters`,
            },
        });

        if (authError) {
            console.error('❌ Erro ao criar usuário no Auth:', authError);
            return NextResponse.json(
                { error: authError.message || 'Erro ao criar conta. Verifique se o email já está cadastrado.' },
                { status: 400 }
            );
        }

        if (!authData.user) {
            console.error('❌ Usuário não foi criado');
            return NextResponse.json(
                { error: 'Erro ao criar usuário. Tente novamente.' },
                { status: 400 }
            );
        }

        console.log('✅ Usuário criado no Auth:', authData.user.id);

        // Criar registro na tabela users
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                name,
                is_gm: isGM || false,
            });

        if (dbError) {
            console.error('❌ Erro ao criar perfil na tabela users:', dbError);
            
            // Se o erro for de duplicação, o usuário já existe
            if (dbError.code === '23505') {
                return NextResponse.json(
                    { error: 'Este email já está cadastrado' },
                    { status: 400 }
                );
            }

            // Não podemos deletar o usuário sem service role key
            // Mas podemos retornar um erro mais específico
            return NextResponse.json(
                { 
                    error: dbError.message || 'Erro ao criar perfil do usuário',
                    details: 'Usuário criado no sistema de autenticação, mas houve erro ao criar perfil. Entre em contato com o suporte.'
                },
                { status: 400 }
            );
        }

        console.log('✅ Perfil criado na tabela users');

        // Verificar se o email precisa ser confirmado
        const needsEmailConfirmation = authData.user && !authData.session;

        return NextResponse.json(
            { 
                message: needsEmailConfirmation 
                    ? 'Conta criada com sucesso! Verifique seu email para confirmar a conta antes de fazer login.'
                    : 'Conta criada com sucesso! Você já pode fazer login.',
                needsConfirmation: needsEmailConfirmation
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('❌ Erro inesperado no registro:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno do servidor. Tente novamente.' },
            { status: 500 }
        );
    }
}
