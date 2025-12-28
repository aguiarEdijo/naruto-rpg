import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, isGM } = await request.json();

        // Validações básicas
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
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
