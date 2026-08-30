#!/usr/bin/env node

/*
 * CLI calculator app.
 * Supported operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (x)
 * - division (/)
 */

const readline = require('node:readline');

function printUsage() {
  console.log('Usage: node src/calculator.js <operation> <number1> <number2>');
  console.log('Operations: add, subtract, multiply, divide');
  console.log('Aliases: +, -, *, /');
}

function parseNumber(value, label) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid ${label}: "${value}". Please provide a valid number.`);
  }

  return number;
}

function calculate(operation, left, right) {
  switch (operation) {
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
    default:
      throw new Error(`Unsupported operation: "${operation}". Use add, subtract, multiply, or divide.`);
  }
}

function runCalculation(operation, leftValue, rightValue) {
  try {
    const left = parseNumber(leftValue, 'first number');
    const right = parseNumber(rightValue, 'second number');
    const result = calculate(operation, left, right);

    console.log(`${left} ${operation} ${right} = ${result}`);
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
    rl.question('Enter operation (add, subtract, multiply, divide): ', (operationInput) => {
      rl.question('Enter second number: ', (secondInput) => {
        rl.close();
        runCalculation(operationInput.trim().toLowerCase(), firstInput.trim(), secondInput.trim());
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

  if (leftValue === undefined || rightValue === undefined) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  runCalculation(operation.toLowerCase(), leftValue, rightValue);
}

if (require.main === module) {
  main();
}

module.exports = {
  printUsage,
  parseNumber,
  calculate,
  runCalculation,
  startInteractiveMode,
  main,
};
