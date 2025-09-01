import { CreditCard } from 'lucide-react';

interface CreditCardFrontProps {
  numeroCartao: string;
  nomePortador: string;
  dataVencimento: string;
  bandeira: string;
}

const getBrandLogo = (bandeira: string) => {
  switch (bandeira.toLowerCase()) {
    case 'visa':
      return (
        <div className="text-blue-600 font-bold text-lg">
          VISA
        </div>
      );
    case 'mastercard':
      return (
        <div className="flex gap-1">
          <div className="w-6 h-6 rounded-full bg-red-500"></div>
          <div className="w-6 h-6 rounded-full bg-yellow-500 -ml-3"></div>
        </div>
      );
    case 'american express':
      return (
        <div className="text-blue-800 font-bold text-sm">
          AMEX
        </div>
      );
    case 'diners club':
      return (
        <div className="text-blue-700 font-bold text-sm">
          DINERS
        </div>
      );
    default:
      return <CreditCard className="w-6 h-6 text-muted-foreground" />;
  }
};

export const CreditCardFront = ({ 
  numeroCartao, 
  nomePortador, 
  dataVencimento, 
  bandeira
}: CreditCardFrontProps) => {
  return (
    <div className="w-80 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Padrão de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/20"></div>
        <div className="absolute top-8 right-8 w-12 h-12 rounded-full border-2 border-white/20"></div>
      </div>
      
      {/* Logo da bandeira */}
      <div className="absolute top-4 right-4">
        {getBrandLogo(bandeira)}
      </div>
      
      {/* Chip */}
      <div className="w-10 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md mt-4 relative">
        <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm">
          <div className="w-full h-full grid grid-cols-2 gap-0.5 p-0.5">
            <div className="bg-yellow-600 rounded-sm"></div>
            <div className="bg-yellow-600 rounded-sm"></div>
            <div className="bg-yellow-600 rounded-sm"></div>
            <div className="bg-yellow-600 rounded-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Número do cartão */}
      <div className="mt-6 mb-4">
        <div className="font-mono text-xl tracking-wider">
          {numeroCartao || '•••• •••• •••• ••••'}
        </div>
      </div>
      
      {/* Nome e validade */}
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs text-gray-300 mb-1">CARD HOLDER</div>
          <div className="font-semibold text-sm">
            {nomePortador || 'NOME DO PORTADOR'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-300 mb-1">VALID THRU</div>
          <div className="font-mono text-sm">
            {dataVencimento || 'MM/AA'}
          </div>
        </div>
      </div>
    </div>
  );
};