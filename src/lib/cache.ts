// Cache simples para evitar múltiplas requisições
class SimpleCache {
    private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
    private readonly TTL = 5 * 60 * 1000; // 5 minutos
    private readonly GM_TTL = 30 * 1000; // 30 segundos para páginas GM (dados mais dinâmicos)

    get<T>(key: string, bypassCache = false): T | null {
        if (bypassCache) {
            this.cache.delete(key);
            return null;
        }

        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        // Para páginas GM, usar TTL menor
        const ttl = key.includes('gm_') ? this.GM_TTL : this.TTL;

        if (now - cached.timestamp > ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data as T;
    }

    set(key: string, data: unknown): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear(): void {
        this.cache.clear();
    }

    // Invalidar uma chave específica
    invalidate(key: string): void {
        this.cache.delete(key);
    }

    // Invalidar todas as chaves que começam com um prefixo
    invalidatePrefix(prefix: string): void {
        const keysToDelete: string[] = [];
        this.cache.forEach((_, key) => {
            if (key.startsWith(prefix)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }
}

export const simpleCache = new SimpleCache();


