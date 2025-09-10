import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type VmSession = typeof vmSessions.$inferSelect;
export type InsertVmSession = z.infer<typeof insertVmSessionSchema>;
export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;
