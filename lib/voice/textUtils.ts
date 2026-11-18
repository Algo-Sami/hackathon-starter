/**
 * Text utility helpers for voice processing, script detection, and TTS chunking.
 */

// Unicode ranges for Arabic/Urdu scripts:
// \u0600-\u06FF (Arabic / Urdu main block)
// \u0750-\u077F (Arabic Supplement, including Urdu additional characters)
// \uFB50-\uFDFF (Arabic Presentation Forms-A)
// \uFE70-\uFEFF (Arabic Presentation Forms-B)
const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_SCRIPT_REGEX = /[A-Za-z]/;

/**
 * Detects whether the text is predominantly Arabic/Urdu script or Latin/English script.
 * For mixed-language selections, uses the dominant script.
 */
export function detectDominantScript(text: string): "ur" | "en" {
  let arabicCount = 0;
  let latinCount = 0;

  for (const char of text) {
    if (ARABIC_SCRIPT_REGEX.test(char)) {
      arabicCount++;
    } else if (LATIN_SCRIPT_REGEX.test(char)) {
      latinCount++;
    }
  }

  // If there are more Arabic script characters than Latin, treat as Urdu
  return arabicCount > latinCount ? "ur" : "en";
}

/**
 * Checks if a string contains any Arabic-script characters (used for server-side validation).
 */
export function containsArabicScript(text: string): boolean {
  return ARABIC_SCRIPT_REGEX.test(text);
}

/**
 * Cleans text for Text-to-Speech:
 * - Removes markdown symbols (headers, bold, italics, code blocks, links)
 * - Removes URLs
 * - Removes emojis and pictorial symbols
 * - Collapses consecutive whitespace
 */
export function cleanTextForSpeech(rawText: string): string {
  let cleaned = rawText;

  // Remove markdown code blocks & inline code
  cleaned = cleaned.replace(/```[\s\S]*?```/g, " ");
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // Remove markdown links [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove remaining bare URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, " ");

  // Remove markdown headings, blockquotes, bullets, horizontal rules
  cleaned = cleaned.replace(/^[\s]*[#*>-]+\s+/gm, " ");

  // Remove markdown emphasis markers (*, _, ~)
  cleaned = cleaned.replace(/[*_~]+/g, " ");

  // Remove emojis and pictographs using Unicode property escape
  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, " ");
  } catch {
    // Fallback for environments lacking Extended_Pictographic
    cleaned = cleaned.replace(
      /(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      " "
    );
  }

  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Splits text into sentence-aware chunks of at most `maxChunkLength` characters.
 * Never cuts a word in half. Prefers splitting on sentence terminals (. ! ?),
 * then commas/semicolons, then whitespace.
 */
export function chunkTextForTTS(
  text: string,
  maxChunkLength = 180
): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];
  if (cleaned.length <= maxChunkLength) return [cleaned];

  const chunks: string[] = [];

  // Split text into coarse sentence segments
  // Match sentences ending with punctuation or newlines
  const rawSentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];

  let currentChunk = "";

  for (const rawSentence of rawSentences) {
    const sentence = rawSentence.trim();
    if (!sentence) continue;

    // If adding this sentence fits in the current chunk, append it
    if (currentChunk && (currentChunk + " " + sentence).length <= maxChunkLength) {
      currentChunk += " " + sentence;
      continue;
    }

    // If currentChunk is non-empty and adding sentence overflows, flush currentChunk
    if (currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }

    // If the sentence itself is within maxChunkLength, start a new chunk
    if (sentence.length <= maxChunkLength) {
      currentChunk = sentence;
      continue;
    }

    // The sentence is longer than maxChunkLength: split on sub-delimiters (, ; - :)
    const subParts = sentence.split(/([,;:\u2014-])/);
    let subChunk = "";

    for (let i = 0; i < subParts.length; i++) {
      const part = subParts[i];
      if (!part) continue;

      if ((subChunk + part).length <= maxChunkLength) {
        subChunk += part;
      } else {
        if (subChunk.trim()) {
          chunks.push(subChunk.trim());
        }
        // If an individual sub-part is still longer than maxChunkLength, split by words
        if (part.length > maxChunkLength) {
          const words = part.split(/\s+/);
          let wordChunk = "";
          for (const word of words) {
            if (!word) continue;
            if ((wordChunk + " " + word).trim().length <= maxChunkLength) {
              wordChunk = (wordChunk + " " + word).trim();
            } else {
              if (wordChunk) chunks.push(wordChunk);
              // Word itself longer than maxChunkLength (very rare)
              wordChunk = word.slice(0, maxChunkLength);
            }
          }
          subChunk = wordChunk;
        } else {
          subChunk = part;
        }
      }
    }

    if (subChunk.trim()) {
      currentChunk = subChunk.trim();
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => c.length > 0);
}
