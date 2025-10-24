# Naruto RPG

Sistema de RPG baseado no universo de Naruto, desenvolvido com Next.js, TypeScript, Material-UI e Supabase.

## Características

- **Sistema Simples**: Focado em narrativa com números baixos
- **Dados 2d6**: Sistema de rolagem simples e equilibrado
- **Clãs de Konoha**: 8 clãs principais com habilidades especiais
- **Sistema de Técnicas**: Taijutsu, Ninjutsu e Genjutsu
- **Controle de Chakra**: Sistema de recursos e custos
- **Saúde Mental**: Eixo Sabedoria x Paixão para profundidade psicológica

## Tecnologias

- **Frontend**: Next.js 16, TypeScript, Material-UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Autenticação**: NextAuth.js
- **Deploy**: Vercel

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie o arquivo `env.example` para `.env.local`
4. Preencha as variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
SUPABASE_CLIENT_ID=seu_client_id
SUPABASE_CLIENT_SECRET=seu_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_nextauth
```

### 3. Configurar Banco de Dados

Execute os seguintes comandos SQL no Supabase:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_gm BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de personagens
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  clan TEXT NOT NULL,
  age INTEGER NOT NULL,
  rank TEXT NOT NULL,
  attributes JSONB NOT NULL,
  resources JSONB NOT NULL,
  auxiliary JSONB NOT NULL,
  natural_skills JSONB NOT NULL,
  trained_skills JSONB NOT NULL,
  techniques JSONB DEFAULT '[]',
  is_editable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clãs
CREATE TABLE clans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  modifiers JSONB NOT NULL,
  special_ability TEXT NOT NULL
);

-- Inserir clãs de Konoha
INSERT INTO clans (id, name, description, modifiers, special_ability) VALUES
('uchiha', 'Uchiha', 'Clã conhecido pelo Sharingan e técnicas de fogo', '{"intelligence": 1, "essence": 1}', 'Sharingan - Visão aprimorada e cópia de técnicas'),
('hyuga', 'Hyuga', 'Clã com Byakugan e técnicas de pontos de pressão', '{"perception": 1, "agility": 1}', 'Byakugan - Visão de 360° e visão de chakra'),
('nara', 'Nara', 'Clã especialista em técnicas de sombra', '{"intelligence": 1, "perception": 1}', 'Técnicas de Sombra - Controle através de sombras'),
('akimichi', 'Akimichi', 'Clã com técnicas de expansão corporal', '{"strength": 1, "vigor": 1}', 'Expansão Corporal - Aumento de tamanho e força'),
('uzumaki', 'Uzumaki', 'Clã com chakra abundante e técnicas de selamento', '{"essence": 1, "vigor": 1}', 'Chakra Abundante - Reservas maiores de chakra'),
('yamanaka', 'Yamanaka', 'Clã especialista em técnicas mentais', '{"intelligence": 1, "perception": 1}', 'Técnicas Mentais - Controle de mente e comunicação'),
('aburame', 'Aburame', 'Clã que usa insetos como armas', '{"vigor": 1, "perception": 1}', 'Controle de Insetos - Manipulação de insetos'),
('inuzuka', 'Inuzuka', 'Clã que trabalha com ninjas animais', '{"agility": 1, "strength": 1}', 'Ninja Animal - Parceria com animais de combate');

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Characters are viewable by owner" ON characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Characters are editable by owner" ON characters
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "GMs can view all characters" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_gm = true
    )
  );
```

### 4. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Sistema de Jogo

### Atributos Base (Humanos)
- **Força**: 2
- **Agilidade**: 2
- **Vigor**: 2
- **Inteligência**: 2
- **Essência**: 2
- **Percepção**: 2

### Perícias
- **Naturais**: Base = 2 atributos (ex: Atletismo = FOR + AGI)
- **Treinadas**: Base = 2 atributos (ex: Taijutsu = FOR + VIG)

### Sistema de Dados
- **2d6** para todas as rolagens
- **Dificuldades**: Fácil (6), Médio (8), Difícil (10), Muito Difícil (12)
- **Sucesso Crítico**: 12 nos dados
- **Falha Crítica**: 2 nos dados

### Recursos
- **Vida**: VIG × 3 + FOR
- **Chakra**: ESS × 4 + INT
- **Fadiga**: VIG × 2 + FOR (desgaste físico)
- **Stress**: INT × 2 + PER (desgaste mental)

### Recursos Auxiliares
- **Sabedoria**: Controle emocional (0-6)
- **Paixão**: Intensidade emocional (0-6)

## Funcionalidades

- ✅ Sistema de autenticação
- ✅ Planilha de personagem
- ✅ Sistema de rolagem de dados
- ✅ Página de regras
- ✅ Sistema de clãs
- ✅ Cálculo automático de perícias e recursos
- 🔄 Sistema de técnicas (em desenvolvimento)
- 🔄 Painel GM (em desenvolvimento)
- 🔄 Sistema de aprendizado de técnicas (em desenvolvimento)

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.