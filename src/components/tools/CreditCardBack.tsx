interface CreditCardBackProps {
  cvv: string;
}

export const CreditCardBack = ({ cvv }: CreditCardBackProps) => {
  return (
    <div className="w-80 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white shadow-xl relative overflow-hidden">
      {/* Tarja magnética */}
      <div className="w-full h-12 bg-black mt-4"></div>
      
      {/* Área de assinatura e CVV */}
      <div className="px-6 mt-6">
        <div className="w-full h-8 bg-white rounded mb-4 relative">
          <div className="absolute right-2 top-1 text-black font-mono text-sm flex items-center">
            CVV: {cvv || '••••••'}
          </div>
        </div>
        
        {/* Texto informativo */}
        <div className="text-xs text-gray-300 space-y-1">
          <p>Este cartão permanece propriedade do banco emissor</p>
          <p>Se encontrado, devolva ao banco mais próximo</p>
        </div>
      </div>
    </div>
  );
};