# Deploy no EasyPanel - Chef Amelie Quiz

## Alterações Feitas

### 1. Corrigido `.dockerignore`
- Removida a linha `dist` que estava impedindo o build correto

### 2. Otimizado `Dockerfile`
- Mudado `--only=production` para `--omit=dev` (sintaxe mais recente do npm)
- Adicionada cópia da pasta `attached_assets`
- Adicionada variável `PORT=5000`
- Mudado comando de inicialização de `npm start` para `node dist/index.js` (mais eficiente)

### 3. Corrigido `vite.config.ts`
- **CRÍTICO**: Substituído `import.meta.dirname` por `__dirname` usando `fileURLToPath`
- O `import.meta.dirname` só funciona no Node.js v20.11+ e causava erro `ErrorCaptureStackTrace`
- Agora compatível com versões mais antigas do Node.js 20

## Variáveis de Ambiente Necessárias

Configure estas variáveis no EasyPanel:

```env
NODE_ENV=production
PORT=5000
```

**Nota:**
- A aplicação usa `MemStorage` (armazenamento em memória), então **NÃO PRECISA** de banco de dados
- Os dados são armazenados em memória e serão resetados a cada restart do container
- Se você estiver usando outras variáveis de ambiente (como chaves de API, secrets, etc), adicione-as também no painel do EasyPanel

## Passos para Deploy

### 1. Commit e Push das Alterações

```bash
cd /Users/ramiro-dev/Desktop/amelie-repo/chef-amelie-quiz-banhato
git add .dockerignore Dockerfile
git commit -m "Fix Docker config for EasyPanel deployment"
git push
```

### 2. No EasyPanel

1. Acesse seu projeto no EasyPanel
2. Vá em **Settings** → **Build**
3. Certifique-se que:
   - **Build Method**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Context**: `.`
4. Vá em **Settings** → **Environment**
5. Adicione as variáveis de ambiente necessárias
6. Clique em **Deploy** para fazer um novo deploy

### 3. Verificar Logs

Após o deploy, verifique os logs no EasyPanel para garantir que:
- O build foi concluído com sucesso
- O servidor está rodando na porta 5000
- Não há erros de conexão com banco de dados

## URL da Aplicação

Sua aplicação estará disponível em:
https://amelie-app-recettes.9k998j.easypanel.host/

## Problemas Comuns

### Build falha com erro de módulos
- Verifique se todas as dependências estão no `package.json`
- Certifique-se que `package-lock.json` está atualizado

### Aplicação não inicia
- Verifique os logs no EasyPanel
- Confirme que `NODE_ENV=production` está configurada
- Verifique se a porta 5000 está exposta corretamente

### Assets/imagens não carregam
- Verifique se as pastas `public` e `attached_assets` estão sendo copiadas corretamente
- Confirme que os caminhos no código estão corretos

## Teste Local com Docker

Para testar o Dockerfile localmente antes do deploy:

```bash
# Build da imagem
docker build -t amelie-app .

# Executar container
docker run -p 5000:5000 -e NODE_ENV=production amelie-app

# Acessar em http://localhost:5000
```

## Suporte

Se continuar com problemas:
1. Verifique os logs completos no EasyPanel
2. Teste o build localmente com Docker
3. Confirme que todas as variáveis de ambiente estão configuradas
