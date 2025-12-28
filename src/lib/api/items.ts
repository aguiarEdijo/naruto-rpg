import { supabase } from '../supabase';

export interface Item {
    id: number;
    nome: string;
    tipo: string;
    preco: string;
    descricao: string | null;
    tempo_criacao: string | null;
    efeito_colateral: string | null;
    sistema_mecanico: string | null;
    duracao: string | null;
    detalhes: string | null;
    created_at: string;
    updated_at: string;
}

export class ItemsService {
    // Obter todos os itens
    static async getAllItems(): Promise<Item[]> {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            console.error('Error fetching items:', error);
            throw error;
        }

        return data || [];
    }

    // Obter itens por tipo
    static async getItemsByType(tipo: string): Promise<Item[]> {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('tipo', tipo)
            .order('nome', { ascending: true });

        if (error) {
            console.error('Error fetching items by type:', error);
            throw error;
        }

        return data || [];
    }

    // Obter tipos distintos de itens
    static async getItemTypes(): Promise<string[]> {
        const { data, error } = await supabase
            .from('items')
            .select('tipo')
            .order('tipo', { ascending: true });

        if (error) {
            console.error('Error fetching item types:', error);
            throw error;
        }

        const types = new Set<string>();
        data?.forEach(item => types.add(item.tipo));
        return Array.from(types);
    }

    // Buscar item por nome
    static async searchItems(query: string): Promise<Item[]> {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .ilike('nome', `%${query}%`)
            .order('nome', { ascending: true });

        if (error) {
            console.error('Error searching items:', error);
            throw error;
        }

        return data || [];
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria um novo item
     */
    static async createItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
        try {
            const { data, error } = await supabase
                .from('items')
                .insert(item)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar item:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no ItemsService.createItem:', error);
            throw error;
        }
    }

    /**
     * Atualiza um item existente
     */
    static async updateItem(id: number, updates: Partial<Omit<Item, 'id' | 'created_at' | 'updated_at'>>): Promise<Item> {
        try {
            const { data, error } = await supabase
                .from('items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar item:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no ItemsService.updateItem:', error);
            throw error;
        }
    }

    /**
     * Deleta um item
     */
    static async deleteItem(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar item:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no ItemsService.deleteItem:', error);
            throw error;
        }
    }
}



