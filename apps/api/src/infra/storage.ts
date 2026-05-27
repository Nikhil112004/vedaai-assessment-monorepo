import { promises as fs } from 'node:fs';
import path from 'node:path';

const storageRoot = path.resolve(__dirname, '..', '..', 'storage');
const uploadsDir = path.join(storageRoot, 'uploads');
const exportsDir = path.join(storageRoot, 'exports');

const sanitize = (name: string): string => name.replace(/[^a-zA-Z0-9._-]/g, '_');

export const ensureStorageDirs = async (): Promise<void> => {
  await Promise.all([fs.mkdir(uploadsDir, { recursive: true }), fs.mkdir(exportsDir, { recursive: true })]);
};

export const saveSourceFile = async (
  file: { originalname: string; buffer: Buffer }
): Promise<string> => {
  await ensureStorageDirs();
  const ext = path.extname(file.originalname) || '.bin';
  const base = sanitize(path.basename(file.originalname, ext));
  const filename = `${Date.now()}-${base}${ext}`;
  const targetPath = path.join(uploadsDir, filename);
  await fs.writeFile(targetPath, file.buffer);
  return targetPath;
};

export const getPdfPath = async (assignmentId: string): Promise<string> => {
  await ensureStorageDirs();
  return path.join(exportsDir, `${assignmentId}.pdf`);
};

const isPathInsideStorageRoot = (targetPath: string): boolean => {
  const resolvedTargetPath = path.resolve(targetPath);
  const relativePath = path.relative(storageRoot, resolvedTargetPath);
  return relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

export const removeStorageFileIfExists = async (filePath?: string | null): Promise<void> => {
  if (!filePath) return;

  if (!isPathInsideStorageRoot(filePath)) {
    console.warn(`[storage] Skipping cleanup outside storage root: ${filePath}`);
    return;
  }

  try {
    await fs.unlink(path.resolve(filePath));
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return;
    }
    throw error;
  }
};
