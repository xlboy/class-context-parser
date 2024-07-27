import type { JsxTokenType } from './token';
import { Lexer } from 'chevrotain';

export function createJsxLexer($T: JsxTokenType) {
  const main = [$T.Attr.Start, $T.Function.Start, $T._];
  return new Lexer(
    {
      modes: {
        main,
        attrValue: [
          $T.Single.Start,
          $T.Double.Start,
          $T.Attr.Brace.Start,
          $T.Attr.End,
        ],
        // className={...}
        attrBrace: [
          $T.Attr.Brace.End,
          $T.Single.Start,
          $T.Double.Start,
          $T.Backtick.Start,
          ...main,
        ],
        functionValue: [
          // tw`...`
          $T.Backtick.Start,
          // tw(...)
          $T.Parenthesis.Start,
          $T.Function.End,
        ],
        // `...`
        backtick: [
          $T.EscapedChar,
          $T.Backtick.Brace.Start,
          $T.Content,
        ],
        // (...)
        parenthesis: [
          $T.Backtick.Start,
          $T.Double.End,
          $T.Single.End,
        ],
        // '...'
        single: [$T.EscapedChar, $T.Single.End, $T.Content],
        // "..."
        double: [$T.EscapedChar, $T.Double.End, $T.Content],
      },
      defaultMode: 'main',
    },
    { positionTracking: 'onlyOffset' },
  );
}
