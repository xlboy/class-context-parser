import { recursiveExtractToken } from '../../utils/base';
import type { JsxTokenType } from './token';
import { CstParser } from 'chevrotain';

export class JsxCstParser extends CstParser {
  constructor(private readonly $T: JsxTokenType) {
    const allTOkens = recursiveExtractToken($T);
    super(allTOkens);
    this.performSelfAnalysis();
  }

  main = this.RULE('main', () => {
    this.MANY(() => {
      this.OR([{ ALT: () => this.SUBRULE(this.attr) }]);
    });
  });

  attr = this.RULE('attr', () => {
    const { $T } = this;
    this.CONSUME($T.Attr.Start);
    this.SUBRULE(this.attrValue);
    this.CONSUME($T.Attr.End);
  });

  attrValue = this.RULE('attrValue', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.single) },
      { ALT: () => this.SUBRULE(this.double) },
      { ALT: () => this.SUBRULE(this.brace) },
    ]);
  });

  single = this.RULE('single', () => {
    const { $T } = this;

    this.CONSUME($T.Single.Start, { LABEL: 'l' });
    this.MANY(() =>
      this.OR([
        { ALT: () => this.CONSUME($T.EscapedChar, { LABEL: 'parts' }) },
        { ALT: () => this.CONSUME($T.Content, { LABEL: 'parts' }) },
      ]),
    );
    this.CONSUME2($T.Single.End, { LABEL: 'r' });
  });

  double = this.RULE('double', () => {
    const { $T } = this;

    this.CONSUME($T.Double.Start, { LABEL: 'l' });
    this.MANY(() =>
      this.OR([
        { ALT: () => this.CONSUME($T.EscapedChar, { LABEL: 'parts' }) },
        { ALT: () => this.CONSUME($T.Content, { LABEL: 'parts' }) },
      ]),
    );
    this.CONSUME2($T.Double.End, { LABEL: 'r' });
  });

  brace = this.RULE('brace', () => {
    const { $T } = this;

    this.CONSUME($T.Brace.Start, { LABEL: 'l' });
    this.MANY(() =>
      this.OR([
        { ALT: () => this.SUBRULE(this.double, { LABEL: 'parts' }) },
        { ALT: () => this.SUBRULE(this.single, { LABEL: 'parts' }) },
      ]),
    );
    this.CONSUME2($T.Brace.End, { LABEL: 'r' });
  });
}
