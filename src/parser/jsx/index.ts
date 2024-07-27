import { JsxAstParser } from './AstParser';
import { createJsxLexer } from './lexer';
import { JsxTokenType, createJsxToken } from './token';
import { Lexer } from 'chevrotain';

export interface JsxParserOptions {
  /**
   * @default ['class', 'className']
   */
  attrs?: string[];

  /**
   * @default ['tw', 'tx', 'cx']
   */
  functions?: string[];
}

const defaultOptions = {
  attrs: ['class', 'className'],
  functions: ['tw', 'tx', 'cx'],
} as const satisfies JsxParserOptions;

export class JsxParser {
  private readonly lexer!: Lexer;
  private readonly astParser!: JsxAstParser;
  private readonly $T!: JsxTokenType;
  private readonly options!: JsxParserOptions;

  constructor(options: JsxParserOptions) {
    this.options = { ...defaultOptions, ...options };
    this.$T = createJsxToken(this.options);
    this.lexer = createJsxLexer(this.$T);
    this.astParser = new JsxAstParser(this.$T);
  }

  parse(input: string) {
    const lexingResult = this.lexer.tokenize(input);

    if (lexingResult.errors.length) {
      console.error('Lexing errors: ', lexingResult.errors);
    }

    this.astParser.input = lexingResult.tokens;

    const ast = this.astParser.main();

    if (this.astParser.errors.length > 0) {
      throw new Error('Parsing errors: ' + this.astParser.errors);
    }

    return ast;
  }
}
