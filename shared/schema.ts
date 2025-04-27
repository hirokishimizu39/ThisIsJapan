import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isJapanese: boolean("is_japanese").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  userId: integer("user_id").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  original: text("original").notNull(),
  translation: text("translation"),
  description: text("description").notNull(),
  userId: integer("user_id").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  photos: many(photos),
  words: many(words),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  user: one(users, {
    fields: [photos.userId],
    references: [users.id],
  }),
}));

export const wordsRelations = relations(words, ({ one }) => ({
  user: one(users, {
    fields: [words.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isJapanese: true,
});

export const insertPhotoSchema = createInsertSchema(photos).pick({
  title: true,
  description: true,
  imageUrl: true,
  userId: true,
});

export const insertWordSchema = createInsertSchema(words).pick({
  original: true,
  translation: true,
  description: true,
  userId: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  title: true,
  description: true,
  imageUrl: true,
  location: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof words.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

// Validation schema for photo uploads
export const photoUploadSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  image: z.instanceof(File),
});

// Validation schema for word posts
export const wordPostSchema = z.object({
  original: z.string().min(1).max(140),
  translation: z.string().max(140).optional(),
  description: z.string().min(10).max(500),
});

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
