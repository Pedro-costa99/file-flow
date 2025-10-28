# FileFlow

Conversor de arquivos inspirado em SaaS como Convertio. A aplicação entrega uma experiência front-end completa — landing page, fluxo de conversão, catálogo de planos e dashboard — e simula camadas de autenticação e fila de processamento enquanto o backend real é implementado.

## ⚙️ Stack principal

- **Framework:** React 19 + TypeScript
- **Bundler/Dev Server:** Vite 7
- **Roteamento:** TanStack Router
- **Data Fetching & Cache:** TanStack Query
- **Formulários & Validação:** React Hook Form + Zod
- **Estilização:** Tailwind CSS 3 (customizado) + fontes Plus Jakarta Sans
- **Gerais:** Axios, ESLint (config custom), React Query/Router Devtools, Vercel (deploy alvo)

## ✨ Funcionalidades atuais

- **Landing page responsiva** com hero, highlights e chamada para ação.
- **Simulador de conversão:** upload, seleção de formato, validação por plano, feedback de progresso e download do arquivo convertido (mockado via Blob).
- **Catálogo de planos** com comparação Light/Basic/Unlimited e toggler mensal/anual.
- **Dashboard mockado:** exibe plano atual, estatísticas, histórico das últimas conversões e ações de upgrade.
- **Autenticação simulada:** escolha de plano para login rápido, avatars e troca dinâmica de limites.
- **Design consistente:** tema dark elegante, gradientes, tipografia personalizada e estados interativos.

## 📁 Estrutura

```
src/
 ├─ components/        # UI reutilizável (botões, navegação, etc.)
 ├─ context/           # Providers & stores (auth, conversions)
 ├─ hooks/             # Hooks custom (useAuth, useConversions)
 ├─ data/              # Catálogos de planos, formatos suportados
 ├─ pages/             # Landing, Convert, Plans, Login, Dashboard
 ├─ layouts/           # AppLayout com topo/rodapé
 ├─ utils/             # Helpers de formatação, mimetypes, etc.
 └─ router.tsx         # Configuração do TanStack Router
```

## 🚀 Como rodar localmente

1. **Pré-requisitos:** Node.js ≥ 20.19 (ou ≥ 22.12), npm 10+.
2. **Instalar dependências**
   ```bash
   npm install
   ```
3. **Rodar em modo desenvolvimento**
   ```bash
   npm run dev
   ```
   O Vite abrirá em `http://localhost:5173`.
4. **Build de produção**
   ```bash
   npm run build
   ```
   A saída final fica em `dist/`.

> 💡 Se for publicar no Vercel, mantenha os defaults: `npm run build` como build command e `dist` como output. Configure também a `NODE_VERSION` (20.19.0 recomendada) nas variáveis de ambiente do projeto.

## 📜 Scripts úteis

| Comando          | Descrição                                   |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Dev server com HMR                          |
| `npm run build`  | Gera bundle de produção                     |
| `npm run preview`| Serve o build localmente para conferência   |
| `npm run lint`   | Executa ESLint conforme config do projeto   |

## ✅ Decisões & princípios

- **Separação de responsabilidades:** contextos, providers e hooks vivem em módulos distintos para manter o Fast Refresh funcional e facilitar testes.
- **Mock first:** enquanto o backend (Supabase + Edge Functions) não chega, simulações reproduzem o comportamento esperado: limites por plano, fila de conversão e histórico.
- **TanStack Router + Query:** garantem navegação declarativa e pronta para evoluir com loaders, actions e prefetch quando o backend estiver ativo.
- **Formulários resilientes:** React Hook Form + Zod entregam validação tipada, mensagens amigáveis e controle fino sobre estados do upload.
- **Tailwind customizado:** inclui Gradients/cores do tema e utilidades específicas (`shadow-neon`, `text-balance`, etc.).

## 🔜 Pendências & roadmap

1. **Autenticação real:** integrar Google OAuth (Supabase Auth ou Firebase) e emitir JWT próprio com o plano associado.
2. **Backend de conversão:** conectar a API (CloudConvert/LibreConvert ou serviço próprio) e mover o processamento para o servidor, incluindo upload seguro com streaming.
3. **Persistência:** salvar usuários e histórico no Supabase (tabelas `users`, `conversions`) e respeitar limites por período.
4. **Gestão de planos real:** permitir upgrade/downgrade via backend, incluindo billing simulations ou integração com gateway futuro.
5. **Plano gratuito público:** limitar formatos e size diretamente na API para visitas anônimas.
6. **Observabilidade:** adicionar logging, analytics (PostHog, Amplitude) e monitoramento de erros (Sentry) para a versão SaaS.
7. **Testes automatizados:** cobertura unitária (Vitest/testing-library), integração de e2e (Playwright) e snapshots visuais.
8. **Aprimorar acessibilidade:** revisar contraste, foco visível, ARIA nos componentes interativos e suporte a teclado completo.
9. **Internationalization:** preparar para alternar entre pt-BR e en-US.
10. **CI/CD:** configurar pipeline (GitHub Actions) para lint/test/build antes do deploy.

## 🤝 Contribuindo

- Abra issues para bugs, sugestões ou melhorias.
- Use PRs contendo descrição clara, testes (quando aplicável) e seção de “Screenshots” para mudanças visuais.

## 📄 Licença

Projeto educacional; escolha a licença que preferir antes de torná-lo público. Se optar por MIT, crie um arquivo `LICENSE` apropriado.
