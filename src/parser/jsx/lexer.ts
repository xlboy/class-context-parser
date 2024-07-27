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
          $T.Brace.Start,
          $T.Attr.End,
        ],
        functionValue: [
          $T.Backtick.Start,
          $T.Parenthesis.Start,
          $T.Attr.End,
        ],
        backtick: [
          $T.EscapedChar,
          $T.Content,
        ],
        parenthesis: [
          $T.Backtick.Start,
          $T.Double.End,
          $T.Single.End,
        ],
        single: [$T.EscapedChar, $T.Single.End, $T.Content],
        double: [$T.EscapedChar, $T.Double.End, $T.Content],
        brace: [
          $T.Brace.End,
          $T.Single.Start,
          $T.Double.Start,
          $T.Backtick.Start,
          ...main,
        ],
      },
      defaultMode: 'main',
    },
    { positionTracking: 'onlyOffset' },
  );
}
