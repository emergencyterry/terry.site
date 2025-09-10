import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertVmSessionSchema, 
  insertUploadedFileSchema, 
  insertUserSchema, 
  loginUserSchema,
  insertCategorySchema,
  insertThreadSchema,
  insertPostSchema,
  type SafeUser 
} from "@shared/schema";

const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 4 * 1024 * 1024 * 1024 } // 4GB limit for ISO files
});

// Session types for TypeScript
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: SafeUser;
  }
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Role-based authorization middleware
function requireRole(role: 'admin' | 'moderator') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Validate SESSION_SECRET in production
  if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.includes('default'))) {
    console.warn('WARNING: SESSION_SECRET must be set in production for security!');
  }
  
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Log the user in immediately after registration
      req.session.userId = user.id;
      req.session.user = user;
      
      res.status(201).json({ user, message: "Registration successful" });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.validateUserPassword(validatedData.username, validatedData.password);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.session.userId = user.id;
      req.session.user = user;
      
      res.json({ user, message: "Login successful" });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });
  
  app.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json({ user: req.session.user });
  });
  
  // User Profile Routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Forum Category Routes
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  app.post("/api/forum/categories", requireRole('admin'), async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create category" });
    }
  });
  
  // Forum Thread Routes
  app.get("/api/forum/categories/:categoryId/threads", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const threads = await storage.getThreadsByCategory(categoryId);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threads" });
    }
  });
  
  app.get("/api/forum/threads/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const thread = await storage.getThread(id);
      
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      
      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch thread" });
    }
  });
  
  app.post("/api/forum/threads", requireAuth, async (req, res) => {
    try {
      const validatedData = insertThreadSchema.parse(req.body);
      const thread = await storage.createThread(validatedData, req.session.userId!);
      res.status(201).json(thread);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create thread" });
    }
  });
  
  // Forum Post Routes
  app.get("/api/forum/threads/:threadId/posts", async (req, res) => {
    try {
      const { threadId } = req.params;
      const posts = await storage.getPostsByThread(threadId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  
  app.post("/api/forum/posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData, req.session.userId!);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create post" });
    }
  });
  
  // Get all VM sessions
  app.get("/api/vm-sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllVmSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VM sessions" });
    }
  });

  // Create new VM session
  app.post("/api/vm-sessions", async (req, res) => {
    try {
      const validatedData = insertVmSessionSchema.parse(req.body);
      const session = await storage.createVmSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid VM session data" });
    }
  });

  // Update VM session
  app.patch("/api/vm-sessions/:id", async (req, res) => {
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

  // Start VM session
  app.post("/api/vm-sessions/:id/start", async (req, res) => {
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

  // Stop VM session
  app.post("/api/vm-sessions/:id/stop", async (req, res) => {
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

  // Upload ISO file
  app.post("/api/upload-iso", upload.single("iso"), async (req, res) => {
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

  // Get all uploaded files
  app.get("/api/uploaded-files", async (req, res) => {
    try {
      const files = await storage.getAllUploadedFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch uploaded files" });
    }
  });

  // Delete uploaded file
  app.delete("/api/uploaded-files/:id", async (req, res) => {
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
