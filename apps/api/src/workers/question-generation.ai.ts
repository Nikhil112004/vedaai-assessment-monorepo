import { assignmentQuestionTypes } from '../models';
import { config } from '../config';
import {
  generatedPaperJsonSchema,
  generatedPaperPayloadSchema,
  type GeneratedPaperPayload,
} from './question-generation.types';

const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

type AssignmentForGeneration = {
  dueDate: Date | string;
  questionTypes: string[];
  questionTypeConfig?: Array<{
    questionType: string;
    questionCount: number;
    marks: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  sourceText?: string | null;
  sourceFile?: {
    filename?: string | null;
    mimeType?: string | null;
  } | null;
};

type NormalizedQuestionTypeConfig = {
  questionType: string;
  questionCount: number;
  marks: number;
};

const distributeCounts = (total: number, buckets: number): number[] => {
  if (buckets <= 0) return [total];
  const base = Math.floor(total / buckets);
  const remainder = total % buckets;
  return Array.from({ length: buckets }).map((_, index) => base + (index < remainder ? 1 : 0));
};

const knownSubjects = [
  'Mathematics',
  'Math',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'History',
  'Geography',
  'Civics',
  'Economics',
  'Computer Science',
  'Social Science',
] as const;

const normalizeQuestionTypes = (questionTypes: string[]): string[] => {
  const safe = new Set(assignmentQuestionTypes);
  const filtered = questionTypes.filter((value) => safe.has(value as (typeof assignmentQuestionTypes)[number]));
  return filtered.length > 0 ? filtered : ['short_answer'];
};

const normalizeQuestionTypeConfig = (
  assignment: AssignmentForGeneration,
  normalizedTypes: string[]
): NormalizedQuestionTypeConfig[] => {
  const safe = new Set(assignmentQuestionTypes);
  const providedConfigMap = new Map<string, NormalizedQuestionTypeConfig>();

  for (const entry of assignment.questionTypeConfig ?? []) {
    const questionType = String(entry.questionType ?? '').trim();
    if (!safe.has(questionType as (typeof assignmentQuestionTypes)[number])) continue;

    const questionCount = Number(entry.questionCount);
    const marks = Number(entry.marks);
    if (!Number.isInteger(questionCount) || questionCount < 1) continue;
    if (!Number.isInteger(marks) || marks < 1) continue;

    if (!providedConfigMap.has(questionType)) {
      providedConfigMap.set(questionType, { questionType, questionCount, marks });
    }
  }

  const totalQuestions = Math.max(1, assignment.totalQuestions);
  const totalMarks = Math.max(totalQuestions, assignment.totalMarks);
  const fallbackQuestionCounts = distributeCounts(totalQuestions, normalizedTypes.length);
  const fallbackSectionMarks = distributeCounts(totalMarks, normalizedTypes.length);

  return normalizedTypes.map((questionType, sectionIndex) => {
    const provided = providedConfigMap.get(questionType);
    if (provided) return provided;

    const questionCount = Math.max(1, fallbackQuestionCounts[sectionIndex] ?? 1);
    const sectionMarks = Math.max(questionCount, fallbackSectionMarks[sectionIndex] ?? questionCount);
    const marks = Math.max(1, Math.floor(sectionMarks / questionCount));
    return { questionType, questionCount, marks };
  });
};

const buildInferenceContext = (assignment: AssignmentForGeneration): string => {
  return [
    assignment.instructions,
    assignment.sourceText ?? '',
    assignment.sourceFile?.filename ?? '',
  ].join('\n');
};

const extractFirstMatch = (value: string, patterns: RegExp[]): string | null => {
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
    if (match?.[2]) {
      return match[2].trim();
    }
  }
  return null;
};

const inferSubject = (context: string): string => {
  const explicitSubject = extractFirstMatch(context, [
    /subject\s*[:=-]\s*([a-zA-Z ]{3,40})/i,
    /\b(?:paper|exam|worksheet)\s+(?:for|of)\s+([a-zA-Z ]{3,40})/i,
  ]);
  if (explicitSubject) return explicitSubject;

  const normalized = context.toLowerCase();
  const subject = knownSubjects.find((entry) => normalized.includes(entry.toLowerCase()));
  return subject ?? 'General';
};

const inferClassName = (context: string): string => {
  const className = extractFirstMatch(context, [
    /\bclass\s*[:=-]?\s*([0-9]{1,2}|[ivxlcdm]{1,8}|[a-zA-Z ]{3,30})/i,
    /\bgrade\s*[:=-]?\s*([0-9]{1,2}|[a-zA-Z ]{3,30})/i,
    /\bstd\.?\s*[:=-]?\s*([0-9]{1,2}|[ivxlcdm]{1,8})/i,
  ]);
  return className ?? 'N/A';
};

const inferDuration = (context: string): string => {
  const duration = extractFirstMatch(context, [
    /\b(?:time allowed|duration|exam duration)\s*[:=-]\s*([0-9.]+\s*(?:hour|hours|hr|hrs|minutes|mins|min))/i,
    /\b([0-9.]+\s*(?:hour|hours|hr|hrs|minutes|mins|min))\s+(?:exam|test|paper)/i,
  ]);
  return duration ?? 'N/A';
};

const inferMetadata = (assignment: AssignmentForGeneration): GeneratedPaperPayload['metadata'] => {
  const context = buildInferenceContext(assignment);
  return {
    subject: inferSubject(context),
    className: inferClassName(context),
    durationText: inferDuration(context),
  };
};

