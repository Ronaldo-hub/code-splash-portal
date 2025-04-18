
export interface GenerationOptions {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export interface DocumentWithSource {
  text: string;
  source: string;
}
