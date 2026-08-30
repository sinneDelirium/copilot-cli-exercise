const test = require('node:test');
const assert = require('node:assert/strict');

const { calculate, parseNumber } = require('../calculator');

test('addition computes the correct result for the image example', () => {
  assert.equal(calculate('add', 2, 3), 5);
  assert.equal(calculate('+', 2, 3), 5);
});

test('subtraction computes the correct result for the image example', () => {
  assert.equal(calculate('subtract', 10, 4), 6);
  assert.equal(calculate('-', 10, 4), 6);
});

test('multiplication computes the correct result for the image example', () => {
  assert.equal(calculate('multiply', 45, 2), 90);
  assert.equal(calculate('*', 45, 2), 90);
});

test('division computes the correct result for the image example', () => {
  assert.equal(calculate('divide', 20, 5), 4);
  assert.equal(calculate('/', 20, 5), 4);
});

test('supports additional arithmetic combinations', () => {
  assert.equal(calculate('add', 0, 0), 0);
  assert.equal(calculate('subtract', 12, 9), 3);
  assert.equal(calculate('multiply', -3, 4), -12);
  assert.equal(calculate('divide', 9, 3), 3);
});

test('division by zero throws an error', () => {
  assert.throws(() => calculate('divide', 10, 0), {
    name: 'Error',
    message: 'Division by zero is not allowed.',
  });

  assert.throws(() => calculate('/', 10, 0), {
    name: 'Error',
    message: 'Division by zero is not allowed.',
  });
});

test('unsupported operations throw a clear error', () => {
  assert.throws(() => calculate('modulo', 10, 3), {
    name: 'Error',
    message: 'Unsupported operation: "modulo". Use add, subtract, multiply, or divide.',
  });
});

test('parseNumber accepts valid numeric values and rejects invalid ones', () => {
  assert.equal(parseNumber('42', 'first number'), 42);
  assert.equal(parseNumber('-7.5', 'second number'), -7.5);

  assert.throws(() => parseNumber('abc', 'first number'), {
    name: 'Error',
    message: 'Invalid first number: "abc". Please provide a valid number.',
  });

  assert.throws(() => parseNumber('NaN', 'second number'), {
    name: 'Error',
    message: 'Invalid second number: "NaN". Please provide a valid number.',
  });
});
