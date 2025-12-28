# Tabela de Itens - Naruto RPG

## Descrição

Tabela para armazenar todos os itens do jogo, incluindo:
- Bebidas e álcool
- Medicações e curas
- Antídotos
- Poções e bombas
- Loções especiais
- Tintas místicas
- Itens corrosivos
- Ferramentas e kits
- Utilitários

## Configuração

### 1. Criar a Tabela

Execute o SQL no Supabase SQL Editor:

```bash
# Arquivo: database/items-complete.sql
# Ou: database/items-table.sql
```

### 2. Inserir Dados

Execute o script Node.js:

```bash
# Certifique-se de estar na raiz do projeto
node scripts/seed-items.js
```

## Estrutura da Tabela

```sql
CREATE TABLE public.items (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    preco TEXT NOT NULL,
    descricao TEXT,
    tempo_criacao TEXT,
    efeito_colateral TEXT,
    sistema_mecanico TEXT,
    duracao TEXT,
    detalhes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Campos

- **id**: Identificador único do item
- **nome**: Nome do item
- **tipo**: Categoria (Bebida, Medicação, Kit, etc)
- **preco**: Preço em Ryou
- **descricao**: Descrição completa do item
- **tempo_criacao**: Tempo necessário para criar o item
- **efeito_colateral**: Efeitos colaterais do item
- **sistema_mecanico**: Efeitos mecânicos no sistema de jogo
- **duracao**: Duração dos efeitos
- **detalhes**: Detalhes adicionais (ex: conteúdo do kit)

## Tipos de Itens

### Bebidas
- Bebida Alcoólica
- Bebida

### Medicações
- Medicação (Vida)
- Medicação (Mana/Chakra)
- Medicação (Fadiga)
- Medicação (Melhoria Permanente)
- Medicação (Cura Total)

### Antídotos
- Antídoto
- Cura Universal

### Poções e Bombas
- Poção
- Bomba (Sono)
- Bomba (Visão)
- Selamento/Bomba
- Poção (Social)

### Loções
- Loção

### Tintas
- Tinta/Inscrição
- Tinta/Inscrição (Proibida)

### Outros
- Corrosivo/Adesivo
- Corrosivo
- Kit Essencial
- Ferramenta
- Alimentação
- Serviço
- Utilitário
- Vestimenta
- Animal

## Exemplos de Itens Inclusos

1. **Sake da Bravura da Folha** - Bebida que concede coragem
2. **Medicação Revigorante** - Recupera Vida baseada em Vigor
3. **Antídoto Forte** - Anula venenos poderosos
4. **Kit Ninja** - Kit básico para Genins
5. **Loção de Resistência aos Elementos** - +50% resistência

## Troubleshooting

### Erro: "Tabela não encontrada"

Execute o SQL `database/items-table.sql` ou `database/items-complete.sql` no Supabase SQL Editor antes de executar o script de seed.

### Erro ao inserir dados

Verifique se:
1. A tabela existe no banco
2. As variáveis de ambiente estão configuradas
3. Há permissões adequadas (RLS configurado)

## Próximos Passos

1. Criar tabela no Supabase
2. Executar seed de itens
3. Integrar com interface de criação de personagem
4. Criar interface de loja/comércio
5. Adicionar funcionalidade de compra/venda



