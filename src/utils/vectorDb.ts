
import { pipeline } from "@huggingface/transformers";

// Interface for our vector database entries
export interface DocumentChunk {
  id: string;
  text: string;
  source: string;
  date: string;
  embedding?: number[];
}

// Simple in-memory vector database
export class VectorDatabase {
  private documents: DocumentChunk[] = [];
  private embeddingModel: any = null;
  private isModelLoading: boolean = false;
  private modelLoadAttempts: number = 0;
  private readonly MAX_LOAD_ATTEMPTS = 3;

  constructor() {
    this.loadEmbeddingModel();
  }

  private async loadEmbeddingModel() {
    if (this.embeddingModel || this.isModelLoading) return;
    
    this.isModelLoading = true;
    try {
      console.log("Loading embedding model...");
      
      // Using a smaller, more reliable model for embeddings
      this.embeddingModel = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        { 
          quantized: true, // Use quantized model for better performance
          progress_callback: (progress) => {
            console.log(`Embedding model loading progress: ${Math.round(progress.progress * 100)}%`);
          }
        }
      );
      
      this.modelLoadAttempts = 0; // Reset attempts on successful load
      console.log("Embedding model loaded successfully");
    } catch (error) {
      this.modelLoadAttempts++;
      console.error(`Error loading embedding model (attempt ${this.modelLoadAttempts}/${this.MAX_LOAD_ATTEMPTS}):`, error);
      
      if (this.modelLoadAttempts < this.MAX_LOAD_ATTEMPTS) {
        console.log(`Retrying embedding model load in 3 seconds...`);
        // Retry after a delay
        setTimeout(() => {
          this.isModelLoading = false;
          this.loadEmbeddingModel();
        }, 3000);
      } else {
        console.error("Max embedding model load attempts reached. Using fallback approach.");
      }
    } finally {
      if (this.modelLoadAttempts >= this.MAX_LOAD_ATTEMPTS || this.embeddingModel) {
        this.isModelLoading = false;
      }
    }
  }

  async addDocument(doc: Omit<DocumentChunk, 'embedding'>) {
    // Try to ensure model is loaded
    if (!this.embeddingModel && !this.isModelLoading && this.modelLoadAttempts < this.MAX_LOAD_ATTEMPTS) {
      await this.loadEmbeddingModel();
    }
    
    if (!this.embeddingModel) {
      console.warn("Embedding model not loaded, storing document without embedding");
      this.documents.push({...doc, embedding: []});
      return;
    }
    
    try {
      // Generate embedding for the document text
      const embedding = await this.embeddingModel(doc.text, {
        pooling: "mean", 
        normalize: true
      });
      
      // Store document with its embedding
      this.documents.push({
        ...doc,
        embedding: Array.from(embedding.data)
      });
      
      console.log(`Added document: ${doc.id}`);
    } catch (error) {
      console.error("Error generating embedding:", error);
      // Still store the document even without embedding
      this.documents.push({...doc, embedding: []});
    }
  }

  async addDocuments(docs: Omit<DocumentChunk, 'embedding'>[]) {
    // Ensure model is loaded first before processing multiple documents
    if (!this.embeddingModel && !this.isModelLoading && this.modelLoadAttempts < this.MAX_LOAD_ATTEMPTS) {
      await this.loadEmbeddingModel();
    }
    
    for (const doc of docs) {
      await this.addDocument(doc);
    }
  }

  async similaritySearch(query: string, topK: number = 3): Promise<DocumentChunk[]> {
    // Ensure model is loaded
    if (!this.embeddingModel && !this.isModelLoading && this.modelLoadAttempts < this.MAX_LOAD_ATTEMPTS) {
      await this.loadEmbeddingModel();
    }
    
    if (!this.embeddingModel) {
      console.warn("Embedding model not loaded, returning random documents");
      // Return random documents if embedding model is not available
      return this.documents
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(topK, this.documents.length));
    }
    
    try {
      // Get query embedding
      const queryEmbedding = await this.embeddingModel(query, {
        pooling: "mean", 
        normalize: true
      });
      
      const queryVector = Array.from(queryEmbedding.data);
      
      // Calculate cosine similarity between query and all documents
      const scoredDocs = this.documents
        .filter(doc => doc.embedding && doc.embedding.length > 0)
        .map(doc => ({
          doc,
          score: this.cosineSimilarity(queryVector, doc.embedding!),
          // Apply weighting based on source (70% for website, 30% for X)
          weightedScore: this.getSourceWeight(doc.source) * this.cosineSimilarity(queryVector, doc.embedding!)
        }))
        .sort((a, b) => b.weightedScore - a.weightedScore)
        .slice(0, topK);
      
      return scoredDocs.map(item => item.doc);
    } catch (error) {
      console.error("Error in similarity search:", error);
      // Fallback to returning random documents
      return this.documents
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(topK, this.documents.length));
    }
  }

  // Apply source weighting: 70% for website, 30% for X
  private getSourceWeight(source: string): number {
    if (source.includes('khoisanvoice.carrd.co')) {
      return 0.7; // Website content is weighted higher
    } else if (source.includes('x.com') || source.includes('twitter.com')) {
      return 0.3; // X posts weighted lower
    }
    return 0.5; // Default weight for other sources
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must be of the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getAllDocuments(): DocumentChunk[] {
    return this.documents;
  }

  clearDocuments() {
    this.documents = [];
  }

  getDocumentCount(): number {
    return this.documents.length;
  }
  
  isModelReady(): boolean {
    return !!this.embeddingModel;
  }
  
  isLoadingModel(): boolean {
    return this.isModelLoading;
  }
}

// Create a singleton instance
export const vectorDb = new VectorDatabase();
