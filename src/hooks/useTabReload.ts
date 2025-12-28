import { useEffect, useRef } from 'react';

/**
 * Hook para recarregar dados quando uma aba/tab é trocada
 * Útil para componentes dentro de sistemas de tabs
 * 
 * @param reloadCallback Função para recarregar os dados
 * @param activeTab O ID da aba ativa (mudanças neste valor trigam reload)
 */
export function useTabReload(
    reloadCallback: () => void | Promise<void>,
    activeTab: string
) {
    const previousTab = useRef<string | null>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Primeira montagem
        if (isInitialMount.current) {
            isInitialMount.current = false;
            previousTab.current = activeTab;
            reloadCallback();
            return;
        }

        // Detecta mudança de aba
        if (previousTab.current !== activeTab && previousTab.current !== null) {
            previousTab.current = activeTab;
            reloadCallback();
        }
    }, [activeTab, reloadCallback]);
}

