# Migração da Tabela Attributes

Este documento explica como executar a migração para criar a tabela `attributes` no banco de dados Supabase.

## 📋 Pré-requisitos

1. **Variáveis de Ambiente**: Certifique-se de que você tem as seguintes variáveis configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase (com permissões de administrador)

2. **Node.js**: Certifique-se de que o Node.js está instalado

## 🚀 Executando a Migração

### Opção 1: Script Automatizado (Recomendado)

```bash
# Execute o script de migração
node scripts/setup-attributes.js
```

### Opção 2: Execução Manual via SQL Editor do Supabase

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute o seguinte SQL:

```sql
-- Criar tabela
CREATE TABLE IF NOT EXISTS attributes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    abreviacao TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL CHECK (categoria IN ('Físico', 'Mental/Chakra', 'Social')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_attributes_categoria ON attributes(categoria);
CREATE INDEX IF NOT EXISTS idx_attributes_abreviacao ON attributes(abreviacao);
```

4. Em seguida, execute o script de inserção de dados:

```sql
-- Inserir dados
INSERT INTO attributes (nome, abreviacao, categoria, descricao) VALUES
('FORÇA', 'FOR', 'Físico', 'Representa a capacidade de levantamento, músculos e poder destrutivo físico...'),
('VIGOR', 'VIG', 'Físico', 'Mede a saúde, resistência à dor, ao cansaço e a vitalidade...'),
('AGILIDADE', 'AGI', 'Físico', 'Governa a destreza manual, a velocidade, o equilíbrio e a coordenação motora...'),
('INTELIGÊNCIA', 'INT', 'Mental/Chakra', 'Reflete o raciocínio lógico, a memória e a capacidade estratégica...'),
('PERCEPÇÃO', 'PER', 'Mental/Chakra', 'Mede os sentidos aguçados e a consciência situacional...'),
('ESSÊNCIA', 'ESS', 'Mental/Chakra', 'Mede a força da alma, a energia espiritual e o fluxo de chakra...'),
('INFLUÊNCIA', 'INF', 'Social', 'Governa a capacidade de comunicação social, carisma, liderança...')
ON CONFLICT (nome) DO UPDATE SET
    abreviacao = EXCLUDED.abreviacao,
    categoria = EXCLUDED.categoria,
    descricao = EXCLUDED.descricao;
```

## ✅ Verificação

Após executar a migração, você pode verificar se os dados foram inseridos corretamente:

```sql
-- Verificar todos os dados
SELECT * FROM attributes ORDER BY categoria, nome;

-- Verificar contagem por categoria
SELECT categoria, COUNT(*) as total_atributos, 
       STRING_AGG(abreviacao, ', ') as abreviacoes
FROM attributes 
GROUP BY categoria 
ORDER BY categoria;
```

## 🔧 Estrutura da Tabela

A tabela `attributes` contém as seguintes colunas:

- `id`: ID único (auto-incremento)
- `nome`: Nome completo do atributo (ex: "FORÇA", "VIGOR")
- `abreviacao`: Abreviação do atributo (ex: "FOR", "VIG")
- `categoria`: Categoria do atributo ("Físico", "Mental/Chakra", "Social")
- `descricao`: Descrição detalhada do atributo e seu uso
- `created_at`: Timestamp de criação

## 🎯 Como Usar no Código

Após a migração, você pode usar a API criada:

```typescript
import { AttributesService } from '@/lib/api/attributes';

// Buscar todos os atributos
const attributes = await AttributesService.getAllAttributes();

// Buscar atributos por categoria
const physicalAttributes = await AttributesService.getAttributesByCategory('Físico');

// Buscar atributo específico
const strength = await AttributesService.getAttributeByAbbreviation('FOR');

// Buscar categorias
const categories = await AttributesService.getCategories();

// Buscar estatísticas
const stats = await AttributesService.getAttributesStatistics();
```

## 📊 Dados Inseridos

A migração insere os seguintes atributos:

### Físico
- **FOR** - FORÇA
- **VIG** - VIGOR  
- **AGI** - AGILIDADE

### Mental/Chakra
- **INT** - INTELIGÊNCIA
- **PER** - PERCEPÇÃO
- **ESS** - ESSÊNCIA

### Social
- **INF** - INFLUÊNCIA

## 🚨 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não encontrada"

Certifique-se de que a variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` está configurada. Você pode encontrá-la em:
- Supabase Dashboard → Settings → API → Service Role Key

### Erro: "relation attributes does not exist"

Execute primeiro o SQL de criação da tabela antes de inserir os dados.

### Erro de permissão

Certifique-se de que está usando a **Service Role Key** e não a **Anon Key** para operações administrativas.


