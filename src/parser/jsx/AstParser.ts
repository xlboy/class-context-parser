import { recursiveExtractToken } from '../../utils/base';
import { ClassNodeSource } from '../types';
import type { JsxTokenType } from './token';
import { EmbeddedActionsParser, IToken, ParserMethod } from 'chevrotain';

export class JsxAstParser extends EmbeddedActionsParser {
  constructor(private readonly $T: JsxTokenType) {
    const allTOkens = recursiveExtractToken($T);
    super(allTOkens);
    this.performSelfAnalysis();
  }

  main = this.RULE<ParserMethod<[], ClassNodeSource[]>>('main', () => {
    const nodes: ClassNodeSource[][] = [];

    this.AT_LEAST_ONE(() => {
      nodes.push(this.OR([{ ALT: () => this.SUBRULE(this.attr) }]));
    });

    return nodes.flat(1);
  });

  attr = this.RULE<ParserMethod<[], ClassNodeSource[]>>('attr', () => {
    const { $T } = this;

    this.CONSUME($T.Attr.Start);

    const nodes = this.SUBRULE(this.attrValue);

    this.CONSUME($T.Attr.End);

    return nodes;
  });

  attrValue = this.RULE<ParserMethod<[], ClassNodeSource[]>>(
    'attrValue',
    () => {
      const nodes: Array<ClassNodeSource | ClassNodeSource[]> = [];
      nodes.push(
        this.OR([
          { ALT: () => this.SUBRULE(this.single) },
          { ALT: () => this.SUBRULE(this.double) },
          { ALT: () => this.SUBRULE(this.brace) },
        ]),
      );

      return nodes.flat(Infinity) as any;
    },
  );

  single = this.RULE<ParserMethod<[], ClassNodeSource>>('single', () => {
    const { $T } = this;
    const parts: IToken[] = [];

    const lhs = this.CONSUME($T.Single.Start);
    this.MANY(() =>
      parts.push(
        this.OR([
          { ALT: () => this.CONSUME($T.EscapedChar) },
          { ALT: () => this.CONSUME($T.Content) },
        ]),
      ),
    );
    const rhs = this.CONSUME2($T.Single.End);

    return {
      pos: { s: lhs.startOffset, e: rhs.startOffset },
      value: `'${parts.map(v => v.image).join('')}'`,
    };
  });

  double = this.RULE<ParserMethod<[], ClassNodeSource>>('double', () => {
    const { $T } = this;
    const parts: IToken[] = [];

    const lhs = this.CONSUME($T.Double.Start);
    this.MANY(() =>
      parts.push(
        this.OR([
          { ALT: () => this.CONSUME($T.EscapedChar) },
          { ALT: () => this.CONSUME($T.Content) },
        ]),
      ),
    );
    const rhs = this.CONSUME2($T.Double.End);

    return {
      pos: { s: lhs.startOffset, e: rhs.startOffset },
      value: `"${parts.map(v => v.image).join('')}"`,
    };
  });

  brace = this.RULE<ParserMethod<[], ClassNodeSource[]>>('brace', () => {
    const { $T } = this;
    const nodes: ClassNodeSource[] = [];

    this.CONSUME($T.Brace.Start);
    this.MANY(() =>
      nodes.push(
        this.OR([
          { ALT: () => this.SUBRULE(this.double) },
          { ALT: () => this.SUBRULE(this.single) },
          { ALT: () => this.SUBRULE(this.main) },
        ]),
      ),
    );
    this.CONSUME2($T.Brace.End);

    return nodes;
  });
}
