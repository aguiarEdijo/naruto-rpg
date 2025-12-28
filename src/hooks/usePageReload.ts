import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook para recarregar dados quando:
 * - A página ganha foco (volta da aba ou janela)
 * - A rota muda
 * - O componente é montado
 * 
 * @param reloadCallback Função para recarregar os dados
 * @param dependencies Dependências adicionais que devem trigar reload
 * @param options Opções de configuração
 */
export function usePageReload(
    reloadCallback: () => void | Promise<void>,
    dependencies: any[] = [],
    options: {
        reloadOnFocus?: boolean;
        reloadOnVisibilityChange?: boolean;
        debounceMs?: number;
        shouldPause?: () => boolean; // Função para verificar se deve pausar o reload
    } = {}
) {
    const {
        reloadOnFocus = true,
        reloadOnVisibilityChange = true,
        debounceMs = 100,
        shouldPause = () => false
    } = options;

    const pathname = usePathname();
    const previousPathname = useRef(pathname);
    const isInitialMount = useRef(true);
    const lastReloadTime = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Função debounced para evitar múltiplos reloads rápidos
    const debouncedReload = useCallback(() => {
        // Verificar se deve pausar o reload (ex: modal aberto, submit em andamento)
        if (shouldPause()) {
            return;
        }

        const now = Date.now();
        
        // Se já recarregou recentemente, aguardar
        if (now - lastReloadTime.current < debounceMs) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                // Verificar novamente antes de executar
                if (!shouldPause()) {
                    lastReloadTime.current = Date.now();
                    reloadCallback();
                }
            }, debounceMs - (now - lastReloadTime.current));
            return;
        }

        lastReloadTime.current = now;
        reloadCallback();
    }, [reloadCallback, debounceMs, shouldPause]);

    // Primeira montagem e mudança de rota
    useEffect(() => {
        // Não recarregar se estiver pausado
        if (shouldPause()) {
            return;
        }

        // Primeira montagem
        if (isInitialMount.current) {
            isInitialMount.current = false;
            reloadCallback();
            return;
        }

        // Detecta mudança de rota
        if (previousPathname.current !== pathname) {
            previousPathname.current = pathname;
            reloadCallback();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, ...dependencies]);

    // Recarregar quando a janela ganha foco (usuário volta para a aba)
    useEffect(() => {
        if (!reloadOnFocus && !reloadOnVisibilityChange) {
            return;
        }

        const handleFocus = () => {
            if (reloadOnFocus && !shouldPause()) {
                debouncedReload();
            }
        };

        const handleVisibilityChange = () => {
            if (reloadOnVisibilityChange && !document.hidden && !shouldPause()) {
                debouncedReload();
            }
        };

        if (reloadOnFocus) {
            window.addEventListener('focus', handleFocus);
        }
        if (reloadOnVisibilityChange) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }

        return () => {
            if (reloadOnFocus) {
                window.removeEventListener('focus', handleFocus);
            }
            if (reloadOnVisibilityChange) {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [reloadOnFocus, reloadOnVisibilityChange, debouncedReload, shouldPause]);
}

