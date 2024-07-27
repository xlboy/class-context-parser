import { JsxParserOptions } from '.';
import { combineRegexParts } from '../../utils/base';
import { $CommonToken } from '../common/token';
import { createToken as $ } from 'chevrotain';

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
    ...$CommonToken,
  };
}

export type JsxTokenType = ReturnType<typeof createJsxToken>;
