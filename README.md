# ShoeStock - Sistema de Gerenciamento de Calçados

Sistema moderno para gerenciamento de estoque de calçados com interface responsiva, desenvolvido com Node.js, PostgreSQL, Docker e interface moderna com Tailwind CSS.

## 🚀 Início Rápido com Docker

```bash
# Clonar o repositório
git clone [seu-repositorio]
cd projeto_frontend

# Iniciar os containers
docker-compose up -d

# O sistema estará disponível em:
# Frontend: http://localhost:3001
# Banco de dados: localhost:5432
```

## 📋 Categorias de Produtos

O sistema suporta as seguintes categorias de calçados:
- Masculino
- Feminino
- Infantil Masculino
- Infantil Feminino
- Baby Masculino
- Baby Feminino

## 🛠️ Tecnologias

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - Prisma ORM
  - Docker

- **Frontend:**
  - HTML5/CSS3
  - JavaScript Moderno (ES6+)
  - Tailwind CSS
  - Feather Icons

## 📁 Estrutura do Projeto

```
projeto_frontend/
├── public/              # Arquivos estáticos e frontend
│   ├── css/            # Estilos
│   ├── js/             # JavaScript
│   └── index.html      # Página principal
├── server/             # Backend
│   ├── routes/         # Rotas da API
│   └── init.sql        # Inicialização do banco
├── prisma/             # Configurações do Prisma
├── docker-compose.yml  # Configuração Docker
└── Dockerfile         # Build da aplicação
```

## 🔧 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres?schema=public
PORT=3001
NODE_ENV=development
HOST=0.0.0.0
```

## 📋 Tasks e Melhorias Planejadas

### Prioridade Alta
- [x] Implementar validação de categorias
- [x] Corrigir erro 500 no cadastro
- [ ] Implementar sistema de autenticação
- [ ] Adicionar paginação na listagem
- [ ] Implementar filtros avançados

### Prioridade Média
- [ ] Adicionar gráficos de estatísticas
- [ ] Implementar exportação de dados
- [ ] Melhorar feedback visual
- [ ] Sistema de notificações

### Prioridade Baixa
- [ ] Adicionar testes unitários
- [ ] Melhorar documentação
- [ ] Implementar PWA
- [ ] Otimizar imagens
- [ ] Mais temas visuais

## 🔒 Segurança

- CORS configurado para localhost:3001
- Validações no frontend e backend
- Restrições de tipos no banco de dados
- Sanitização de inputs

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
