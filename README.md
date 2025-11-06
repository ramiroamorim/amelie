# Chef Amélie Dupont - Quiz Gourmand

Plataforma interativa de quiz que revela o perfil gourmand dos usuários e apresenta a coleção exclusiva de 500 receitas da Chef Amélie Dupont.

## 🚀 Deploy para GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages.

### Passos para Deploy:

1. **Commit e push para GitHub:**
   ```bash
   git add .
   git commit -m "Deploy da plataforma Chef Amélie"
   git push origin main
   ```

2. **Configure GitHub Pages:**
   - Acesse Settings > Pages no repositório GitHub
   - Em "Source", selecione "GitHub Actions"
   - O workflow executará automaticamente

3. **Aplicação online:**
   - Disponível em: `https://[usuario].github.io/[repositorio]/`

## ✨ Características

- Quiz interativo com 6 etapas personalizadas
- Player de áudio com reprodução automática na página /merci
- Rastreamento UTM integrado com Utmify
- Facebook Pixel configurado (ID: 644431871463181)
- Links Hotmart para produtos e upsells
- Design responsivo mobile-first

## 🛠️ Tecnologias

- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Radix UI + shadcn/ui
- TanStack Query

## 📱 Estrutura

```
├── client/               # Frontend React
├── .github/workflows/    # GitHub Actions
├── dist/                 # Build produção
└── public/               # Assets estáticos
```

## 🔧 Desenvolvimento Local

```bash
npm install
npm run dev
npm run build
```

## 📊 Integrações

- **Facebook Pixel**: Eventos de conversão configurados
- **Utmify**: Script carregado em todas as páginas
- **Hotmart**: Links de afiliação configurados
- **Audio Player**: Reprodução automática e controles customizados# amelie
