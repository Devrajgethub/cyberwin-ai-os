'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { AppProps } from '@/os/types';

export default function CalculatorApp({ windowId: _windowId }: AppProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastResult, setLastResult] = useState('');

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performCalculation = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };

  const handleOperator = (nextOp: string) => {
    const currentValue = parseFloat(display);

    if (prevValue !== null && operator && !waitingForOperand) {
      const result = performCalculation(prevValue, currentValue, operator);
      const resultStr = isNaN(result) ? 'Error' : String(parseFloat(result.toPrecision(12)));
      setDisplay(resultStr);
      setPrevValue(isNaN(result) ? null : result);
      setLastResult(`${prevValue} ${operator} ${currentValue} = ${resultStr}`);
    } else {
      setPrevValue(currentValue);
      setLastResult('');
    }

    setOperator(nextOp);
    setExpression(`${display} ${nextOp}`);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (prevValue === null || operator === null) return;
    const currentValue = parseFloat(display);
    const result = performCalculation(prevValue, currentValue, operator);
    const resultStr = isNaN(result) ? 'Error' : String(parseFloat(result.toPrecision(12)));
    setLastResult(`${prevValue} ${operator} ${currentValue} = ${resultStr}`);
    setDisplay(resultStr);
    setPrevValue(null);
    setOperator(null);
    setExpression('');
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setLastResult('');
  };

  const handleClearEntry = () => {
    setDisplay('0');
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const btnBase = 'h-12 text-base font-medium rounded-lg transition-all duration-150 active:scale-95 ';
  const numBtn = btnBase + 'bg-white/[0.06] hover:bg-white/10 text-gray-100';
  const opBtn = btnBase + 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400';
  const eqBtn = 'h-12 text-base font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black transition-all duration-150 active:scale-95';
  const funcBtn = btnBase + 'bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-sm';

  return (
    <div className="h-full w-full flex flex-col bg-[#0c0c14] p-4">
      {/* Display */}
      <div className="mb-4 text-right">
        <div className="text-xs text-gray-500 h-5 truncate px-1">
          {lastResult || expression || '\u00A0'}
        </div>
        <div className="text-3xl font-light text-white tracking-wide truncate px-1 mt-1">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-xs mx-auto w-full">
        <button className={funcBtn} onClick={handlePercent}>%</button>
        <button className={funcBtn} onClick={handleClearEntry}>CE</button>
        <button className={funcBtn} onClick={handleClear}>C</button>
        <button className={funcBtn} onClick={handleBackspace}>⌫</button>

        <button className={funcBtn} onClick={handleToggleSign}>±</button>
        <button className={funcBtn} onClick={() => handleOperator('÷')}>÷</button>
        <button className={funcBtn} onClick={() => handleOperator('×')}>×</button>
        <button className={opBtn} onClick={() => handleOperator('-')}>−</button>

        <button className={numBtn} onClick={() => handleDigit('7')}>7</button>
        <button className={numBtn} onClick={() => handleDigit('8')}>8</button>
        <button className={numBtn} onClick={() => handleDigit('9')}>9</button>
        <button className={opBtn} onClick={() => handleOperator('+')}>+</button>

        <button className={numBtn} onClick={() => handleDigit('4')}>4</button>
        <button className={numBtn} onClick={() => handleDigit('5')}>5</button>
        <button className={numBtn} onClick={() => handleDigit('6')}>6</button>
        <button className={opBtn} onClick={() => handleOperator('-')}>−</button>

        <button className={numBtn} onClick={() => handleDigit('1')}>1</button>
        <button className={numBtn} onClick={() => handleDigit('2')}>2</button>
        <button className={numBtn} onClick={() => handleDigit('3')}>3</button>
        <button className={eqBtn} onClick={handleEquals} style={{ gridRow: 'span 2' }}>=</button>

        <button className={numBtn} onClick={() => handleDigit('0')} style={{ gridColumn: 'span 2' }}>0</button>
        <button className={numBtn} onClick={handleDecimal}>.</button>
      </div>
    </div>
  );
}