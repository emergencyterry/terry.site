import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for custom authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for forum authentication and profiles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  displayName: varchar("display_name", { length: 100 }),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("member").notNull(), // admin, moderator, member
  isActive: integer("is_active").default(1).notNull(), // 0 = banned, 1 = active
  postCount: integer("post_count").default(0).notNull(),
  threadCount: integer("thread_count").default(0).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vmSessions = pgTable("vm_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  isoFileName: text("iso_file_name"),
  status: text("status").notNull().default("stopped"), // stopped, running, paused
  memory: integer("memory").notNull().default(512),
  cpuCores: integer("cpu_cores").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastStarted: timestamp("last_started"),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Forum category table
export const forumCategories = pgTable("forum_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  threadCount: integer("thread_count").default(0).notNull(),
  postCount: integer("post_count").default(0).notNull(),
  lastPostId: varchar("last_post_id"),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum thread table
export const forumThreads = pgTable("forum_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => forumCategories.id),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isLocked: integer("is_locked").default(0).notNull(),
  isSticky: integer("is_sticky").default(0).notNull(),
  postCount: integer("post_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  lastPostId: varchar("last_post_id"),
  lastPostUserId: varchar("last_post_user_id"),
  lastPostAt: timestamp("last_post_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum post table
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").references(() => forumThreads.id),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  isDeleted: integer("is_deleted").default(0).notNull(),
  editCount: integer("edit_count").default(0).notNull(),
  editedAt: timestamp("edited_at"),
  editedByUserId: varchar("edited_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVmSessionSchema = createInsertSchema(vmSessions).pick({
  name: true,
  isoFileName: true,
  memory: true,
  cpuCores: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).pick({
  originalName: true,
  fileName: true,
  fileSize: true,
  mimeType: true,
});

// Forum schema validations
export const insertUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8), // This will be hashed before storing
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
});

export const loginUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertCategorySchema = createInsertSchema(forumCategories).pick({
  name: true,
  description: true,
  sortOrder: true,
});

export const insertThreadSchema = createInsertSchema(forumThreads).pick({
  categoryId: true,
  title: true,
  content: true,
}).extend({
  categoryId: z.string().min(1, "Category ID is required"),
});

export const insertPostSchema = createInsertSchema(forumPosts).pick({
  threadId: true,
  content: true,
}).extend({
  threadId: z.string().min(1, "Thread ID is required"),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'passwordHash'>;

export type VmSession = typeof vmSessions.$inferSelect;
export type InsertVmSession = z.infer<typeof insertVmSessionSchema>;

export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;

export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertCategorySchema>;

export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumThread = z.infer<typeof insertThreadSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertPostSchema>;

export type RegisterUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
