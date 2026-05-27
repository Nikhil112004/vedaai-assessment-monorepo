import { z } from 'zod';

export type GenerationQuestion = {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
};

export type GenerationSection = {
  title: string;
  instruction: string;
  questions: GenerationQuestion[];
};

export type GenerationMetadata = {
  subject: string;
  className: string;
  durationText: string;
};

export type GeneratedPaperPayload = {
  metadata: GenerationMetadata;
  sections: GenerationSection[];
};

export const generationMetadataSchema = z.object({
  subject: z.string().trim().min(1),
  className: z.string().trim().min(1),
  durationText: z.string().trim().min(1),
}).strict();

export const generationQuestionSchema = z.object({
  text: z.string().trim().min(3),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().int().min(1),
}).strict();

export const generationSectionSchema = z.object({
  title: z.string().trim().min(1),
  instruction: z.string().trim().min(1),
  questions: z.array(generationQuestionSchema).min(1),
}).strict();

export const generatedPaperPayloadSchema = z.object({
  metadata: generationMetadataSchema,
  sections: z.array(generationSectionSchema).min(1),
}).strict();

export const generatedPaperJsonSchema = {
  name: 'generated_question_paper',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      metadata: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            description: 'Subject inferred from source material, filename, or teacher instructions. Use General only when unknown.',
          },
          className: {
            type: 'string',
            description: 'Class, grade, or standard inferred from source material, filename, or teacher instructions. Use N/A only when unknown.',
          },
          durationText: {
            type: 'string',
            description: 'Exam duration inferred from teacher instructions. Use N/A only when unknown.',
          },
        },
        required: ['subject', 'className', 'durationText'],
        additionalProperties: false,
      },
      sections: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Section title, for example Section A.',
            },
            instruction: {
              type: 'string',
              description: 'Instruction for this section.',
            },
            questions: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: 'The question text only, without marks or difficulty labels.',
                  },
                  difficulty: {
                    type: 'string',
                    enum: ['easy', 'medium', 'hard'],
                  },
                  marks: {
                    type: 'integer',
                    minimum: 1,
                  },
                },
                required: ['text', 'difficulty', 'marks'],
                additionalProperties: false,
              },
            },
          },
          required: ['title', 'instruction', 'questions'],
          additionalProperties: false,
        },
      },
    },
    required: ['metadata', 'sections'],
    additionalProperties: false,
  },
} as const;
