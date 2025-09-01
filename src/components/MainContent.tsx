
import { ToolContainer } from './ToolContainer';
import { ModernHomePage } from './ModernHomePage';
import { Footer } from './Footer';

interface MainContentProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const MainContent = ({ selectedTool, onToolSelect }: MainContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <div className="flex-1">
        {selectedTool === 'home' ? (
          <div>
            <ModernHomePage onToolSelect={onToolSelect} />
          </div>
        ) : (
          <ToolContainer toolId={selectedTool} />
        )}
      </div>
      <Footer />
    </div>
  );
};
