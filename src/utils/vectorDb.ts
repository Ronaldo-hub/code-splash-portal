
import { pipeline, env } from "@huggingface/transformers";
import { toast } from "sonner";
import { DocumentWithSource } from "./types/ragTypes";
import { huggingFaceConfig } from "./apiConfig";

// Configure transformers.js to use CDN
env.allowLocalModels = false;
env.useBrowserCache = true;

// Use the model from config with a fallback
const EMBEDDING_MODEL = huggingFaceConfig.model || "Xenova/all-MiniLM-L6-v2";
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

export interface DocumentChunk extends DocumentWithSource {
  embedding?: number[];
  id?: string;
  date?: string;
}

class VectorDatabase {
  private documents: DocumentChunk[] = [];
  private embeddingPipeline: any = null;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private initialized: boolean = false;

  constructor() {
    // Delay initialization to ensure HuggingFace config is loaded
    setTimeout(() => this.initEmbeddingModel(), 1000);
  }

  private async initEmbeddingModel(attempt: number = 1): Promise<void> {
    if (this.isInitializing) {
      return this.initializationPromise;
    }

    this.isInitializing = true;
    
    this.initializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log(`Initializing embedding model (attempt ${attempt}/${MAX_RETRY_ATTEMPTS})...`);
        console.log(`Using API key: ${huggingFaceConfig.apiKey.substring(0, 5)}...`);
        toast.info("Loading Khoisan knowledge base...");

        // Use the feature-extraction pipeline with the compact model
        this.embeddingPipeline = await pipeline(
          "feature-extraction",
          EMBEDDING_MODEL,
          {
            revision: "main",
            // Progress callback to show loading status
            progress_callback: (info: any) => {
              if (info.status === 'progress') {
                const percentComplete = Math.round(info.value * 100);
                console.log(`Loading model: ${percentComplete}%`);
              }
            }
          }
        );

        console.log("Embedding model initialized successfully");
        toast.success("Khoisan knowledge base ready");
        this.isInitializing = false;
        this.initialized = true;
        resolve();
      } catch (error) {
        console.error("Error initializing embedding model:", error);
        
        if (attempt < MAX_RETRY_ATTEMPTS) {
          console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
          setTimeout(() => {
            this.isInitializing = false;
            this.initEmbeddingModel(attempt + 1)
              .then(resolve)
              .catch(reject);
          }, RETRY_DELAY_MS);
        } else {
          toast.error("Failed to load Khoisan knowledge base");
          this.isInitializing = false;
          reject(error);
        }
      }
    });

    return this.initializationPromise;
  }

  public async addDocuments(docs: DocumentChunk[]): Promise<void> {
    // Initialize the model if it's not already initialized
    if (!this.embeddingPipeline) {
      try {
        await this.initEmbeddingModel();
      } catch (error) {
        console.error("Failed to initialize embedding model for adding documents:", error);
        toast.error("Unable to add documents to knowledge base");
        
        // Store documents without embeddings for now
        this.documents = [...this.documents, ...docs];
        return;
      }
    }

    try {
      // Process documents in batches to avoid overloading the browser
      const batchSize = 5;
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize);
        
        // Create embeddings for each document in parallel
        await Promise.all(batch.map(async (doc) => {
          if (!doc.text) {
            console.warn("Document missing text content:", doc);
            return;
          }

          // Ensure id and date are set if not provided
          doc.id = doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          doc.date = doc.date || new Date().toISOString();
          
          try {
            // Create embedding for the document text
            const result = await this.embeddingPipeline(doc.text, {
              pooling: "mean",
              normalize: true
            });
            
            // Extract the embedding data
            const embedding = Array.from(result.data) as number[];
            
            // Store the document with its embedding
            this.documents.push({
              ...doc,
              embedding
            });
            
            console.log(`Added document: ${doc.id} (${doc.text.substring(0, 30)}...)`);
          } catch (error) {
            console.error(`Failed to create embedding for document ${doc.id}:`, error);
            // Add document without embedding as fallback
            this.documents.push(doc);
          }
        }));

        console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(docs.length / batchSize)}`);
      }
      
      console.log(`Added ${this.documents.length} documents to vector database`);
    } catch (error) {
      console.error("Error adding documents:", error);
      // Add documents without embeddings as fallback
      this.documents = [...this.documents, ...docs];
      toast.error("Failed to index all Khoisan knowledge base documents");
    }
  }

  public clearDocuments(): void {
    this.documents = [];
    console.log("Vector database cleared");
  }

  public getDocumentCount(): number {
    return this.documents.length;
  }

  public getAllDocuments(): DocumentChunk[] {
    return this.documents;
  }

  public async similaritySearch(query: string, k: number = 3): Promise<DocumentWithSource[]> {
    if (this.documents.length === 0) {
      console.warn("No documents in vector database for similarity search");
      return [];
    }

    // Special case for mandate-related queries - return predefined documents
    if (query.toLowerCase().includes("mandate")) {
      console.log("Mandate query detected, returning predefined documents");
      const mandateDocs = this.documents.filter(doc => 
        doc.text.toLowerCase().includes("mandate") || 
        doc.source === "Khoisan Mandate"
      );
      
      // Return mandate docs if found, otherwise continue with similarity search
      if (mandateDocs.length > 0) {
        return mandateDocs.slice(0, k).map(({id, text, source, date}) => ({
          id, text, source, date
        }));
      }
    }

    if (!this.embeddingPipeline) {
      try {
        await this.initEmbeddingModel();
      } catch (error) {
        console.error("Failed to initialize embedding model for similarity search:", error);
        
        // Return the first k documents as fallback
        return this.documents.slice(0, k).map(({id, text, source, date}) => ({
          id, text, source, date
        }));
      }
    }

    try {
      // Create embedding for the query
      const result = await this.embeddingPipeline(query, {
        pooling: "mean",
        normalize: true
      });
      
      const queryEmbedding = Array.from(result.data) as number[];

      // Calculate cosine similarity for each document that has embeddings
      const similarities = this.documents.map((doc, index) => {
        if (!doc.embedding) {
          return { index, similarity: 0 };
        }
        
        const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
        return { index, similarity };
      });

      // Sort by similarity (highest first) and take top k
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topK = similarities.slice(0, k);

      // Return documents
      return topK.map(({ index }) => {
        const { id, text, source, date } = this.documents[index];
        return { id, text, source, date };
      });
    } catch (error) {
      console.error("Error during similarity search:", error);
      // Return a random selection of documents as fallback
      const randomDocs = [...this.documents].sort(() => 0.5 - Math.random()).slice(0, k);
      return randomDocs.map(({id, text, source, date}) => ({
        id, text, source, date
      }));
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      console.error("Vectors must have the same length");
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    // Prevent division by zero
    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const vectorDb = new VectorDatabase();
