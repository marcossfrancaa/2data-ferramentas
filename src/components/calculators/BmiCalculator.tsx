import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Ruler, Weight, User, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  idealWeightMin: number;
  idealWeightMax: number;
  weightToLose?: number;
  weightToGain?: number;
}

export const BmiCalculator = () => {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculateBMI = () => {
    let weightInKg = parseFloat(weight);
    let heightInM = parseFloat(height);

    if (unit === 'imperial') {
      weightInKg = weightInKg * 0.453592; // lbs to kg
      heightInM = heightInM * 0.0254; // inches to meters
    } else {
      heightInM = heightInM / 100; // cm to meters
    }

    if (weightInKg <= 0 || heightInM <= 0) {
      return;
    }

    const bmi = weightInKg / (heightInM * heightInM);
    
    let category = '';
    let color = '';
    
    if (bmi < 16) {
      category = 'Magreza Grave';
      color = 'text-red-600';
    } else if (bmi < 17) {
      category = 'Magreza Moderada';
      color = 'text-red-500';
    } else if (bmi < 18.5) {
      category = 'Magreza Leve';
      color = 'text-orange-500';
    } else if (bmi < 25) {
      category = 'Peso Normal';
      color = 'text-green-600';
    } else if (bmi < 30) {
      category = 'Sobrepeso';
      color = 'text-yellow-600';
    } else if (bmi < 35) {
      category = 'Obesidade Grau I';
      color = 'text-orange-600';
    } else if (bmi < 40) {
      category = 'Obesidade Grau II';
      color = 'text-red-500';
    } else {
      category = 'Obesidade Grau III';
      color = 'text-red-700';
    }

    // Calcular peso ideal (IMC entre 18.5 e 24.9)
    const idealWeightMin = 18.5 * heightInM * heightInM;
    const idealWeightMax = 24.9 * heightInM * heightInM;
    
    let weightToLose = undefined;
    let weightToGain = undefined;
    
    if (weightInKg > idealWeightMax) {
      weightToLose = weightInKg - idealWeightMax;
    } else if (weightInKg < idealWeightMin) {
      weightToGain = idealWeightMin - weightInKg;
    }

    setResult({
      bmi,
      category,
      color,
      idealWeightMin: unit === 'imperial' ? idealWeightMin / 0.453592 : idealWeightMin,
      idealWeightMax: unit === 'imperial' ? idealWeightMax / 0.453592 : idealWeightMax,
      weightToLose: weightToLose ? (unit === 'imperial' ? weightToLose / 0.453592 : weightToLose) : undefined,
      weightToGain: weightToGain ? (unit === 'imperial' ? weightToGain / 0.453592 : weightToGain) : undefined
    });
  };

  const getBmiPosition = (bmi: number) => {
    if (bmi < 16) return 5;
    if (bmi < 18.5) return 15;
    if (bmi < 25) return 40;
    if (bmi < 30) return 60;
    if (bmi < 35) return 75;
    if (bmi < 40) return 85;
    return 95;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de IMC</CardTitle>
          <CardDescription>
            Calcule seu Índice de Massa Corporal e descubra seu peso ideal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={unit} onValueChange={setUnit}>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="metric" />
                <Label htmlFor="metric">Métrico (kg/cm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="imperial" id="imperial" />
                <Label htmlFor="imperial">Imperial (lbs/in)</Label>
              </div>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">
                Peso ({unit === 'metric' ? 'kg' : 'lbs'})
              </Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder={unit === 'metric' ? '70' : '154'}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="height">
                Altura ({unit === 'metric' ? 'cm' : 'polegadas'})
              </Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder={unit === 'metric' ? '175' : '69'}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="age">Idade (opcional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Sexo (opcional)</Label>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Feminino</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button onClick={calculateBMI} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular IMC
          </Button>

          {result && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-secondary/50 rounded-lg">
                <div className="text-5xl font-bold mb-2">
                  {result.bmi.toFixed(1)}
                </div>
                <div className={`text-xl font-semibold ${result.color}`}>
                  {result.category}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Magreza</span>
                  <span>Normal</span>
                  <span>Sobrepeso</span>
                  <span>Obesidade</span>
                </div>
                <div className="relative">
                  <div className="h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full" />
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${getBmiPosition(result.bmi)}%` }}
                  >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-primary" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>16</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40+</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Peso Ideal</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.idealWeightMin.toFixed(1)} - {result.idealWeightMax.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Weight className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Recomendação</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.weightToLose && `Perder ${result.weightToLose.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'}`}
                          {result.weightToGain && `Ganhar ${result.weightToGain.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'}`}
                          {!result.weightToLose && !result.weightToGain && 'Manter o peso atual'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Informações sobre o IMC:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• IMC abaixo de 18,5: Abaixo do peso</li>
                    <li>• IMC entre 18,5 e 24,9: Peso normal</li>
                    <li>• IMC entre 25 e 29,9: Sobrepeso</li>
                    <li>• IMC entre 30 e 34,9: Obesidade Grau I</li>
                    <li>• IMC entre 35 e 39,9: Obesidade Grau II</li>
                    <li>• IMC acima de 40: Obesidade Grau III</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold mb-2">Importante</h3>
                <p className="text-sm text-muted-foreground">
                  O IMC é apenas um indicador geral e não considera fatores como massa muscular, 
                  estrutura óssea e distribuição de gordura. Consulte um profissional de saúde 
                  para uma avaliação completa.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};