import { combineRegexParts } from '../../utils/base';
import { Lexer, createToken } from 'chevrotain';

export const $CommonToken = {
  EscapedChar: createToken({ name: 'EscapedChar', pattern: /\\./ }),
  Double: {
    Start: createToken({
      name: 'DoubleStart',
      pattern: /"/,
      push_mode: 'double',
    }),
    End: createToken({ name: 'DoubleEnd', pattern: /"/, pop_mode: true }),
  },
  Parenthesis: {
    Start: createToken({
      name: 'ParenthesisStart',
      pattern: /\(/,
      push_mode: 'parenthesis',
    }),
    End: createToken({ name: 'ParenthesisEnd', pattern: /\)/, pop_mode: true }),
  },
  Backtick: {
    Start: createToken({
      name: 'BacktickStart',
      pattern: /`/,
      push_mode: 'backtick',
    }),
    End: createToken({ name: 'BacktickEnd', pattern: /`/, pop_mode: true }),
  },
  Single: {
    Start: createToken({
      name: 'SingleStart',
      pattern: /'/,
      push_mode: 'single',
    }),
    End: createToken({ name: 'SingleEnd', pattern: /'/, pop_mode: true }),
  },
  Brace: {
    Start: createToken({
      name: 'BraceStart',
      pattern: /{/,
      push_mode: 'brace',
    }),
    End: createToken({ name: 'BraceEnd', pattern: /}/, pop_mode: true }),
  },
  Content: createToken({ name: 'Content', pattern: /[^]/, line_breaks: true }),
  _: createToken({
    name: '_',
    pattern: /[^]/,
    line_breaks: true,
    group: Lexer.SKIPPED,
  }),
};
