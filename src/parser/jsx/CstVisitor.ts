import { ClassNodeType } from '../../constants';
import { ClassNode, NodeSource } from '../types';
import { JsxCstParser } from './CstParser';
import { CstNode, IToken } from 'chevrotain';

export function createJsxCstVisitor(jsxCstParserInstance: JsxCstParser) {
  const BaseCstVisitor = jsxCstParserInstance.getBaseCstVisitorConstructor();

  return new (class JsxCstVisitor extends BaseCstVisitor {
    constructor() {
      super();
      this.validateVisitor();
    }

    visitMap = (cstNodes: CstNode[]) => cstNodes.map(v => this.visit(v));

    main(ctx: { attr: CstNode[] }): ClassNode[] {
      const attrNodeSources: NodeSource[] = this.visitMap(ctx.attr);

      return [
        ...attrNodeSources.map(v => ({ type: ClassNodeType.ATTR, value: Array.isArray(v) ? v : [v] })),
      ];
    }

    attr(ctx: { attrValue: [CstNode] }) {
      return this.visit(ctx.attrValue[0]);
    }

    attrValue(ctx: Partial<Record<'single' | 'double' | 'brace', CstNode[]>>) {
      return this.visit(ctx.single || ctx.double || ctx.brace!);
    }

    single(ctx: { l: [IToken]; parts: IToken[]; r: [IToken] }): NodeSource {
      const value = `'${ctx.parts.map(v => v.image).join('')}'`;
      return {
        pos: { s: ctx.l[0].startOffset, e: ctx.r[0].startOffset },
        value,
      };
    }

    double(ctx: { l: [IToken]; parts: IToken[]; r: [IToken] }) {
      const value = `"${ctx.parts.map(v => v.image).join('')}"`;
      return {
        pos: { s: ctx.l[0].startOffset, e: ctx.r[0].startOffset },
        value,
      };
    }

    brace(ctx: { parts: CstNode[] }) {
      return this.visitMap(ctx.parts);
    }
  })();
}

export type JsxCstVisitor = ReturnType<typeof createJsxCstVisitor>;