const buildPrompt = (assignment: AssignmentForGeneration): string => {
  const normalizedTypes = normalizeQuestionTypes(assignment.questionTypes);
  const normalizedConfig = normalizeQuestionTypeConfig(assignment, normalizedTypes);
  const questionTypes = normalizedTypes.join(', ');
  const sectionPlan = normalizedConfig
    .map(
      (config, index) =>
        `Section ${String.fromCharCode(65 + index)} -> ${config.questionType} (${config.questionCount} questions, ${config.marks} marks each)`
    )
    .join('; ');

  return [
    `Create an exam paper for due date ${new Date(assignment.dueDate).toISOString()}.`,
    `Question types: ${questionTypes}.`,
    `Total questions: ${assignment.totalQuestions}.`,
    `Total marks: ${assignment.totalMarks}.`,
    `Instructions: ${assignment.instructions}.`,
    assignment.sourceFile?.filename ? `Source filename: ${assignment.sourceFile.filename}.` : '',
    assignment.sourceText ? `Source material text: ${assignment.sourceText.slice(0, 4000)}.` : '',
    `Section mapping: ${sectionPlan}.`,
    'Infer metadata.subject, metadata.className, and metadata.durationText from source material, source filename, and instructions.',
    'Follow the section mapping exactly for question count and marks-per-question.',
    'Return the generated paper using the supplied JSON schema.',
    'Rules: return at least one section; every question must include text, difficulty and positive integer marks.',
  ].filter(Boolean).join(' ');
};

const buildSectionTitle = (index: number): string => `Section ${String.fromCharCode(65 + index)}`;

const enforceQuestionTypeConfigOnSections = (
  sections: GeneratedPaperPayload['sections'],
  assignment: AssignmentForGeneration
): GeneratedPaperPayload['sections'] => {
  const normalizedTypes = normalizeQuestionTypes(assignment.questionTypes);
  const sectionConfig = normalizeQuestionTypeConfig(assignment, normalizedTypes);
  const fallbackQuestion = sections.flatMap((section) => section.questions)[0];

  return sectionConfig.map((config, sectionIndex) => {
    const sourceSection = sections[sectionIndex];
    const sourceQuestions = sourceSection?.questions ?? [];

    const instruction =
      sourceSection?.instruction?.trim() ||
      (sectionIndex % 2 === 0 ? 'Attempt all questions.' : 'Answer any questions as instructed.');

    const questions = Array.from({ length: config.questionCount }).map((_, questionIndex) => {
      const sourceQuestion =
        sourceQuestions[questionIndex] ??
        sourceQuestions[sourceQuestions.length - 1] ??
        fallbackQuestion;
      const fallbackText = `Q${questionIndex + 1}. ${assignment.instructions} (Type: ${config.questionType})`;

      return {
        text: sourceQuestion?.text?.trim() || fallbackText,
        difficulty: sourceQuestion?.difficulty ?? difficulties[(sectionIndex + questionIndex) % difficulties.length] ?? 'easy',
        marks: config.marks,
      };
    });

    return {
      title: sourceSection?.title?.trim() || buildSectionTitle(sectionIndex),
      instruction,
      questions,
    };
  });
};

const generateFallbackPaper = (assignment: AssignmentForGeneration): GeneratedPaperPayload => {
  const normalizedTypes = normalizeQuestionTypes(assignment.questionTypes);
  const normalizedConfig = normalizeQuestionTypeConfig(assignment, normalizedTypes);

  const sections = normalizedConfig.map((config, sectionIndex) => {
    const questions = Array.from({ length: config.questionCount }).map((_, questionIndex) => ({
      text: `Q${questionIndex + 1}. ${assignment.instructions} (Type: ${config.questionType})`,
      difficulty: difficulties[(sectionIndex + questionIndex) % difficulties.length] ?? 'easy',
      marks: config.marks,
    }));

    return {
      title: buildSectionTitle(sectionIndex),
      instruction: sectionIndex % 2 === 0 ? 'Attempt all questions.' : 'Answer any questions as instructed.',
      questions,
    };
  });

  return { metadata: inferMetadata(assignment), sections };
};

const parseAndValidateStructuredPaper = (content: string): GeneratedPaperPayload | null => {
  try {
    const parsed = JSON.parse(content) as unknown;
    const validated = generatedPaperPayloadSchema.safeParse(parsed);
    if (!validated.success) {
      return null;
    }
    return validated.data;
  } catch {
    return null;
  }
};

export const generateStructuredPaper = async (
  assignment: AssignmentForGeneration
): Promise<GeneratedPaperPayload> => {
  const prompt = buildPrompt(assignment);

  if (!config.groqApiKey) {
    return generateFallbackPaper(assignment);
  }

  try {
    const response = await fetch(config.groqApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.groqApiKey}`,
      },
      body: JSON.stringify({
        model: config.groqModel,
        temperature: 0.2,
        response_format: {
          type: 'json_schema',
          json_schema: generatedPaperJsonSchema,
        },
        messages: [
          {
            role: 'system',
            content:
              'You are an exam generator. Return a structured question paper that exactly follows the supplied JSON schema.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      return generateFallbackPaper(assignment);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content ?? '';
    const parsed = parseAndValidateStructuredPaper(content);
    if (!parsed) {
      return generateFallbackPaper(assignment);
    }

    const normalizedSections = enforceQuestionTypeConfigOnSections(parsed.sections, assignment);
    const inferredMetadata = inferMetadata(assignment);

    return {
      metadata: {
        subject: parsed.metadata.subject || inferredMetadata.subject,
        className: parsed.metadata.className || inferredMetadata.className,
        durationText: parsed.metadata.durationText || inferredMetadata.durationText,
      },
      sections: normalizedSections,
    };
  } catch {
    return generateFallbackPaper(assignment);
  }
};
