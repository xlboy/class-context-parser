import { JsxParser } from '../../parser/jsx';
import { createJsxLexer } from '../../parser/jsx/lexer';
import { createJsxToken } from '../../parser/jsx/token';
import { describe, expect, it } from 'vitest';

it('token & lexer', () => {
  const $T = createJsxToken({
    attrs: ['class', 'className', 'rootClass'],
    functions: [],
  });
  const lexer = createJsxLexer($T);

  const source = [
    `<div className={"text-red-['name']" + 'bg-white'}rootClass="" />`,
    `<span rootClass='hover:flex' class="hidden" />`,
    `<div className={['text', 'bb', "ffffff", \`.....\`]} />`,
    `<div className={'text-red' + <span class="bg-white" />} />`,
  ];

  const result = `
    <div className={"text-red-['name']" + 'bg-white'} />
    <span rootClass='hover:flex' class="hidden" />
  `;

  const values = lexer.tokenize(result);

  console.log(1);
});

describe('Parser', () => {
  it('attr', () => {
    const jsxParser = new JsxParser({
      attrs: ['class', 'className', 'rootClass'],
    });

    const classNodes = jsxParser.parse(`
    <div className={'text-red' + <span class="bg-white" />} />
    <div className={"text-red-['name']" + 'bg-white'} />
    <span rootClass='hover:flex' class="hidden" />
  `);

    console.log(1);
  });

  it('functions', () => {
    const jsxParser = new JsxParser({
      functions: ['tw'],
    });

    const classNodes = jsxParser.parse(`
      const class = tw\`text-red bg-white\`;  
    `);
  });
});
