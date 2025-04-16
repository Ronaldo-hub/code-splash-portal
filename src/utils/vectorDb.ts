
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

  constructor() {
    this.loadEmbeddingModel();
  }

  private async loadEmbeddingModel() {
    if (this.embeddingModel || this.isModelLoading) return;
    
    this.isModelLoading = true;
    try {
      console.log("Loading embedding model...");
      // Use a small, efficient embedding model
      this.embeddingModel = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
      console.log("Embedding model loaded successfully");
    } catch (error) {
      console.error("Error loading embedding model:", error);
    } finally {
      this.isModelLoading = false;
    }
  }

  async addDocument(doc: Omit<DocumentChunk, 'embedding'>) {
    await this.loadEmbeddingModel();
    
    if (!this.embeddingModel) {
      console.error("Embedding model not loaded, storing document without embedding");
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
        embedding: embedding.tolist()[0] // Get the array from tensor
      });
      
      console.log(`Added document: ${doc.id}`);
    } catch (error) {
      console.error("Error generating embedding:", error);
      // Still store the document even without embedding
      this.documents.push({...doc, embedding: []});
    }
  }

  async addDocuments(docs: Omit<DocumentChunk, 'embedding'>[]) {
    for (const doc of docs) {
      await this.addDocument(doc);
    }
  }

  async similaritySearch(query: string, topK: number = 3): Promise<DocumentChunk[]> {
    if (!this.embeddingModel) {
      await this.loadEmbeddingModel();
      if (!this.embeddingModel) {
        console.error("Embedding model not loaded, returning random documents");
        // Return random documents if embedding model is not available
        return this.documents.slice(0, Math.min(topK, this.documents.length));
      }
    }
    
    // Get query embedding
    const queryEmbedding = await this.embeddingModel(query, {
      pooling: "mean", 
      normalize: true
    });
    const queryVector = queryEmbedding.tolist()[0];
    
    // Calculate cosine similarity between query and all documents
    const scoredDocs = this.documents
      .filter(doc => doc.embedding && doc.embedding.length > 0)
      .map(doc => ({
        doc,
        score: this.cosineSimilarity(queryVector, doc.embedding!)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    return scoredDocs.map(item => item.doc);
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
}

// Create a singleton instance
export const vectorDb = new VectorDatabase();
