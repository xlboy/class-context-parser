import type { TokenType } from 'chevrotain';

export function combineRegexParts(parts: string[]): RegExp {
  return new RegExp(parts.filter(Boolean).join(''));
}

export function recursiveExtractToken(
  tokenObj: Record<string, TokenType | object>,
): TokenType[] {
  const tokens: TokenType[] = [];

  function extract(obj: typeof tokenObj) {
    for (const value of Object.values(obj)) {
      const isTokenType = 'name' in value;
      if (isTokenType) tokens.push(value);
      else extract(value as any);
    }
  }

  extract(tokenObj);
  return tokens;
}
