import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertVmSessionSchema, insertUploadedFileSchema } from "@shared/schema";

const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 4 * 1024 * 1024 * 1024 } // 4GB limit for ISO files
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all VM sessions (protected)
  app.get("/api/vm-sessions", isAuthenticated, async (req, res) => {
    try {
      const sessions = await storage.getAllVmSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VM sessions" });
    }
  });

  // Create new VM session (protected)
  app.post("/api/vm-sessions", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVmSessionSchema.parse(req.body);
      const session = await storage.createVmSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid VM session data" });
    }
  });

  // Update VM session (protected)
  app.patch("/api/vm-sessions/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const session = await storage.updateVmSession(id, updates);
      if (!session) {
        return res.status(404).json({ message: "VM session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update VM session" });
    }
  });

  // Start VM session (protected)
  app.post("/api/vm-sessions/:id/start", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateVmSession(id, {
        status: "running",
        lastStarted: new Date(),
      });
      
      if (!session) {
        return res.status(404).json({ message: "VM session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start VM session" });
    }
  });

  // Stop VM session (protected)
  app.post("/api/vm-sessions/:id/stop", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateVmSession(id, {
        status: "stopped",
      });
      
      if (!session) {
        return res.status(404).json({ message: "VM session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop VM session" });
    }
  });

  // Upload ISO file (protected)
  app.post("/api/upload-iso", isAuthenticated, upload.single("iso"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      };

      const validatedData = insertUploadedFileSchema.parse(fileData);
      const uploadedFile = await storage.createUploadedFile(validatedData);
      
      res.json(uploadedFile);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get all uploaded files (protected)
  app.get("/api/uploaded-files", isAuthenticated, async (req, res) => {
    try {
      const files = await storage.getAllUploadedFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch uploaded files" });
    }
  });

  // Delete uploaded file (protected)
  app.delete("/api/uploaded-files/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getUploadedFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete physical file
      const filePath = path.join("uploads", file.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const deleted = await storage.deleteUploadedFile(id);
      if (!deleted) {
        return res.status(404).json({ message: "File not found" });
      }

      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Serve uploaded files
  app.get("/api/files/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join("uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.sendFile(path.resolve(filePath));
  });

  const httpServer = createServer(app);
  return httpServer;
}
