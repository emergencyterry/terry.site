import { 
  type VmSession, type InsertVmSession, 
  type UploadedFile, type InsertUploadedFile,
  type User, type SafeUser, type RegisterUser,
  type ForumCategory, type InsertForumCategory,
  type ForumThread, type InsertForumThread,
  type ForumPost, type InsertForumPost,
  vmSessions, uploadedFiles, users, forumCategories, forumThreads, forumPosts 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // VM Session operations
  getVmSession(id: string): Promise<VmSession | undefined>;
  getAllVmSessions(): Promise<VmSession[]>;
  createVmSession(session: InsertVmSession): Promise<VmSession>;
  updateVmSession(id: string, updates: Partial<VmSession>): Promise<VmSession | undefined>;
  deleteVmSession(id: string): Promise<boolean>;
  
  // File operations
  getUploadedFile(id: string): Promise<UploadedFile | undefined>;
  getAllUploadedFiles(): Promise<UploadedFile[]>;
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  deleteUploadedFile(id: string): Promise<boolean>;
  
  // User operations
  createUser(user: RegisterUser): Promise<SafeUser>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<SafeUser | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<SafeUser | undefined>;
  validateUserPassword(username: string, password: string): Promise<SafeUser | null>;
  
  // Forum Category operations
  getAllCategories(): Promise<ForumCategory[]>;
  getCategory(id: string): Promise<ForumCategory | undefined>;
  createCategory(category: InsertForumCategory): Promise<ForumCategory>;
  updateCategory(id: string, updates: Partial<ForumCategory>): Promise<ForumCategory | undefined>;
  
  // Forum Thread operations
  getThreadsByCategory(categoryId: string): Promise<ForumThread[]>;
  getThread(id: string): Promise<ForumThread | undefined>;
  createThread(thread: InsertForumThread, userId: string): Promise<ForumThread>;
  updateThread(id: string, updates: Partial<ForumThread>): Promise<ForumThread | undefined>;
  
  // Forum Post operations
  getPostsByThread(threadId: string): Promise<ForumPost[]>;
  getPost(id: string): Promise<ForumPost | undefined>;
  createPost(post: InsertForumPost, userId: string): Promise<ForumPost>;
  updatePost(id: string, updates: Partial<ForumPost>): Promise<ForumPost | undefined>;
  deletePost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private vmSessions: Map<string, VmSession>;
  private uploadedFiles: Map<string, UploadedFile>;
  private users: Map<string, User>;
  private categories: Map<string, ForumCategory>;
  private threads: Map<string, ForumThread>;
  private posts: Map<string, ForumPost>;

  constructor() {
    this.vmSessions = new Map();
    this.uploadedFiles = new Map();
    this.users = new Map();
    this.categories = new Map();
    this.threads = new Map();
    this.posts = new Map();
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

  // User operations
  async createUser(user: RegisterUser): Promise<SafeUser> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      id,
      username: user.username,
      email: user.email,
      passwordHash,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      displayName: user.displayName || null,
      bio: user.bio || null,
      profileImageUrl: null,
      role: "member",
      isActive: 1,
      postCount: 0,
      threadCount: 0,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    // Return without password hash
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getUserById(id: string): Promise<SafeUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<SafeUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    const { passwordHash: _, ...safeUser } = updatedUser;
    return safeUser;
  }

  async validateUserPassword(username: string, password: string): Promise<SafeUser | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;
    
    // Update last login
    user.lastLoginAt = new Date();
    this.users.set(user.id, user);
    
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  // Forum Category operations
  async getAllCategories(): Promise<ForumCategory[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getCategory(id: string): Promise<ForumCategory | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const id = randomUUID();
    const newCategory: ForumCategory = {
      id,
      name: category.name,
      description: category.description || null,
      sortOrder: category.sortOrder || 0,
      threadCount: 0,
      postCount: 0,
      lastPostId: null,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<ForumCategory>): Promise<ForumCategory | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates, updatedAt: new Date() };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  // Forum Thread operations
  async getThreadsByCategory(categoryId: string): Promise<ForumThread[]> {
    return Array.from(this.threads.values())
      .filter(t => t.categoryId === categoryId)
      .sort((a, b) => (b.lastPostAt?.getTime() || b.createdAt!.getTime()) - (a.lastPostAt?.getTime() || a.createdAt!.getTime()));
  }

  async getThread(id: string): Promise<ForumThread | undefined> {
    return this.threads.get(id);
  }

  async createThread(thread: InsertForumThread, userId: string): Promise<ForumThread> {
    const id = randomUUID();
    const now = new Date();
    const newThread: ForumThread = {
      id,
      categoryId: thread.categoryId!,
      userId,
      title: thread.title,
      content: thread.content,
      isLocked: 0,
      isSticky: 0,
      postCount: 0,
      viewCount: 0,
      lastPostId: null,
      lastPostUserId: null,
      lastPostAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.threads.set(id, newThread);
    return newThread;
  }

  async updateThread(id: string, updates: Partial<ForumThread>): Promise<ForumThread | undefined> {
    const thread = this.threads.get(id);
    if (!thread) return undefined;
    
    const updatedThread = { ...thread, ...updates, updatedAt: new Date() };
    this.threads.set(id, updatedThread);
    return updatedThread;
  }

  // Forum Post operations
  async getPostsByThread(threadId: string): Promise<ForumPost[]> {
    return Array.from(this.posts.values())
      .filter(p => p.threadId === threadId && !p.isDeleted)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async getPost(id: string): Promise<ForumPost | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertForumPost, userId: string): Promise<ForumPost> {
    const id = randomUUID();
    const now = new Date();
    const newPost: ForumPost = {
      id,
      threadId: post.threadId!,
      userId,
      content: post.content,
      isDeleted: 0,
      editCount: 0,
      editedAt: null,
      editedByUserId: null,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async updatePost(id: string, updates: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
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

  // User operations
  async createUser(user: RegisterUser): Promise<SafeUser> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        username: user.username,
        email: user.email,
        passwordHash,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        displayName: user.displayName || null,
        bio: user.bio || null,
        role: "member",
        isActive: 1,
        postCount: 0,
        threadCount: 0,
      })
      .returning();
    
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: string): Promise<SafeUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return undefined;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<SafeUser | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) return undefined;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async validateUserPassword(username: string, password: string): Promise<SafeUser | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;
    
    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));
    
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  // Forum Category operations
  async getAllCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories)
      .where(eq(forumCategories.isActive, 1))
      .orderBy(asc(forumCategories.sortOrder));
  }

  async getCategory(id: string): Promise<ForumCategory | undefined> {
    const [category] = await db.select().from(forumCategories).where(eq(forumCategories.id, id));
    return category;
  }

  async createCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [newCategory] = await db
      .insert(forumCategories)
      .values({
        name: category.name,
        description: category.description || null,
        sortOrder: category.sortOrder || 0,
        threadCount: 0,
        postCount: 0,
        isActive: 1,
      })
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<ForumCategory>): Promise<ForumCategory | undefined> {
    const [category] = await db
      .update(forumCategories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(forumCategories.id, id))
      .returning();
    return category;
  }

  // Forum Thread operations
  async getThreadsByCategory(categoryId: string): Promise<ForumThread[]> {
    return await db.select().from(forumThreads)
      .where(eq(forumThreads.categoryId, categoryId))
      .orderBy(desc(forumThreads.isSticky), desc(forumThreads.lastPostAt));
  }

  async getThread(id: string): Promise<ForumThread | undefined> {
    const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, id));
    return thread;
  }

  async createThread(thread: InsertForumThread, userId: string): Promise<ForumThread> {
    const [newThread] = await db
      .insert(forumThreads)
      .values({
        categoryId: thread.categoryId!,
        userId,
        title: thread.title,
        content: thread.content,
        isLocked: 0,
        isSticky: 0,
        postCount: 0,
        viewCount: 0,
        lastPostAt: new Date(),
      })
      .returning();
    return newThread;
  }

  async updateThread(id: string, updates: Partial<ForumThread>): Promise<ForumThread | undefined> {
    const [thread] = await db
      .update(forumThreads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(forumThreads.id, id))
      .returning();
    return thread;
  }

  // Forum Post operations
  async getPostsByThread(threadId: string): Promise<ForumPost[]> {
    return await db.select().from(forumPosts)
      .where(and(eq(forumPosts.threadId, threadId), eq(forumPosts.isDeleted, 0)))
      .orderBy(asc(forumPosts.createdAt));
  }

  async getPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post;
  }

  async createPost(post: InsertForumPost, userId: string): Promise<ForumPost> {
    const [newPost] = await db
      .insert(forumPosts)
      .values({
        threadId: post.threadId!,
        userId,
        content: post.content,
        isDeleted: 0,
        editCount: 0,
      })
      .returning();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const [post] = await db
      .update(forumPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(forumPosts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(forumPosts).where(eq(forumPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
