import { 
  users, experiences, photos, words, 
  type User, type InsertUser, 
  type Photo, type InsertPhoto,
  type Word, type InsertWord,
  type Experience, type InsertExperience
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Photo methods
  async getAllPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(desc(photos.likes));
  }

  async getTopPhotos(limit: number): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(desc(photos.likes)).limit(limit);
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo || undefined;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const [photo] = await db.insert(photos).values(insertPhoto).returning();
    return photo;
  }

  async likePhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db
      .update(photos)
      .set({ likes: sql`${photos.likes} + 1` })
      .where(eq(photos.id, id))
      .returning();
    return photo || undefined;
  }

  // Word methods
  async getAllWords(): Promise<Word[]> {
    return await db.select().from(words).orderBy(desc(words.likes));
  }

  async getTopWords(limit: number): Promise<Word[]> {
    return await db.select().from(words).orderBy(desc(words.likes)).limit(limit);
  }

  async getWord(id: number): Promise<Word | undefined> {
    const [word] = await db.select().from(words).where(eq(words.id, id));
    return word || undefined;
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const [word] = await db.insert(words).values(insertWord).returning();
    return word;
  }

  async likeWord(id: number): Promise<Word | undefined> {
    const [word] = await db
      .update(words)
      .set({ likes: sql`${words.likes} + 1` })
      .where(eq(words.id, id))
      .returning();
    return word || undefined;
  }

  // Experience methods
  async getAllExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences);
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience || undefined;
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const [experience] = await db.insert(experiences).values(insertExperience).returning();
    return experience;
  }

  // Initialize sample data
  async initializeDefaultData() {
    // Check if data already exists
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    if (parseInt(userCount[0].count as string) > 0) {
      console.log("Data already initialized, skipping...");
      return;
    }

    console.log("Initializing default data...");

    try {
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
      const photoData: InsertPhoto[] = [
        {
          title: "春の桜と富士山",
          description: "山梨県からの富士山の眺め。日本の象徴と春の象徴が重なる瞬間。",
          imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
          userId: sampleUser.id,
        },
        {
          title: "秋の清水寺",
          description: "京都の歴史的な寺院と紅葉の美しい風景。",
          imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
          userId: sampleUser.id,
        },
        {
          title: "東京の夜景",
          description: "輝く東京の街並みと都市の光。",
          imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
          userId: sampleUser.id,
        },
        {
          title: "嵐山の竹林",
          description: "京都嵐山の静かで神秘的な竹林の小道。",
          imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
          userId: sampleUser.id,
        }
      ];

      for (let i = 0; i < photoData.length; i++) {
        const photo = await this.createPhoto(photoData[i]);
        // Add likes in descending order
        const likes = 1500 - (i * 200);
        for (let j = 0; j < Math.min(likes, 10); j++) { // Limit to 10 likes per photo for performance
          await this.likePhoto(photo.id);
        }
        // For the first photo, set the likes directly to simulate many likes
        if (i === 0) {
          await db.update(photos)
            .set({ likes: 1500 })
            .where(eq(photos.id, photo.id));
        }
      }

      // Create sample experiences
      const experienceData: InsertExperience[] = [
        {
          title: "茶道体験",
          description: "伝統的な日本の茶道を体験しながら、禅の精神と日本文化の深い理解を得られます。",
          imageUrl: "https://images.unsplash.com/photo-1565532806166-c2a74c772249",
          location: "京都, 日本",
        },
        {
          title: "着物着付け体験",
          description: "伝統的な日本の民族衣装である着物を着て、古都を散策しながら日本の美意識を体感できます。",
          imageUrl: "https://images.unsplash.com/photo-1611032977401-60bde1d18f38",
          location: "東京, 日本",
        }
      ];

      for (const experienceItem of experienceData) {
        await this.createExperience(experienceItem);
      }

      // Create sample words
      const wordData: InsertWord[] = [
        {
          original: "一期一会 - いちごいちえ",
          translation: "One time, one meeting",
          description: "人との出会いを大切にし、その瞬間は二度と訪れないという日本の哲学。すべての出会いを唯一無二のものとして尊重する考え方。",
          userId: foreignUser.id,
        },
        {
          original: "侘寂 - わびさび",
          translation: "Wabi-sabi",
          description: "完璧ではない美しさを見出す美意識。シンプルさ、自然な風合い、年月の痕跡を尊ぶ考え方。",
          userId: foreignUser.id,
        },
        {
          original: "もったいない",
          translation: "Mottainai",
          description: "物を大切にし、無駄にしないという日本の精神。資源を尊重し、感謝する心を表す言葉。",
          userId: foreignUser.id,
        }
      ];

      for (let i = 0; i < wordData.length; i++) {
        const word = await this.createWord(wordData[i]);
        // Add likes in descending order
        const likes = 600 - (i * 100);
        for (let j = 0; j < Math.min(likes, 10); j++) { // Limit to 10 likes per word for performance
          await this.likeWord(word.id);
        }
        // For the first word, set the likes directly to simulate many likes
        if (i === 0) {
          await db.update(words)
            .set({ likes: 600 })
            .where(eq(words.id, word.id));
        }
      }
      
      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

export const storage = new DatabaseStorage();
