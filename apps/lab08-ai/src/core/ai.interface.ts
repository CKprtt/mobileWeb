import { Schema } from "firebase/ai";

export interface Base64Image {
  base64: string;
  mimeType: string;
}

export interface ImageAnalysisResult {
  caption: string;
  tags: string[];
  objects?: Array<{
    name: string;
    confidence?: number;
  }>;
  safety?: {
    isSensitive: boolean;
    notes?: string;
  };
}

export const imageAnalysisSchema = Schema.object({
  properties: {
    caption: Schema.string(),
    tags: Schema.array({ items: Schema.string() }),
    objects: Schema.array({
      items: Schema.object({
        properties: {
          name: Schema.string(),
          confidence: Schema.number(),
        },
        optionalProperties: ["confidence"],
      }),
    }),
    safety: Schema.object({
      properties: {
        isSensitive: Schema.boolean(),
        notes: Schema.string(),
      },
      optionalProperties: ["notes"],
    }),
  },
  optionalProperties: ["objects", "safety"],
});