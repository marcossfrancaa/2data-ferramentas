import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CopyButtonProps {
  value: string;
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const CopyButton = ({ 
  value, 
  label, 
  variant = 'outline', 
  size = 'sm',
  className = ''
}: CopyButtonProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyToClipboard}
      className={`flex items-center gap-2 ${className}`}
    >
      <Copy className="w-3 h-3" />
      <span className="truncate">{value || label}</span>
    </Button>
  );
};