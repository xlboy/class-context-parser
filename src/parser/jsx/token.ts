import type { JsxParserOptions } from '.';
import { combineRegexParts } from '../../utils/base';
import { createToken as $, Lexer } from 'chevrotain';

export function createJsxToken(options: Required<JsxParserOptions>) {
  return {
    Attr: {
      Start: $({
        name: 'AttrStart',
        pattern: combineRegexParts([
          '(?<=[^a-zA-z\\d])',
          `(${options.attrs.join('|')})`,
          '\\s*',
          '=',
          '\\s*',
        ]),
        line_breaks: true,
        push_mode: 'attrValue',
      }),
      End: $({
        name: 'AttrEnd',
        pattern: /(?<=[^])/,
        pop_mode: true,
      }),
      Brace: {
        Start: $({
          name: 'AttrBraceStart',
          pattern: /{/,
          push_mode: 'attrBrace',
        }),
        End: $({ name: 'AttrBraceEnd', pattern: /}/, pop_mode: true }),
      },
    },
    Function: {
      Start: $({
        name: 'FunctionStart',
        pattern: combineRegexParts([
          '(?<=[^a-zA-z\\d])',
          `(${options.functions.join('|')})`,
          '\\s*',
          '(?<=[`\\(])',
        ]),
        line_breaks: true,
        push_mode: 'functionValue',
      }),
      End: $({
        name: 'FunctionEnd',
        pattern: /(?<=[^])/,
        pop_mode: true,
      }),
    }, 
    EscapedChar: $({ name: 'EscapedChar', pattern: /\\./ }),
    Double: {
      Start: $({
        name: 'DoubleStart',
        pattern: /"/,
        push_mode: 'double',
      }),
      End: $({ name: 'DoubleEnd', pattern: /"/, pop_mode: true }),
    },
    Parenthesis: {
      Start: $({
        name: 'ParenthesisStart',
        pattern: /\(/,
        push_mode: 'parenthesis',
      }),
      End: $({ name: 'ParenthesisEnd', pattern: /\)/, pop_mode: true }),
    },
    Backtick: {
      Start: $({
        name: 'BacktickStart',
        pattern: /`/,
        push_mode: 'backtick',
      }),
      End: $({ name: 'BacktickEnd', pattern: /`/, pop_mode: true }),
      Brace: {
        Start: $({
          name: 'BacktickBraceStart',
          pattern: /\$\{/,
          push_mode: 'brace',
        }),
        End: $({
          name: 'BacktickBraceEnd',
          pattern: /}/,
          pop_mode: true,
        }),
      }
    },
    Single: {
      Start: $({
        name: 'SingleStart',
        pattern: /'/,
        push_mode: 'single',
      }),
      End: $({ name: 'SingleEnd', pattern: /'/, pop_mode: true }),
    },
    Content: $({ name: 'Content', pattern: /[^]/, line_breaks: true }),
    _: $({
      name: '_',
      pattern: /[^]/,
      line_breaks: true,
      group: Lexer.SKIPPED,
    })
  };
}

export type JsxTokenType = ReturnType<typeof createJsxToken>;
