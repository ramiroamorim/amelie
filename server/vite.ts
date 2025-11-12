import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";

// Em produção, o código é compilado e fica em dist/
// Em desenvolvimento, o código está em server/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    // Import dinâmico do Vite e nanoid apenas em desenvolvimento
    const { createServer: createViteServer, createLogger } = await import("vite");
    const { nanoid } = await import("nanoid");
    
    // Import dinâmico do vite config para evitar bundling em produção
    let viteConfig;
    try {
      const viteConfigModule = await import("../vite.config.js");
      viteConfig = viteConfigModule.default;
    } catch {
      // Fallback para configuração básica se vite.config não estiver disponível
      viteConfig = {
        root: path.resolve(__dirname, "..", "client"),
        build: {
          outDir: path.resolve(__dirname, "..", "dist/public")
        }
      };
    }
    
    const viteLogger = createLogger();

    const serverOptions = {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true as true,
    };

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        error: (msg: any, options: any) => {
          viteLogger.error(msg, options);
          process.exit(1);
        },
      },
      server: serverOptions,
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use("*", async (req: any, res: any, next: any) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          __dirname,
          "..",
          "client",
          "index.html",
        );

        // always reload the index.html file from disk incase it changes
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } catch (error) {
    // Se o Vite não está disponível (produção), apenas loga um aviso
    log("Vite not available, skipping development setup");
    throw new Error("Vite setup failed - this should only be called in development");
  }
}

export function serveStatic(app: Express) {
  // Em produção, os arquivos estáticos estão em dist/public
  // Tenta encontrar o diretório correto
  let distPath = path.resolve(__dirname, "public");

  // Se não existir, tenta o diretório pai (caso esteja em dist/)
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(__dirname, "..", "public");
  }

  // Se ainda não existir, tenta procurar no diretório do processo
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(process.cwd(), "dist", "public");
  }

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req: any, res: any) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
