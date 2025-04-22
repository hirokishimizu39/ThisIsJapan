import { 
  users, experiences, photos, words, 
  type User, type InsertUser, 
  type Photo, type InsertPhoto,
  type Word, type InsertWord,
  type Experience, type InsertExperience
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private photos: Map<number, Photo>;
  private words: Map<number, Word>;
  private experiences: Map<number, Experience>;
  private currentUserId: number;
  private currentPhotoId: number;
  private currentWordId: number;
  private currentExperienceId: number;

  constructor() {
    this.users = new Map();
    this.photos = new Map();
    this.words = new Map();
    this.experiences = new Map();
    this.currentUserId = 1;
    this.currentPhotoId = 1;
    this.currentWordId = 1;
    this.currentExperienceId = 1;
    
    // Initialize with sample data
    this.initializeDefaultData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Photo methods
  async getAllPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .sort((a, b) => b.likes - a.likes);
  }

  async getTopPhotos(limit: number): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const createdAt = new Date();
    const photo: Photo = { ...insertPhoto, id, createdAt };
    this.photos.set(id, photo);
    return photo;
  }

  async likePhoto(id: number): Promise<Photo | undefined> {
    const photo = this.photos.get(id);
    if (photo) {
      photo.likes += 1;
      this.photos.set(id, photo);
      return photo;
    }
    return undefined;
  }

  // Word methods
  async getAllWords(): Promise<Word[]> {
    return Array.from(this.words.values())
      .sort((a, b) => b.likes - a.likes);
  }

  async getTopWords(limit: number): Promise<Word[]> {
    return Array.from(this.words.values())
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  async getWord(id: number): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = this.currentWordId++;
    const createdAt = new Date();
    const word: Word = { ...insertWord, id, createdAt };
    this.words.set(id, word);
    return word;
  }

  async likeWord(id: number): Promise<Word | undefined> {
    const word = this.words.get(id);
    if (word) {
      word.likes += 1;
      this.words.set(id, word);
      return word;
    }
    return undefined;
  }

  // Experience methods
  async getAllExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentExperienceId++;
    const createdAt = new Date();
    const experience: Experience = { ...insertExperience, id, createdAt };
    this.experiences.set(id, experience);
    return experience;
  }

  // Initialize with sample data
  private initializeDefaultData() {
    // Create sample user
    const sampleUser: InsertUser = {
      username: "taro_yamada",
      password: "password123",
      isJapanese: true
    };
    const foreignUser: InsertUser = {
      username: "emma_wilson",
      password: "password123",
      isJapanese: false
    };
    
    this.createUser(sampleUser).then(user => {
      // Create sample photos
      const photos: InsertPhoto[] = [
        {
          title: "春の桜と富士山",
          description: "山梨県からの富士山の眺め。日本の象徴と春の象徴が重なる瞬間。",
          imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
          userId: user.id,
        },
        {
          title: "秋の清水寺",
          description: "京都の歴史的な寺院と紅葉の美しい風景。",
          imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
          userId: user.id,
        },
        {
          title: "東京の夜景",
          description: "輝く東京の街並みと都市の光。",
          imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
          userId: user.id,
        },
        {
          title: "嵐山の竹林",
          description: "京都嵐山の静かで神秘的な竹林の小道。",
          imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
          userId: user.id,
        }
      ];

      photos.forEach((photo, index) => {
        this.createPhoto(photo).then(p => {
          // Add likes in descending order (most for the first photo)
          const likes = 1500 - (index * 200);
          for (let i = 0; i < likes; i++) {
            this.likePhoto(p.id);
          }
        });
      });

      // Create sample experiences
      const experiences: InsertExperience[] = [
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

      experiences.forEach(experience => {
        this.createExperience(experience);
      });
    });

    this.createUser(foreignUser).then(user => {
      // Create sample words
      const words: InsertWord[] = [
        {
          original: "一期一会 - いちごいちえ",
          translation: "One time, one meeting",
          description: "人との出会いを大切にし、その瞬間は二度と訪れないという日本の哲学。すべての出会いを唯一無二のものとして尊重する考え方。",
          userId: user.id,
        },
        {
          original: "侘寂 - わびさび",
          translation: "Wabi-sabi",
          description: "完璧ではない美しさを見出す美意識。シンプルさ、自然な風合い、年月の痕跡を尊ぶ考え方。",
          userId: user.id,
        },
        {
          original: "もったいない",
          translation: "Mottainai",
          description: "物を大切にし、無駄にしないという日本の精神。資源を尊重し、感謝する心を表す言葉。",
          userId: user.id,
        }
      ];

      words.forEach((word, index) => {
        this.createWord(word).then(w => {
          // Add likes in descending order
          const likes = 600 - (index * 100);
          for (let i = 0; i < likes; i++) {
            this.likeWord(w.id);
          }
        });
      });
    });
  }
}

export const storage = new MemStorage();
