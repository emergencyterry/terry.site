import { type VmSession, type InsertVmSession, type UploadedFile, type InsertUploadedFile, vmSessions, uploadedFiles } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
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
  private vmSessions: Map<string, VmSession>;
  private uploadedFiles: Map<string, UploadedFile>;

  constructor() {
    this.vmSessions = new Map();
    this.uploadedFiles = new Map();
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
      memory: insertSession.memory ?? 512,
      cpuCores: insertSession.cpuCores ?? 1,
      isoFileName: insertSession.isoFileName ?? null,
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

export class DatabaseStorage implements IStorage {
  // VM Session operations
  async getVmSession(id: string): Promise<VmSession | undefined> {
    const [session] = await db.select().from(vmSessions).where(eq(vmSessions.id, id));
    return session;
  }

  async getAllVmSessions(): Promise<VmSession[]> {
    return await db.select().from(vmSessions);
  }

  async createVmSession(insertSession: InsertVmSession): Promise<VmSession> {
    const [session] = await db
      .insert(vmSessions)
      .values({
        ...insertSession,
        status: "stopped",
        memory: insertSession.memory ?? 512,
        cpuCores: insertSession.cpuCores ?? 1,
        isoFileName: insertSession.isoFileName ?? null,
      })
      .returning();
    return session;
  }

  async updateVmSession(id: string, updates: Partial<VmSession>): Promise<VmSession | undefined> {
    const [session] = await db
      .update(vmSessions)
      .set(updates)
      .where(eq(vmSessions.id, id))
      .returning();
    return session;
  }

  async deleteVmSession(id: string): Promise<boolean> {
    const result = await db.delete(vmSessions).where(eq(vmSessions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Uploaded File operations
  async getUploadedFile(id: string): Promise<UploadedFile | undefined> {
    const [file] = await db.select().from(uploadedFiles).where(eq(uploadedFiles.id, id));
    return file;
  }

  async getAllUploadedFiles(): Promise<UploadedFile[]> {
    return await db.select().from(uploadedFiles);
  }

  async createUploadedFile(insertFile: InsertUploadedFile): Promise<UploadedFile> {
    const [file] = await db
      .insert(uploadedFiles)
      .values(insertFile)
      .returning();
    return file;
  }

  async deleteUploadedFile(id: string): Promise<boolean> {
    const result = await db.delete(uploadedFiles).where(eq(uploadedFiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
