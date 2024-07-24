import { JsxParserOptions } from '.';
import { combineRegexParts } from '../../utils/base';
import { $CommonToken } from '../common/token';
import { createToken as $ } from 'chevrotain';

export function createJsxToken(options: Pick<JsxParserOptions, 'attrs'>) {
  return {
    Attr: {
      Start: $({
        name: 'AttrStart',
        pattern: combineRegexParts([
          '\\s',
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
    ...$CommonToken,
  };
}

export type JsxTokenType = ReturnType<typeof createJsxToken>;
