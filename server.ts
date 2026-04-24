import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Analytics Tracking Mock Storage (In-memory for demo)
  const analytics = {
    page_views: 0,
    compressions: 0,
    events: [] as any[]
  };

  // API Routes
  app.post("/api/track", (req, res) => {
    const { event, page, timestamp } = req.body;
    
    if (event === "page_view") analytics.page_views++;
    if (event === "compress") analytics.compressions++;
    
    analytics.events.push({ event, page, timestamp });
    
    // Keep logs small for demo
    if (analytics.events.length > 1000) analytics.events.shift();

    console.log(`[Analytics] ${event} on ${page}`);
    res.json({ status: "ok", counts: { views: analytics.page_views, compressions: analytics.compressions } });
  });

  app.get("/api/stats", (req, res) => {
    res.json(analytics);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 OptiPress Server running on http://localhost:${PORT}`);
  });
}

startServer();
