# Correções Aplicadas para Deploy no Railway

## Problema Identificado
O erro `Cannot find package 'vite'` ocorria porque o Vite estava sendo importado estaticamente no código do servidor, mas estava apenas nas `devDependencies`. Em produção, essas dependências não estão disponíveis.

## Correções Aplicadas

### 1. Modificação do `server/vite.ts`
- **Antes**: Imports estáticos do Vite e nanoid no topo do arquivo
- **Depois**: Imports dinâmicos apenas dentro da função `setupVite()`

```typescript
// ANTES (problemático)
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";

// DEPOIS (correto)
export async function setupVite(app: Express, server: Server) {
  try {
    // Import dinâmico apenas em desenvolvimento
    const { createServer: createViteServer, createLogger } = await import("vite");
    const { nanoid } = await import("nanoid");
    // ...resto do código
  } catch (error) {
    // Falha graciosamente em produção
    log("Vite not available, skipping development setup");
    throw new Error("Vite setup failed - this should only be called in development");
  }
}
```

### 2. Modificação do `package.json`
- **Comando de build atualizado** para excluir o Vite do bundle do servidor:

```json
// ANTES
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"

// DEPOIS  
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --external:vite --external:nanoid --external:../vite.config.js --bundle --format=esm --outdir=dist"
```

## Como Funciona Agora

### Em Desenvolvimento
- O Vite é carregado dinamicamente para servir o frontend
- Funciona normalmente com hot reload

### Em Produção
- O código tenta carregar o Vite dinamicamente
- Como o Vite não está disponível, a função falha graciosamente
- O servidor usa `serveStatic()` para servir os arquivos já compilados

## Verificação das Correções

1. **Build bem-sucedido**: ✅
   ```bash
   npm run build
   # ✓ built in 1.37s
   # dist/index.js  4.9kb
   ```

2. **Código sem dependências estáticas do Vite**: ✅
   - O arquivo compilado só tem imports dinâmicos
   - Tamanho reduzido de 6.3kb para 4.9kb

3. **Servidor inicia em produção**: ✅
   - Testado com `NODE_ENV=production`
   - Sem erros relacionados ao Vite

## Status
✅ **Problema resolvido!** 

O deploy no Railway agora deve funcionar corretamente. O servidor irá:
1. Compilar corretamente (frontend + backend)
2. Instalar apenas dependências de produção
3. Executar `node dist/index.js` sem erros
4. Servir arquivos estáticos da pasta `dist/public`

## Próximos Passos
1. Fazer commit das alterações
2. Fazer push para o repositório
3. Fazer novo deploy no Railway
4. Verificar se o deploy é bem-sucedido

O erro `ERR_MODULE_NOT_FOUND` para 'vite' não deve mais ocorrer.