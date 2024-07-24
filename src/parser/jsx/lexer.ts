import type { JsxTokenType } from './token';
import { Lexer } from 'chevrotain';

export function createJsxLexer($T: JsxTokenType) {
  return new Lexer({
    modes: {
      main: [$T.Attr.Start, $T._],
      attrValue: [
        $T.Single.Start,
        $T.Double.Start,
        $T.Brace.Start,
        $T.Attr.End,
      ],
      single: [$T.EscapedChar, $T.Single.End, $T.Content],
      double: [$T.EscapedChar, $T.Double.End, $T.Content],
      brace: [$T.Brace.End, $T.Single.Start, $T.Double.Start, $T._],
    },
    defaultMode: 'main',
  });
}
