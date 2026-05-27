import { inflateSync } from 'node:zlib';

const defaultMaxOutputLength = 12000;
const streamPattern = /stream[\r\n]+([\s\S]*?)endstream/g;

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const decodePdfLiteralString = (value: string): string => {
  let decoded = '';

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char !== '\\') {
      decoded += char;
      continue;
    }

    const next = value[index + 1];
    if (!next) break;

    if (/[0-7]/.test(next)) {
      let octal = next;
      let cursor = index + 2;

      while (octal.length < 3 && cursor < value.length) {
        const digit = value[cursor];
        if (!digit || !/[0-7]/.test(digit)) break;
        octal += digit;
        cursor += 1;
      }

      decoded += String.fromCharCode(parseInt(octal, 8));
      index += octal.length;
      continue;
    }

    if (next === '\r') {
      if (value[index + 2] === '\n') {
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }
    if (next === '\n') {
      index += 1;
      continue;
    }

    const escapedCharacterMap: Record<string, string> = {
      n: '\n',
      r: '\r',
      t: '\t',
      b: '\b',
      f: '\f',
      '\\': '\\',
      '(': '(',
      ')': ')',
    };

    decoded += escapedCharacterMap[next] ?? next;
    index += 1;
  }

  return decoded;
};

const decodeUtf16Be = (buffer: Buffer): string => {
  let decoded = '';
  const safeLength = buffer.length - (buffer.length % 2);

  for (let index = 0; index < safeLength; index += 2) {
    const highByte = buffer[index] ?? 0;
    const lowByte = buffer[index + 1] ?? 0;
    const codePoint = (highByte << 8) | lowByte;
    decoded += String.fromCharCode(codePoint);
  }

  return decoded;
};

const decodePdfHexString = (value: string): string => {
  const sanitized = value.replace(/\s+/g, '');
  if (sanitized.length === 0 || sanitized.length % 2 !== 0) return '';

  const bytes = Buffer.from(sanitized, 'hex');
  const hasUtf16Bom = bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff;

  if (hasUtf16Bom) {
    return decodeUtf16Be(bytes.subarray(2));
  }

  const zeroBytesOnEvenOffsets = bytes.reduce((count, entry, index) => {
    if (index % 2 === 0 && entry === 0) return count + 1;
    return count;
  }, 0);
  const likelyUtf16Be = bytes.length >= 4 && zeroBytesOnEvenOffsets >= Math.floor(bytes.length / 4);

  if (likelyUtf16Be) {
    return decodeUtf16Be(bytes);
  }

  return bytes.toString('utf8');
};

const extractOperandsFromContent = (content: string): string[] => {
  const extractedValues: string[] = [];

  const literalTextPattern = /\(((?:\\.|[^\\)])*)\)\s*Tj/g;
  for (const match of content.matchAll(literalTextPattern)) {
    const rawValue = match[1] ?? '';
    const decoded = normalizeWhitespace(decodePdfLiteralString(rawValue));
    if (decoded) extractedValues.push(decoded);
  }

  const hexTextPattern = /<([0-9A-Fa-f\s]+)>\s*Tj/g;
  for (const match of content.matchAll(hexTextPattern)) {
    const rawValue = match[1] ?? '';
    const decoded = normalizeWhitespace(decodePdfHexString(rawValue));
    if (decoded) extractedValues.push(decoded);
  }

  const textArrayPattern = /\[(.*?)\]\s*TJ/gs;
  for (const match of content.matchAll(textArrayPattern)) {
    const arrayBody = match[1] ?? '';
    let arrayText = '';

    const literalArrayPattern = /\(((?:\\.|[^\\)])*)\)/g;
    for (const literalChunk of arrayBody.matchAll(literalArrayPattern)) {
      arrayText += decodePdfLiteralString(literalChunk[1] ?? '');
    }

    const hexArrayPattern = /<([0-9A-Fa-f\s]+)>/g;
    for (const hexChunk of arrayBody.matchAll(hexArrayPattern)) {
      arrayText += decodePdfHexString(hexChunk[1] ?? '');
    }

    const normalized = normalizeWhitespace(arrayText);
    if (normalized) extractedValues.push(normalized);
  }

  return extractedValues;
};

const trimStreamBuffer = (value: Buffer): Buffer => {
  let start = 0;
  let end = value.length;

  while (start < end && (value[start] === 0x0a || value[start] === 0x0d)) {
    start += 1;
  }
  while (end > start && (value[end - 1] === 0x0a || value[end - 1] === 0x0d)) {
    end -= 1;
  }

  return value.subarray(start, end);
};

export const extractTextFromPdfBuffer = (
  pdfBuffer: Buffer,
  maxOutputLength: number = defaultMaxOutputLength
): string | null => {
  const binaryPdf = pdfBuffer.toString('latin1');
  const extractedChunks: string[] = [];

  for (const match of binaryPdf.matchAll(streamPattern)) {
    const streamRaw = match[1] ?? '';
    const matchIndex = match.index ?? 0;
    const streamContext = binaryPdf.slice(Math.max(0, matchIndex - 250), matchIndex);

    const candidates: Buffer[] = [];
    const rawBuffer = trimStreamBuffer(Buffer.from(streamRaw, 'latin1'));
    if (rawBuffer.length > 0) {
      candidates.push(rawBuffer);
    }

    const hasFlateDecode = streamContext.includes('/FlateDecode');
    if (hasFlateDecode || (rawBuffer[0] === 0x78 && rawBuffer.length > 2)) {
      try {
        const inflated = inflateSync(rawBuffer);
        if (inflated.length > 0) {
          candidates.push(inflated);
        }
      } catch {
        // Ignore inflate errors and continue with other streams.
      }
    }

    for (const candidate of candidates) {
      const streamText = candidate.toString('latin1');
      extractedChunks.push(...extractOperandsFromContent(streamText));
    }
  }

  if (extractedChunks.length === 0) {
    extractedChunks.push(...extractOperandsFromContent(binaryPdf));
  }

  const uniqueChunks = Array.from(new Set(extractedChunks));
  const joinedText = uniqueChunks.join('\n').slice(0, maxOutputLength);
  const normalizedText = normalizeWhitespace(joinedText);

  return normalizedText || null;
};
