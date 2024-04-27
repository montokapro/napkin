import {evaluate} from '../constraint.js';

import assert from 'assert';

describe('#evaluate', () => {
  it('empty', () => {
    assert.deepEqual(
        evaluate(
            {},
            {
              operator: 2,
              values: [[], []],
            },
        ),
        {},
    );
  });

  it('broken', () => {
    assert.deepEqual(
        evaluate(
            {
              '0': 1,
              '1': 2,
            },
            {
              operator: 2,
              values: [['0'], ['1']],
            },
        ),
        undefined,
    );
  });

  it('simple', () => {
    assert.deepEqual(
        evaluate(
            {
              '0': 2,
            },
            {
              operator: 2,
              values: [['0'], ['1']],
            },
        ),
        {1: 2},
    );
  });

  describe('combine', () => {
    it('propagate right', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 1,
                '1': 4,
                '2': 2,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {3: 2},
      );
    });

    it('propagate left', () => {
      assert.deepEqual(
          evaluate(
              {
                '1': 1,
                '2': 4,
                '3': 2,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {0: 8},
      );
    });

    it('not propagate', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 1,
                '2': 2,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {},
      );
    });

    it('error both', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 1,
                '1': 2,
              },
              {
                operator: 2,
                values: [['0'], ['1']],
              },
          ),
          undefined,
      );
    });

    it('succeed', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 3,
                '1': 4,
                '2': 2,
                '3': 6,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {},
      );
    });
  });

  describe('unit', () => {
    it('propagate right', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 0,
                '2': 1,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {3: 0},
      );
    });

    it('propagate left', () => {
      assert.deepEqual(
          evaluate(
              {
                '1': 1,
                '3': 0,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {0: 0},
      );
    });

    it('not propagate', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 0,
                '2': 0,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {},
      );
    });

    it('error right', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 0,
                '2': 1,
                '3': 2,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          undefined,
      );
    });

    it('error left', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 2,
                '1': 1,
                '3': 0,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          undefined,
      );
    });

    it('succeed', () => {
      assert.deepEqual(
          evaluate(
              {
                '0': 0,
                '1': 1,
                '2': 0,
                '3': 2,
              },
              {
                operator: 2,
                values: [['0', '1'], ['2', '3']],
              },
          ),
          {},
      );
    });
  });
});
