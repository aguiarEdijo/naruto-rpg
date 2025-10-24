import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, isGM } = await request.json();

        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    is_gm: isGM,
                },
            },
        });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Erro ao criar usuário' },
                { status: 400 }
            );
        }

        // Criar registro na tabela users
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                name,
                is_gm: isGM,
            });

        if (dbError) {
            // Se der erro na tabela users, tentar deletar o usuário criado
            await supabase.auth.admin.deleteUser(authData.user.id);
            return NextResponse.json(
                { error: 'Erro ao criar perfil do usuário' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Conta criada com sucesso' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
