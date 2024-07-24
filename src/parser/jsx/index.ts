import { ClassNode } from '../types';
import { JsxCstParser } from './CstParser';
import { JsxCstVisitor, createJsxCstVisitor } from './CstVisitor';
import { createJsxLexer } from './lexer';
import { JsxTokenType, createJsxToken } from './token';
import { Lexer } from 'chevrotain';

export interface JsxParserOptions {
  /**
   * @default ['class', 'className']
   */
  attrs: string[];
}

export class JsxParser {
  private readonly lexer!: Lexer;
  private readonly cstParser!: JsxCstParser;
  private readonly cstVisitor!: JsxCstVisitor;
  private readonly $T!: JsxTokenType;

  constructor(private readonly options: JsxParserOptions) {
    this.$T = createJsxToken(options);
    this.lexer = createJsxLexer(this.$T);
    this.cstParser = new JsxCstParser(this.$T);
    this.cstVisitor = createJsxCstVisitor(this.cstParser);
  }

  parse(input: string): ClassNode[] {
    const lexingResult = this.lexer.tokenize(input);

    if (lexingResult.errors.length) {
      console.error('Lexing errors: ', lexingResult.errors);
    }

    this.cstParser.input = lexingResult.tokens;

    const cst = this.cstParser.main();

    if (this.cstParser.errors.length > 0) {
      throw new Error('Parsing errors: ' + this.cstParser.errors);
    }
 
    const ast = this.cstVisitor.visit(cst);

    return ast;
  }
}
