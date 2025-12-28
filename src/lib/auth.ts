// Sistema de autenticação com Supabase
import { supabase } from '@/lib/supabase';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    is_gm: boolean;
}

// Interface para dados do usuário Discord do Supabase Auth
interface DiscordUser {
    id: string;
    email?: string;
    user_metadata?: {
        full_name?: string;
        avatar_url?: string;
    };
}

export class AuthService {
    // Fazer login com Discord
    static async signInWithDiscord() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${window.location.origin}/dashboard/characters`,
                scopes: 'identify email'
            }
        });

        if (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }

        return data;
    }

    // Fazer logout
    static async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    }

    // Obter usuário atual
    static async getCurrentUser(): Promise<User | null> {
        console.log('AuthService: Getting current user...');
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        // Buscar dados adicionais do usuário na tabela users
        try {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            // Se não encontrou o usuário na tabela, criar registro automaticamente
            if (userError && userError.code === 'PGRST116') {
                console.log('Usuário não encontrado na tabela users, criando registro...');

                // Tentar sincronizar/registrar o usuário
                const syncedUser = await this.syncDiscordUser(user);

                // Buscar novamente após criar
                const { data: newUserData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                return {
                    id: user.id,
                    email: user.email || '',
                    name: newUserData?.name || user.user_metadata?.full_name || user.email || 'Usuário',
                    avatar_url: user.user_metadata?.avatar_url,
                    is_gm: newUserData?.is_gm || false,
                };
            }

            // Se encontrou o usuário, retornar dados da tabela
            return {
                id: user.id,
                email: userData?.email || user.email || '',
                name: userData?.name || user.user_metadata?.full_name || user.email || 'Usuário',
                avatar_url: userData?.avatar_url || user.user_metadata?.avatar_url,
                is_gm: userData?.is_gm || false,
            };
        } catch (error) {
            console.error('Erro ao buscar/sincronizar usuário:', error);
            // Fallback se a tabela users não existir
            return {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.full_name || user.email || 'Usuário',
                avatar_url: user.user_metadata?.avatar_url,
                is_gm: false,
            };
        }
    }

    // Criar/atualizar perfil do usuário
    static async upsertUser(user: User) {
        try {
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    is_gm: user.is_gm,
                });

            if (error) {
                console.error('Erro ao salvar usuário:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro ao salvar usuário (tabela pode não existir):', error);
            // Não falhar se a tabela não existir
        }
    }

    // Sincronizar usuário Discord com tabela users
    static async syncDiscordUser(discordUser: any): Promise<User> {
        // Extrair nome do Discord
        const discordName = discordUser.user_metadata?.full_name ||
            discordUser.user_metadata?.custom_claims?.global_name ||
            discordUser.email?.split('@')[0] ||
            'Usuário Discord';

        const user: User = {
            id: discordUser.id,
            email: discordUser.email || '',
            name: discordName,
            avatar_url: discordUser.user_metadata?.avatar_url || discordUser.user_metadata?.avatar_url,
            is_gm: false, // Padrão para novos usuários
        };

        // Salvar na tabela users
        await this.upsertUser(user);

        return user;
    }

    // Fazer login com email e senha
    static async signInWithEmail(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }

        return data;
    }

    // Verificar se email está confirmado
    static async checkEmailConfirmation(email: string): Promise<{ confirmed: boolean; message: string }> {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) {
            return { confirmed: false, message: error.message };
        }

        return { confirmed: false, message: 'Email de confirmação reenviado' };
    }

    // Escutar mudanças de autenticação
    static onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const user = await this.getCurrentUser();
                callback(user);
            } else {
                callback(null);
            }
        });
    }

    // Verificar se usuário está logado
    static async isAuthenticated(): Promise<boolean> {
        const user = await this.getCurrentUser();
        return user !== null;
    }
}