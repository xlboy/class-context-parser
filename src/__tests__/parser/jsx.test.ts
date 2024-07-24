import { JsxParser } from '../../parser/jsx';
import { createJsxLexer } from '../../parser/jsx/lexer';
import { createJsxToken } from '../../parser/jsx/token';
import { describe, expect, it } from 'vitest';

it('token & lexer', () => {
  const $T = createJsxToken({ attrs: ['class', 'className', "rootClass"] });
  const lexer = createJsxLexer($T);

  const result = `<div className={"text-red-['name']" + 'bg-white'} rootClass="" />`;
  
  const values = lexer.tokenize(result);
  
  console.log(values)
});

it('Parser', () => {
  const jsxParser = new JsxParser({ attrs: ['class', 'className', "rootClass"] });
  
  const classNodes = jsxParser.parse(`
    <div className={"text-red-['name']" + 'bg-white'} />
    <span rootClass='hover:flex' class="hidden" />
  `);
  
  console.log(1)
})
