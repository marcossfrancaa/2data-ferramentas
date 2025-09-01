import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator as CalcIcon, Delete } from 'lucide-react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '=':
          result = inputValue;
          break;
        default:
          return;
      }

      setPreviousValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (operation && previousValue !== null) {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: 'C', type: 'clear', className: 'col-span-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground' },
    { label: '⌫', type: 'delete', className: 'bg-muted hover:bg-muted/80' },
    { label: '/', type: 'operation', className: 'bg-primary hover:bg-primary-hover text-primary-foreground' },
    
    { label: '7', type: 'digit', className: '' },
    { label: '8', type: 'digit', className: '' },
    { label: '9', type: 'digit', className: '' },
    { label: '*', type: 'operation', className: 'bg-primary hover:bg-primary-hover text-primary-foreground' },
    
    { label: '4', type: 'digit', className: '' },
    { label: '5', type: 'digit', className: '' },
    { label: '6', type: 'digit', className: '' },
    { label: '-', type: 'operation', className: 'bg-primary hover:bg-primary-hover text-primary-foreground' },
    
    { label: '1', type: 'digit', className: '' },
    { label: '2', type: 'digit', className: '' },
    { label: '3', type: 'digit', className: '' },
    { label: '+', type: 'operation', className: 'bg-primary hover:bg-primary-hover text-primary-foreground' },
    
    { label: '0', type: 'digit', className: 'col-span-2' },
    { label: '.', type: 'decimal', className: '' },
    { label: '=', type: 'equals', className: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
  ];

  const handleButtonClick = (button: typeof buttons[0]) => {
    switch (button.type) {
      case 'digit':
        inputDigit(button.label);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'operation':
        performOperation(button.label);
        break;
      case 'equals':
        calculate();
        break;
      case 'clear':
        clear();
        break;
      case 'delete':
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay('0');
        }
        break;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CalcIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Calculadora</h1>
        </div>
        <p className="text-muted-foreground">
          Calculadora simples para operações matemáticas básicas.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card">
        <div className="mb-6">
          <div className="w-full p-4 text-right text-3xl font-mono bg-muted/30 rounded-lg border border-border">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={() => handleButtonClick(button)}
              className={`h-14 text-lg font-semibold transition-fast ${button.className}`}
              variant={button.className ? undefined : "outline"}
            >
              {button.label === '⌫' ? <Delete className="w-5 h-5" /> : button.label}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <CalcIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Operações Disponíveis</h4>
            <p className="text-muted-foreground">
              Adição (+), Subtração (-), Multiplicação (*), Divisão (/), 
              Números decimais (.), Limpar (C) e Deletar (⌫).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};