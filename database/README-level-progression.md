# Migração da Tabela Level Progression

Este documento explica como executar a migração para criar a tabela `level_progression` no banco de dados Supabase.

## 📋 Pré-requisitos

1. **Variáveis de Ambiente**: Certifique-se de que você tem as seguintes variáveis configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase (com permissões de administrador)

2. **Node.js**: Certifique-se de que o Node.js está instalado

## 🚀 Executando a Migração

### Opção 1: Script Automatizado (Recomendado)

```bash
# Execute o script de migração
node scripts/setup-level-progression.js
```

### Opção 2: Execução Manual via SQL Editor do Supabase

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute o seguinte SQL:

```sql
-- Criar tabela
CREATE TABLE IF NOT EXISTS level_progression (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 20),
    rank TEXT NOT NULL CHECK (rank IN ('Genin', 'Chunnin', 'Jounin', 'Hokage')),
    dice_evolution TEXT NOT NULL,
    attribute_points TEXT NOT NULL,
    skill_points TEXT NOT NULL,
    total_skill_gain INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_level_progression_level ON level_progression(level);
CREATE INDEX IF NOT EXISTS idx_level_progression_rank ON level_progression(rank);
```

4. Em seguida, execute o script de inserção de dados:

```sql
-- Inserir dados
INSERT INTO level_progression (level, rank, dice_evolution, attribute_points, skill_points, total_skill_gain) VALUES
(1, 'Genin', '2d6', '+1', '+1', 1),
(2, 'Genin', '2d6', '—', '+1', 1),
(3, 'Genin', '2d6', '+1', '+1', 1),
(4, 'Genin', '2d6', '—', '+1', 1),
(5, 'Chunnin', '1d8 + 1d6', '+1', '+1 (+2 Bônus)', 3),
(6, 'Chunnin', '1d8 + 1d6', '—', '+1', 1),
(7, 'Chunnin', '1d8 + 1d6', '+1', '+1', 1),
(8, 'Chunnin', '1d8 + 1d6', '—', '+1', 1),
(9, 'Chunnin', '2d8', '+1', '+1', 1),
(10, 'Jounin', '2d8', '—', '+1 (+2 Bônus)', 3),
(11, 'Jounin', '2d8', '+1', '+1', 1),
(12, 'Jounin', '2d8', '—', '+1', 1),
(13, 'Jounin', '1d10 + 1d8', '+1', '+1', 1),
(14, 'Jounin', '1d10 + 1d8', '—', '+1', 1),
(15, 'Hokage', '1d10 + 1d8', '+1', '+1 (+2 Bônus)', 3),
(16, 'Hokage', '1d10 + 1d8', '—', '+1', 1),
(17, 'Hokage', '2d10', '+1', '+1', 1),
(18, 'Hokage', '2d10', '—', '+1', 1),
(19, 'Hokage', '2d10', '+1', '+1', 1),
(20, 'Hokage', '2d10', '—', '+1', 1)
ON CONFLICT (level) DO UPDATE SET
    rank = EXCLUDED.rank,
    dice_evolution = EXCLUDED.dice_evolution,
    attribute_points = EXCLUDED.attribute_points,
    skill_points = EXCLUDED.skill_points,
    total_skill_gain = EXCLUDED.total_skill_gain;
```

## ✅ Verificação

Após executar a migração, você pode verificar se os dados foram inseridos corretamente:

```sql
-- Verificar todos os dados
SELECT * FROM level_progression ORDER BY level;

-- Verificar contagem por patente
SELECT rank, COUNT(*) as total_levels, MIN(level) as min_level, MAX(level) as max_level
FROM level_progression 
GROUP BY rank 
ORDER BY min_level;
```

## 🔧 Estrutura da Tabela

A tabela `level_progression` contém as seguintes colunas:

- `id`: ID único (auto-incremento)
- `level`: Nível do personagem (1-20)
- `rank`: Patente ninja (Genin, Chunnin, Jounin, Hokage)
- `dice_evolution`: Evolução dos dados (ex: "2d6", "1d8 + 1d6")
- `attribute_points`: Pontos de atributo ganhos ("+1" ou "—")
- `skill_points`: Pontos de perícia ganhos ("+1" ou "+1 (+2 Bônus)")
- `total_skill_gain`: Total de pontos de perícia ganhos no nível
- `created_at`: Timestamp de criação

## 🎯 Como Usar no Código

Após a migração, você pode usar a API criada:

```typescript
import { LevelProgressionService } from '@/lib/api/levelProgression';

// Buscar todos os níveis
const levels = await LevelProgressionService.getAllLevels();

// Buscar nível específico
const level5 = await LevelProgressionService.getLevelInfo(5);

// Buscar níveis por patente
const chunninLevels = await LevelProgressionService.getLevelsByRank('Chunnin');
```

## 🚨 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não encontrada"

Certifique-se de que a variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` está configurada. Você pode encontrá-la em:
- Supabase Dashboard → Settings → API → Service Role Key

### Erro: "relation level_progression does not exist"

Execute primeiro o SQL de criação da tabela antes de inserir os dados.

### Erro de permissão

Certifique-se de que está usando a **Service Role Key** e não a **Anon Key** para operações administrativas.


