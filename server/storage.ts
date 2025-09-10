import { type User, type InsertUser, type VmSession, type InsertVmSession, type UploadedFile, type InsertUploadedFile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVmSession(id: string): Promise<VmSession | undefined>;
  getAllVmSessions(): Promise<VmSession[]>;
  createVmSession(session: InsertVmSession): Promise<VmSession>;
  updateVmSession(id: string, updates: Partial<VmSession>): Promise<VmSession | undefined>;
  deleteVmSession(id: string): Promise<boolean>;
  
  getUploadedFile(id: string): Promise<UploadedFile | undefined>;
  getAllUploadedFiles(): Promise<UploadedFile[]>;
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  deleteUploadedFile(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vmSessions: Map<string, VmSession>;
  private uploadedFiles: Map<string, UploadedFile>;

  constructor() {
    this.users = new Map();
    this.vmSessions = new Map();
    this.uploadedFiles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getVmSession(id: string): Promise<VmSession | undefined> {
    return this.vmSessions.get(id);
  }

  async getAllVmSessions(): Promise<VmSession[]> {
    return Array.from(this.vmSessions.values());
  }

  async createVmSession(insertSession: InsertVmSession): Promise<VmSession> {
    const id = randomUUID();
    const session: VmSession = {
      ...insertSession,
      id,
      status: "stopped",
      createdAt: new Date(),
      lastStarted: null,
    };
    this.vmSessions.set(id, session);
    return session;
  }

  async updateVmSession(id: string, updates: Partial<VmSession>): Promise<VmSession | undefined> {
    const session = this.vmSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.vmSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteVmSession(id: string): Promise<boolean> {
    return this.vmSessions.delete(id);
  }

  async getUploadedFile(id: string): Promise<UploadedFile | undefined> {
    return this.uploadedFiles.get(id);
  }

  async getAllUploadedFiles(): Promise<UploadedFile[]> {
    return Array.from(this.uploadedFiles.values());
  }

  async createUploadedFile(insertFile: InsertUploadedFile): Promise<UploadedFile> {
    const id = randomUUID();
    const file: UploadedFile = {
      ...insertFile,
      id,
      uploadedAt: new Date(),
    };
    this.uploadedFiles.set(id, file);
    return file;
  }

  async deleteUploadedFile(id: string): Promise<boolean> {
    return this.uploadedFiles.delete(id);
  }
}

export const storage = new MemStorage();
