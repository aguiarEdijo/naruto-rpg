# Tabela de Jutsus

Este documento explica como criar e gerenciar a tabela de jutsus no sistema Naruto RPG.

## 📋 Estrutura da Tabela

A tabela `jutsus` armazena todas as técnicas ninja disponíveis no sistema:

- **id**: ID único (auto-incremento)
- **nome**: Nome do jutsu (único)
- **tipo_jutsu**: Tipo (Ninjutsu, Taijutsu, Genjutsu)
- **subtipo**: Subtipo opcional (ex: Kekkei Genkai, Elemento)
- **rank**: Rank do jutsu (E, D, C, B, A, S)
- **custo_chakra**: Custo de chakra (pode ser número ou descrição)
- **acao**: Tipo de ação necessária (Primária, Secundária, Movimento, Completa, Reação, Sustentável)
- **duracao**: Duração do efeito (Instantânea, Sustentável, Sustentada, etc.)
- **restricao**: Restrições ou pré-requisitos (opcional)
- **descricao**: Descrição detalhada do jutsu
- **created_at**: Data de criação
- **updated_at**: Data da última atualização (atualizado automaticamente por trigger)

## 🚀 Como Criar a Tabela

### Opção 1: Script Completo (Recomendado)

Execute o arquivo `jutsus-complete.sql` no SQL Editor do Supabase:

```sql
-- Este script cria a tabela e insere os dados iniciais
-- Execute o conteúdo completo de jutsus-complete.sql
```

### Opção 2: Scripts Separados

1. Primeiro, crie a tabela:
   ```sql
   -- Execute jutsus-table.sql
   ```

2. Depois, insira os dados:
   ```sql
   -- Execute insert-jutsus.sql
   ```

## ✅ Jutsus Iniciais Incluídos

O script inclui os seguintes jutsus básicos:

1. **Henge no Jutsu (Transformação)** - Rank E, Ninjutsu
2. **Bunshin no Jutsu (Duplicação)** - Rank E, Ninjutsu
3. **Kawarimi no Jutsu (Substituição de Corpo)** - Rank E, Ninjutsu
4. **Shunshin no Jutsu (Movimentação Instantânea)** - Rank D, Ninjutsu
5. **Kai (Liberação)** - Rank D, Genjutsu

## 🔍 Verificação

Após executar o script, verifique se os dados foram inseridos:

```sql
SELECT 
    nome,
    tipo_jutsu,
    rank,
    custo_chakra
FROM jutsus
ORDER BY rank, tipo_jutsu, nome;
```

## 📊 Consultas Úteis

```sql
-- Contar jutsus por tipo
SELECT tipo_jutsu, COUNT(*) as total
FROM jutsus
GROUP BY tipo_jutsu
ORDER BY tipo_jutsu;

-- Contar jutsus por rank
SELECT rank, COUNT(*) as total
FROM jutsus
GROUP BY rank
ORDER BY 
    CASE rank
        WHEN 'E' THEN 1
        WHEN 'D' THEN 2
        WHEN 'C' THEN 3
        WHEN 'B' THEN 4
        WHEN 'A' THEN 5
        WHEN 'S' THEN 6
    END;

-- Buscar jutsus de um tipo específico
SELECT nome, rank, custo_chakra
FROM jutsus
WHERE tipo_jutsu = 'Ninjutsu'
ORDER BY rank, nome;
```

## 🔧 Uso no Código TypeScript

```typescript
import { JutsusService } from '@/lib/api/jutsus';

// Buscar todos os jutsus
const jutsus = await JutsusService.getAllJutsus();

// Buscar por tipo
const ninjutsus = await JutsusService.getJutsusByType('Ninjutsu');

// Buscar por rank
const rankEJutsus = await JutsusService.getJutsusByRank('E');

// Estatísticas
const stats = await JutsusService.getJutsusStatistics();
```

## ⚠️ Notas Importantes

- O campo `custo_chakra` é TEXT porque pode conter descrições complexas (ex: "1 (Criação) ou 4 (Finta) [3]")
- O campo `acao` pode ter valores compostos (ex: "Movimento (Uso) / Reação (Defesa)")
- A tabela usa triggers para atualizar `updated_at` automaticamente
- O nome do jutsu deve ser único (constraint UNIQUE)

## 🎮 Próximos Passos

Após criar a tabela, você pode:
1. Adicionar mais jutsus via interface GM (`/dashboard/gm/jutsus`)
2. Criar componente de visualização de jutsus na página de regras
3. Integrar jutsus no sistema de criação de personagens
4. Criar sistema de aprendizado de jutsus por nível

