# Migração da Tabela Defects

Este documento explica como executar a migração para criar a tabela `defects` no banco de dados Supabase.

## 📋 Pré-requisitos

1. **Variáveis de Ambiente**: Certifique-se de que você tem as seguintes variáveis configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase (com permissões de administrador)

2. **Node.js**: Certifique-se de que o Node.js está instalado

## 🚀 Executando a Migração

### Opção 1: Script Automatizado (Recomendado)

```bash
# Execute o script de migração
node scripts/setup-defects.js
```

### Opção 2: Execução Manual via SQL Editor do Supabase

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute o seguinte SQL:

```sql
-- Criar tabela
CREATE TABLE IF NOT EXISTS defects (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_defects_tipo ON defects(tipo);
CREATE INDEX IF NOT EXISTS idx_defects_nome ON defects(nome);
```

4. Em seguida, execute o script de inserção de dados:

```sql
-- Inserir dados
INSERT INTO defects (nome, tipo, descricao) VALUES
('REDUÇÃO DE ATRIBUTOS INICIAIS', 'Mecânico', 'Devido à simbiose única do Clã Aburame...'),
('COMPULSIVO ALIMENTAR', 'Compulsão', 'O personagem (comum ao Clã Akimichi)...'),
('PACTO DE SERVIDÃO', 'Emocional/Obrigação', 'Típico da Família Secundária Hyuuga...'),
('ORGULHO EXACERBADO', 'Emocional/Social', 'Comum ao Clã Uchiha...'),
('VULNERABILIDADE EMOCIONAL', 'Emocional', 'Comum ao Clã Inuzuka...'),
('MISSÃO SHINOBI - LEALDADE INABALÁVEL', 'Emocional/Obrigação', 'Comum ao Clã Senju...'),
('COMPULSÃO POR PROCRASTINAR (PREGUIÇA)', 'Compulsão/Mental', 'Comum ao Clã Nara...'),
('SEGREDOS DO SELAMENTO / CAÇADO', 'Obrigação/Emocional', 'Comum ao Clã Uzumaki...'),
('ABERTURA PSÍQUICA (VULNERABILIDADE MENTAL)', 'Mecânico/Mental', 'Comum ao Clã Yamanaka...'),
('HONESTIDADE', 'Social', 'O personagem é incapaz de mentir...'),
('ARROGÂNCIA SOCIAL', 'Social/Emocional', 'O personagem tem dificuldade...'),
('FAMA INDESEJADA', 'Social', 'A aparência, reputação...'),
('IMPULSIVO', 'Comportamental', 'O personagem age antes de pensar...')
ON CONFLICT (nome) DO UPDATE SET
    tipo = EXCLUDED.tipo,
    descricao = EXCLUDED.descricao;
```

## ✅ Verificação

Após executar a migração, você pode verificar se os dados foram inseridos corretamente:

```sql
-- Verificar todos os dados
SELECT * FROM defects ORDER BY tipo, nome;

-- Verificar contagem por tipo
SELECT tipo, COUNT(*) as total_defeitos, 
       STRING_AGG(nome, ', ') as nomes
FROM defects 
GROUP BY tipo 
ORDER BY tipo;
```

## 🔧 Estrutura da Tabela

A tabela `defects` contém as seguintes colunas:

- `id`: ID único (auto-incremento)
- `nome`: Nome do defeito (ex: "REDUÇÃO DE ATRIBUTOS INICIAIS")
- `tipo`: Tipo/categoria do defeito (ex: "Mecânico", "Compulsão", "Emocional")
- `descricao`: Descrição detalhada do defeito e seus efeitos
- `created_at`: Timestamp de criação

## 🎯 Tipos de Defeitos Inseridos

### Mecânico
- **REDUÇÃO DE ATRIBUTOS INICIAIS** - Clã Aburame
- **ABERTURA PSÍQUICA (VULNERABILIDADE MENTAL)** - Clã Yamanaka

### Compulsão
- **COMPULSIVO ALIMENTAR** - Clã Akimichi
- **COMPULSÃO POR PROCRASTINAR (PREGUIÇA)** - Clã Nara

### Emocional
- **VULNERABILIDADE EMOCIONAL** - Clã Inuzuka

### Emocional/Obrigação
- **PACTO DE SERVIDÃO** - Família Secundária Hyuuga
- **MISSÃO SHINOBI - LEALDADE INABALÁVEL** - Clã Senju

### Emocional/Social
- **ORGULHO EXACERBADO** - Clã Uchiha

### Obrigação/Emocional
- **SEGREDOS DO SELAMENTO / CAÇADO** - Clã Uzumaki

### Social
- **HONESTIDADE** - Geral
- **FAMA INDESEJADA** - Geral

### Social/Emocional
- **ARROGÂNCIA SOCIAL** - Geral

### Comportamental
- **IMPULSIVO** - Geral

## 🚨 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não encontrada"

Certifique-se de que a variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` está configurada. Você pode encontrá-la em:
- Supabase Dashboard → Settings → API → Service Role Key

### Erro: "relation defects does not exist"

Execute primeiro o SQL de criação da tabela antes de inserir os dados.

### Erro de permissão

Certifique-se de que está usando a **Service Role Key** e não a **Anon Key** para operações administrativas.


