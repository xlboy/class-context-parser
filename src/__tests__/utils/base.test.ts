import { recursiveExtractToken } from '../../utils/base';
import { createToken as $ } from 'chevrotain';
import { expect, it } from 'vitest';

it('recursiveExtractToken', () => {
  const obj = {
    a: {
      b: {
        c: $({ name: 'a.b.c' }),
      },
      eaaa: $({ name: 'a.eaaa' }),
    },
  };

  expect(recursiveExtractToken(obj).map(v => v.name)).toEqual([
    'a.b.c',
    'a.eaaa',
  ]);
});
