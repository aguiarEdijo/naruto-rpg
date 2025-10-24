// Configuração do NextAuth

import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions = {
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    providers: [
        {
            id: 'supabase',
            name: 'Supabase',
            type: 'oauth',
            authorization: {
                url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize`,
                params: {
                    provider: 'google',
                },
            },
            token: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token`,
            userinfo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
            clientId: process.env.SUPABASE_CLIENT_ID,
            clientSecret: process.env.SUPABASE_CLIENT_SECRET,
        },
    ],
    callbacks: {
        async session({ session, user }: any) {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        signUp: '/register',
    },
};

export const { auth, signIn, signOut } = NextAuth(authOptions);
