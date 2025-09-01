import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favoriteTools: string[];
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  getFavoritesCount: () => number;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = '2data-favorite-tools';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);

  // Carregar favoritos do localStorage na montagem inicial
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavoriteTools(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos do localStorage:', error);
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteTools));
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage:', error);
    }
  }, [favoriteTools]);

  const addFavorite = (toolId: string) => {
    if (!favoriteTools.includes(toolId)) {
      setFavoriteTools(prev => [...prev, toolId]);
    }
  };

  const removeFavorite = (toolId: string) => {
    setFavoriteTools(prev => prev.filter(id => id !== toolId));
  };

  const isFavorite = (toolId: string): boolean => {
    return favoriteTools.includes(toolId);
  };

  const getFavoritesCount = (): number => {
    return favoriteTools.length;
  };

  const clearAllFavorites = () => {
    setFavoriteTools([]);
  };

  const value: FavoritesContextType = {
    favoriteTools,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesCount,
    clearAllFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};