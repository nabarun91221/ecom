export function generateNgrams(text, min = 2) {
  if (!text || typeof text !== "string") return [];

  const tokens = new Set();
  text = text.toLowerCase();

  for (let i = 0; i < text.length; i++) {
    for (let j = i + min; j <= text.length; j++) {
      tokens.add(text.slice(i, j));
    }
  }

  return Array.from(tokens);
}