#!/usr/bin/env node

/*
 * CLI calculator app.
 * Supported operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (x)
 * - division (/)
 * - modulo (%)
 * - exponentiation (power, ^, **)
 * - square root (sqrt)
 */

const readline = require('node:readline');

function printUsage() {
  console.log('Usage: node src/calculator.js <operation> <number1> <number2>');
  console.log('Operations: add, subtract, multiply, divide, modulo, power, sqrt');
  console.log('Aliases: +, -, *, /, %, ^, **');
}

function parseNumber(value, label) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid ${label}: "${value}". Please provide a valid number.`);
  }

  return number;
}

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed.');
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Square root of a negative number is not allowed.');
  }

  return Math.sqrt(n);
}

function calculate(operation, left, right) {
  const normalizedOperation = operation.trim().toLowerCase();

  switch (normalizedOperation) {
    case 'add':
    case '+':
      return left + right;
    case 'subtract':
    case '-':
      return left - right;
    case 'multiply':
    case '*':
      return left * right;
    case 'divide':
    case '/':
      if (right === 0) {
        throw new Error('Division by zero is not allowed.');
      }
      return left / right;
    case 'modulo':
    case 'mod':
    case '%':
      return modulo(left, right);
    case 'power':
    case 'pow':
    case '^':
    case '**':
      return power(left, right);
    case 'sqrt':
    case 'square-root':
    case 'square_root':
      return squareRoot(left);
    default:
      throw new Error(`Unsupported operation: "${operation}". Use add, subtract, multiply, divide, modulo, power, or sqrt.`);
  }
}

function runCalculation(operation, leftValue, rightValue) {
  try {
    const normalizedOperation = operation.trim().toLowerCase();
    const isUnaryOperation = ['sqrt', 'square-root', 'square_root'].includes(normalizedOperation);

    if (isUnaryOperation) {
      const value = parseNumber(leftValue, 'number');
      const result = calculate(normalizedOperation, value);

      console.log(`sqrt(${value}) = ${result}`);
      return;
    }

    const left = parseNumber(leftValue, 'first number');
    const right = parseNumber(rightValue, 'second number');
    const result = calculate(normalizedOperation, left, right);

    console.log(`${left} ${normalizedOperation} ${right} = ${result}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

function startInteractiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter first number: ', (firstInput) => {
    rl.question('Enter operation (add, subtract, multiply, divide, modulo, power, sqrt): ', (operationInput) => {
      const normalizedOperation = operationInput.trim().toLowerCase();
      const isUnaryOperation = ['sqrt', 'square-root', 'square_root'].includes(normalizedOperation);

      if (isUnaryOperation) {
        rl.close();
        runCalculation(normalizedOperation, firstInput.trim());
        return;
      }

      rl.question('Enter second number: ', (secondInput) => {
        rl.close();
        runCalculation(normalizedOperation, firstInput.trim(), secondInput.trim());
      });
    });
  });
}

function main() {
  const [, , operation, leftValue, rightValue] = process.argv;

  if (!operation) {
    startInteractiveMode();
    return;
  }

  if (operation === 'help' || operation === '--help' || operation === '-h') {
    printUsage();
    return;
  }

  const normalizedOperation = operation.toLowerCase();
  const isUnaryOperation = ['sqrt', 'square-root', 'square_root'].includes(normalizedOperation);

  if (leftValue === undefined) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (isUnaryOperation) {
    runCalculation(normalizedOperation, leftValue, rightValue);
    return;
  }

  if (rightValue === undefined) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  runCalculation(normalizedOperation, leftValue, rightValue);
}

if (require.main === module) {
  main();
}

module.exports = {
  printUsage,
  parseNumber,
  modulo,
  power,
  squareRoot,
  calculate,
  runCalculation,
  startInteractiveMode,
  main,
};
