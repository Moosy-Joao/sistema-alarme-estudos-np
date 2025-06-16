# 🔔 Sistema de Alarme de Estudos

Um sistema web moderno para gerenciar cronogramas de estudo com alarmes personalizados e notificações inteligentes.

![Sistema de Alarme de Estudos](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Funcionalidades

### 🎯 **Cronogramas Inteligentes**
- **Cronogramas Padrão**: Segunda a sexta (6h/dia) e terça especial (12h30min)
- **Cronogramas Personalizados**: Crie seus próprios horários para qualquer dia da semana
- **Edição Completa**: Adicione, edite e remova atividades facilmente

### 🔔 **Sistema de Notificações**
- **Notificações do Navegador**: Alertas visuais automáticos
- **Sons Personalizados**: Notificações sonoras opcionais
- **Teste de Alarmes**: Função para testar notificações

### 📱 **Interface Moderna**
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Tema Claro**: Interface limpa e profissional
- **Componentes Shadcn/ui**: Componentes modernos e acessíveis

### ⚙️ **Configurações Avançadas**
- **Persistência Local**: Configurações salvas automaticamente
- **Gerenciamento de Som**: Controle total sobre notificações sonoras
- **Status em Tempo Real**: Visualização do próximo alarme e status do sistema

## 🚀 Instalação e Execução

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (incluído com Node.js)

### 1. Clone o Repositório
\`\`\`bash
git clone https://github.com/seu-usuario/sistema-alarme-estudos.git
cd sistema-alarme-estudos
\`\`\`

### 2. Instale as Dependências
\`\`\`bash
# Limpar cache (se necessário)
npm cache clean --force

# Instalar dependências
npm install
\`\`\`

### 3. Execute o Projeto
\`\`\`bash
# Modo de desenvolvimento
npm run dev

# O sistema estará disponível em: http://localhost:3000
\`\`\`

### 4. Build para Produção (Opcional)
\`\`\`bash
# Gerar build otimizado
npm run build

# Executar versão de produção
npm run start
\`\`\`

## 🛠️ Solução de Problemas

### ❌ **Erro: 'next' não é reconhecido**
\`\`\`bash
# 1. Limpar cache e reinstalar
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# 2. Se ainda não funcionar, instalar Next.js globalmente
npm install -g next

# 3. Ou executar com npx
npx next dev
\`\`\`

### 🔧 **Problemas de Dependências**
\`\`\`bash
# Verificar versões
node --version
npm --version

# Reinstalar dependências
npm install --force

# Verificar se Next.js foi instalado
npx next --version
\`\`\`

### 🌐 **Porta Ocupada**
Se a porta 3000 estiver em uso, o Next.js automaticamente tentará usar a porta 3001, 3002, etc.

## 📋 Como Usar

### 🔔 **Ativando Notificações**
1. Ao abrir o sistema, clique em **"Permitir"** quando solicitado
2. Se bloqueado, clique no ícone de cadeado na barra de endereços
3. Altere "Notificações" para **"Permitir"**
4. Recarregue a página

### 📅 **Usando Cronogramas Padrão**
- **Segunda, Quarta, Quinta, Sexta**: 6h de estudo (08:30-12:30 e 14:30-16:30)
- **Terça-feira**: 12h30min de estudo intensivo
- **Fim de semana**: Sem cronograma (descanso)

### ✏️ **Criando Cronogramas Personalizados**
1. Clique em **"Novo Cronograma"** na tela principal
2. Defina um **nome** para o cronograma
3. Selecione os **dias da semana**
4. Adicione **atividades** com:
   - Horário (formato 24h)
   - Nome da atividade
   - Tipo (Estudo, Pausa, Almoço, Jantar)
   - Duração estimada
5. Clique em **"Salvar Cronograma"**

### ⚙️ **Configurações**
- **Som de Notificação**: Ative/desative sons nos alarmes
- **Teste de Notificação**: Verifique se as notificações estão funcionando
- **Gerenciar Cronogramas**: Edite ou exclua cronogramas personalizados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos

### Funcionalidades
- **Notification API** - Notificações nativas do navegador
- **LocalStorage** - Persistência de dados local
- **Audio API** - Reprodução de sons de notificação

## 📁 Estrutura do Projeto

\`\`\`
sistema-alarme-estudos/
├── app/                    # Páginas Next.js (App Router)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes Shadcn/ui
│   └── theme-provider.tsx # Provider de tema
├── hooks/                # Hooks personalizados
├── lib/                  # Utilitários
├── public/               # Arquivos estáticos
│   └── notification.mp3  # Som de notificação
├── package.json          # Dependências e scripts
├── tailwind.config.ts    # Configuração Tailwind
├── next.config.mjs       # Configuração Next.js
└── README.md            # Este arquivo
\`\`\`

## 🎯 Tipos de Atividades

| Tipo | Ícone | Descrição | Cor |
|------|-------|-----------|-----|
| **Estudo** | 📚 | Sessões de estudo focado | Azul |
| **Pausa** | ☕ | Intervalos de descanso | Verde |
| **Almoço** | 🍽️ | Horário de almoço | Laranja |
| **Jantar** | 🍽️ | Horário de jantar | Laranja |

## 🔧 Scripts Disponíveis

\`\`\`bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (localhost:3000)

# Produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Utilitários
npm run lint         # Executa linting
\`\`\`

## 🌟 Funcionalidades Futuras

- [ ] **Tema Escuro**: Suporte completo para modo escuro
- [ ] **Estatísticas**: Painel com métricas de tempo de estudo
- [ ] **Sincronização**: Backup e sincronização entre dispositivos
- [ ] **Templates**: Cronogramas pré-definidos para diferentes cursos
- [ ] **Exportação**: Importar/exportar cronogramas em JSON
- [ ] **PWA**: Transformar em Progressive Web App
- [ ] **Relatórios**: Gerar relatórios de produtividade

## 🤝 Contribuindo

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

### Problemas Comuns

**❌ Notificações não funcionam**
- Verifique se as notificações estão permitidas no navegador
- Teste em uma aba sem modo privado/incógnito
- Alguns navegadores bloqueiam notificações em localhost

**🔇 Som não toca**
- Verifique se o som está habilitado nas configurações
- Alguns navegadores exigem interação do usuário antes de reproduzir áudio
- Teste clicando em "Testar" nas configurações

**💾 Cronogramas não salvam**
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador se necessário

**⚠️ Erro 'next' não é reconhecido**
- Execute: `npm cache clean --force`
- Remova `node_modules` e `package-lock.json`
- Execute: `npm install`
- Se persistir: `npm install -g next`

### Requisitos do Sistema
- **Node.js**: 18.0.0 ou superior
- **npm**: 8.0.0 ou superior
- **Navegador**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Contato
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/sistema-alarme-estudos/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/sistema-alarme-estudos/discussions)

---

<div align="center">

**✅ Sistema funcionando perfeitamente!**

**Desenvolvido com ❤️ para estudantes que querem organizar melhor seu tempo**

[⭐ Dê uma estrela se este projeto te ajudou!](https://github.com/Moosy-Joao/sistema-alarme-estudos)

</div>
