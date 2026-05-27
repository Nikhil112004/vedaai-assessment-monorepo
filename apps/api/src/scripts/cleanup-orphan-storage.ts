import { promises as fs } from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { config } from '../config';
import { AssignmentModel, GeneratedPaperModel } from '../models';

const storageRoot = path.resolve(__dirname, '..', '..', 'storage');
const uploadsDir = path.join(storageRoot, 'uploads');
const exportsDir = path.join(storageRoot, 'exports');

const shouldExecute = process.argv.includes('--execute');
const isDryRun = !shouldExecute || process.argv.includes('--dry-run');

const normalizePathKey = (targetPath: string): string => {
  const resolved = path.resolve(targetPath);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
};

const listFilesRecursive = async (targetDir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(targetDir, entry.name);
        if (entry.isDirectory()) {
          return listFilesRecursive(entryPath);
        }
        return [entryPath];
      })
    );
    return nested.flat();
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const unlinkIfExists = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') return;
    throw error;
  }
};

const run = async (): Promise<void> => {
  await mongoose.connect(config.mongoUri);

  try {
    const [assignments, generatedPapers, uploadFiles, exportFiles] = await Promise.all([
      AssignmentModel.find({})
        .select({ sourceFile: 1 })
        .lean<Array<{ sourceFile?: { storedPath?: string | null } | null }>>(),
      GeneratedPaperModel.find({})
        .select({ pdf: 1 })
        .lean<Array<{ pdf?: { filePath?: string | null } | null }>>(),
      listFilesRecursive(uploadsDir),
      listFilesRecursive(exportsDir),
    ]);

    const referencedPathSet = new Set<string>();

    for (const assignment of assignments) {
      const sourcePath = assignment.sourceFile?.storedPath;
      if (!sourcePath) continue;
      referencedPathSet.add(normalizePathKey(sourcePath));
    }

    for (const generatedPaper of generatedPapers) {
      const pdfPath = generatedPaper.pdf?.filePath;
      if (!pdfPath) continue;
      referencedPathSet.add(normalizePathKey(pdfPath));
    }

    const storageFiles = [...uploadFiles, ...exportFiles];
    const orphanFiles = storageFiles.filter((filePath) => {
      return !referencedPathSet.has(normalizePathKey(filePath));
    });

    console.info(`[cleanup-storage] Mode: ${isDryRun ? 'dry-run' : 'execute'}`);
    console.info(`[cleanup-storage] Referenced paths in DB: ${referencedPathSet.size}`);
    console.info(`[cleanup-storage] Files in storage: ${storageFiles.length}`);
    console.info(`[cleanup-storage] Orphan files detected: ${orphanFiles.length}`);

    if (orphanFiles.length > 0) {
      orphanFiles.forEach((filePath) => {
        const relative = path.relative(storageRoot, filePath);
        console.info(` - ${relative}`);
      });
    }

    if (isDryRun) {
      console.info('[cleanup-storage] Dry run complete. No files were deleted.');
      return;
    }

    await Promise.all(orphanFiles.map((filePath) => unlinkIfExists(filePath)));
    console.info('[cleanup-storage] Orphan files deleted successfully.');
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error('[cleanup-storage] Failed', error);
  process.exit(1);
});
