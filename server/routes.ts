import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { insertPhotoSchema, insertWordSchema, photoUploadSchema, wordPostSchema } from "@shared/schema";
import path from "path";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
  fileFilter: (_, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Get top photos
  router.get("/photos/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || "10");
      const photos = await storage.getTopPhotos(limit);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top photos" });
    }
  });

  // Get all photos
  router.get("/photos", async (req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Get photo by id
  router.get("/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhoto(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  // Upload photo
  router.post("/photos", upload.single("image"), async (req, res) => {
    try {
      // In a real implementation, we would handle the file upload to a service like S3
      // For this MVP, we'll use the provided URL in the request body
      const body = photoUploadSchema.safeParse({
        title: req.body.title,
        description: req.body.description,
        image: req.file,
      });

      if (!body.success) {
        return res.status(400).json({ 
          message: "Invalid photo data",
          errors: body.error.errors
        });
      }

      // In this simplified version, we'll use a sample user ID
      // In a real app, this would come from the authenticated user
      const userId = 1;
      const imageUrl = req.body.imageUrl || "https://images.unsplash.com/photo-1528360983277-13d401cdc186";

      const photoData = insertPhotoSchema.parse({
        title: req.body.title,
        description: req.body.description || "",
        imageUrl,
        userId,
      });

      const photo = await storage.createPhoto(photoData);
      res.status(201).json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Like a photo
  router.post("/photos/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.likePhoto(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to like photo" });
    }
  });

  // Get top words
  router.get("/words/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || "5");
      const words = await storage.getTopWords(limit);
      res.json(words);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top words" });
    }
  });

  // Get all words
  router.get("/words", async (req, res) => {
    try {
      const words = await storage.getAllWords();
      res.json(words);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch words" });
    }
  });

  // Get word by id
  router.get("/words/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const word = await storage.getWord(id);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch word" });
    }
  });

  // Create a new word
  router.post("/words", async (req, res) => {
    try {
      const body = wordPostSchema.safeParse(req.body);
      
      if (!body.success) {
        return res.status(400).json({ 
          message: "Invalid word data",
          errors: body.error.errors
        });
      }

      // In this simplified version, we'll use a sample user ID
      // In a real app, this would come from the authenticated user
      const userId = 2;

      const wordData = insertWordSchema.parse({
        original: req.body.original,
        translation: req.body.translation || "",
        description: req.body.description,
        userId,
      });

      const word = await storage.createWord(wordData);
      res.status(201).json(word);
    } catch (error) {
      res.status(500).json({ message: "Failed to create word" });
    }
  });

  // Like a word
  router.post("/words/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const word = await storage.likeWord(id);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      res.status(500).json({ message: "Failed to like word" });
    }
  });

  // Get all experiences
  router.get("/experiences", async (req, res) => {
    try {
      const experiences = await storage.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // Get experience by id
  router.get("/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.getExperience(id);
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  // Register the API routes
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
