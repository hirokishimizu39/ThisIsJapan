import { 
  users, experiences, photos, words, 
  type User, type InsertUser, 
  type Photo, type InsertPhoto,
  type Word, type InsertWord,
  type Experience, type InsertExperience
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

// Create session stores with proper types
const MemoryStore = createMemoryStore(session);
const PostgresStore = connectPgSimple(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Photo methods
  getAllPhotos(): Promise<Photo[]>;
  getTopPhotos(limit: number): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  likePhoto(id: number): Promise<Photo | undefined>;
  
  // Word methods
  getAllWords(): Promise<Word[]>;
  getTopWords(limit: number): Promise<Word[]>;
  getWord(id: number): Promise<Word | undefined>;
  createWord(word: InsertWord): Promise<Word>;
  likeWord(id: number): Promise<Word | undefined>;
  
  // Experience methods
  getAllExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use a PostgreSQL session store
    const PostgresSessionStore = connectPgSimple(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    this.initializeDefaultData().catch(err => {
      console.error("Failed to initialize default data:", err);
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Photo methods
  async getAllPhotos(): Promise<Photo[]> {
    try {
      return await db.select().from(photos).orderBy(desc(photos.likes));
    } catch (error) {
      console.error("Error getting all photos:", error);
      throw error;
    }
  }

  async getTopPhotos(limit: number): Promise<Photo[]> {
    try {
      return await db.select().from(photos).orderBy(desc(photos.likes)).limit(limit);
    } catch (error) {
      console.error("Error getting top photos:", error);
      throw error;
    }
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    try {
      const [photo] = await db.select().from(photos).where(eq(photos.id, id));
      return photo || undefined;
    } catch (error) {
      console.error("Error getting photo:", error);
      throw error;
    }
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    try {
      // Ensure likes are initialized to 0
      const dataWithLikes = {
        ...insertPhoto,
        likes: 0
      };
      const [photo] = await db.insert(photos).values(dataWithLikes).returning();
      return photo;
    } catch (error) {
      console.error("Error creating photo:", error);
      throw error;
    }
  }

  async likePhoto(id: number): Promise<Photo | undefined> {
    try {
      const [photo] = await db
        .update(photos)
        .set({ likes: sql`${photos.likes} + 1` })
        .where(eq(photos.id, id))
        .returning();
      return photo || undefined;
    } catch (error) {
      console.error("Error liking photo:", error);
      throw error;
    }
  }

  // Word methods
  async getAllWords(): Promise<Word[]> {
    try {
      return await db.select().from(words).orderBy(desc(words.likes));
    } catch (error) {
      console.error("Error getting all words:", error);
      throw error;
    }
  }

  async getTopWords(limit: number): Promise<Word[]> {
    try {
      return await db.select().from(words).orderBy(desc(words.likes)).limit(limit);
    } catch (error) {
      console.error("Error getting top words:", error);
      throw error;
    }
  }

  async getWord(id: number): Promise<Word | undefined> {
    try {
      const [word] = await db.select().from(words).where(eq(words.id, id));
      return word || undefined;
    } catch (error) {
      console.error("Error getting word:", error);
      throw error;
    }
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    try {
      // Ensure likes are initialized to 0
      const dataWithLikes = {
        ...insertWord,
        likes: 0
      };
      const [word] = await db.insert(words).values(dataWithLikes).returning();
      return word;
    } catch (error) {
      console.error("Error creating word:", error);
      throw error;
    }
  }

  async likeWord(id: number): Promise<Word | undefined> {
    try {
      const [word] = await db
        .update(words)
        .set({ likes: sql`${words.likes} + 1` })
        .where(eq(words.id, id))
        .returning();
      return word || undefined;
    } catch (error) {
      console.error("Error liking word:", error);
      throw error;
    }
  }

  // Experience methods
  async getAllExperiences(): Promise<Experience[]> {
    try {
      return await db.select().from(experiences);
    } catch (error) {
      console.error("Error getting all experiences:", error);
      throw error;
    }
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    try {
      const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
      return experience || undefined;
    } catch (error) {
      console.error("Error getting experience:", error);
      throw error;
    }
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    try {
      const [experience] = await db.insert(experiences).values(insertExperience).returning();
      return experience;
    } catch (error) {
      console.error("Error creating experience:", error);
      throw error;
    }
  }

  // Initialize sample data
  async initializeDefaultData() {
    try {
      // Check if data already exists
      const userCount = await db.select({ count: sql`count(*)` }).from(users);
      if (parseInt(userCount[0].count as string) > 0) {
        console.log("Data already initialized, skipping...");
        return;
      }

      console.log("Initializing default data...");

      // Create sample user
      const sampleUser = await this.createUser({
        username: "taro_yamada",
        password: "password123",
        isJapanese: true
      });
      
      const foreignUser = await this.createUser({
        username: "emma_wilson",
        password: "password123",
        isJapanese: false
      });

      // Create sample photos
      const photoData = [
        {
          title: "春の桜と富士山",
          description: "山梨県からの富士山の眺め。日本の象徴と春の象徴が重なる瞬間。",
          imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
          userId: sampleUser.id,
          likes: 1500
        },
        {
          title: "秋の清水寺",
          description: "京都の歴史的な寺院と紅葉の美しい風景。",
          imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
          userId: sampleUser.id,
          likes: 1300
        },
        {
          title: "東京の夜景",
          description: "輝く東京の街並みと都市の光。",
          imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
          userId: sampleUser.id,
          likes: 1100
        },
        {
          title: "嵐山の竹林",
          description: "京都嵐山の静かで神秘的な竹林の小道。",
          imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
          userId: sampleUser.id,
          likes: 900
        }
      ];

      await db.insert(photos).values(photoData);

      // Create sample experiences
      const experienceData = [
        {
          title: "茶道体験",
          description: "伝統的な日本の茶道を体験しながら、禅の精神と日本文化の深い理解を得られます。",
          imageUrl: "https://images.unsplash.com/photo-1565532806166-c2a74c772249",
          location: "京都, 日本"
        },
        {
          title: "着物着付け体験",
          description: "伝統的な日本の民族衣装である着物を着て、古都を散策しながら日本の美意識を体感できます。",
          imageUrl: "https://images.unsplash.com/photo-1611032977401-60bde1d18f38",
          location: "東京, 日本"
        }
      ];

      await db.insert(experiences).values(experienceData);

      // Create sample words
      const wordData = [
        {
          original: "一期一会 - いちごいちえ",
          translation: "One time, one meeting",
          description: "人との出会いを大切にし、その瞬間は二度と訪れないという日本の哲学。すべての出会いを唯一無二のものとして尊重する考え方。",
          userId: foreignUser.id,
          likes: 600
        },
        {
          original: "侘寂 - わびさび",
          translation: "Wabi-sabi",
          description: "完璧ではない美しさを見出す美意識。シンプルさ、自然な風合い、年月の痕跡を尊ぶ考え方。",
          userId: foreignUser.id,
          likes: 500
        },
        {
          original: "もったいない",
          translation: "Mottainai",
          description: "物を大切にし、無駄にしないという日本の精神。資源を尊重し、感謝する心を表す言葉。",
          userId: foreignUser.id,
          likes: 400
        }
      ];

      await db.insert(words).values(wordData);
      
      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
