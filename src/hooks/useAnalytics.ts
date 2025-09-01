import { useCallback } from 'react';
import { 
  trackToolUsage, 
  trackToolGeneration, 
  trackToolValidation, 
  trackToolDownload, 
  trackToolCopy, 
  trackSearch, 
  trackFavorite, 
  trackConversion, 
  trackEngagement, 
  trackError, 
  trackPerformance 
} from '@/lib/analytics';
import { 
  gtmTrackEvent, 
  gtmTrackToolUsage, 
  gtmTrackConversion 
} from '@/lib/gtm';

export const useAnalytics = () => {
  // Rastrear uso de ferramenta
  const trackTool = useCallback((toolId: string, action: string, value?: number) => {
    trackToolUsage(toolId, action, value);
    gtmTrackToolUsage(toolId, action, value);
  }, []);

  // Rastrear geração de dados
  const trackGeneration = useCallback((toolId: string, type: string, count?: number) => {
    trackToolGeneration(toolId, type, count);
    gtmTrackEvent('generate', {
      tool_id: toolId,
      generation_type: type,
      count: count || 1
    });
  }, []);

  // Rastrear validação
  const trackValidation = useCallback((toolId: string, isValid: boolean, inputType?: string) => {
    trackToolValidation(toolId, isValid, inputType);
    gtmTrackEvent('validate', {
      tool_id: toolId,
      is_valid: isValid,
      input_type: inputType
    });
  }, []);

  // Rastrear download
  const trackDownload = useCallback((toolId: string, fileType: string, fileSize?: number) => {
    trackToolDownload(toolId, fileType, fileSize);
    gtmTrackEvent('download', {
      tool_id: toolId,
      file_type: fileType,
      file_size: fileSize
    });
  }, []);

  // Rastrear cópia
  const trackCopy = useCallback((toolId: string, contentType: string, length?: number) => {
    trackToolCopy(toolId, contentType, length);
    gtmTrackEvent('copy', {
      tool_id: toolId,
      content_type: contentType,
      content_length: length
    });
  }, []);

  // Rastrear busca
  const trackSearchAction = useCallback((query: string, results?: number, category?: string) => {
    trackSearch(query, results, category);
    gtmTrackEvent('search', {
      search_term: query,
      results_count: results,
      category: category
    });
  }, []);

  // Rastrear favorito
  const trackFavoriteAction = useCallback((toolId: string, action: 'add' | 'remove') => {
    trackFavorite(toolId, action);
    gtmTrackEvent('favorite', {
      tool_id: toolId,
      action: action
    });
  }, []);

  // Rastrear conversão
  const trackConversionAction = useCallback((toolId: string, conversionType: string, value?: number) => {
    trackConversion(toolId, conversionType, value);
    gtmTrackConversion(toolId, conversionType, value);
  }, []);

  // Rastrear engajamento
  const trackEngagementAction = useCallback((action: string, category: string, label?: string, value?: number) => {
    trackEngagement(action, category, label, value);
    gtmTrackEvent('engagement', {
      action: action,
      category: category,
      label: label,
      value: value
    });
  }, []);

  // Rastrear erro
  const trackErrorAction = useCallback((toolId: string, errorType: string, errorMessage?: string) => {
    trackError(toolId, errorType, errorMessage);
    gtmTrackEvent('error', {
      tool_id: toolId,
      error_type: errorType,
      error_message: errorMessage
    });
  }, []);

  // Rastrear performance
  const trackPerformanceAction = useCallback((toolId: string, metric: string, value: number, unit?: string) => {
    trackPerformance(toolId, metric, value, unit);
    gtmTrackEvent('performance', {
      tool_id: toolId,
      metric: metric,
      value: value,
      unit: unit
    });
  }, []);

  return {
    trackTool,
    trackGeneration,
    trackValidation,
    trackDownload,
    trackCopy,
    trackSearch: trackSearchAction,
    trackFavorite: trackFavoriteAction,
    trackConversion: trackConversionAction,
    trackEngagement: trackEngagementAction,
    trackError: trackErrorAction,
    trackPerformance: trackPerformanceAction
  };
};

// Hook específico para ferramentas
export const useToolAnalytics = (toolId: string) => {
  const analytics = useAnalytics();

  return {
    // Métodos específicos para a ferramenta atual
    trackUsage: (action: string, value?: number) => analytics.trackTool(toolId, action, value),
    trackGeneration: (type: string, count?: number) => analytics.trackGeneration(toolId, type, count),
    trackValidation: (isValid: boolean, inputType?: string) => analytics.trackValidation(toolId, isValid, inputType),
    trackDownload: (fileType: string, fileSize?: number) => analytics.trackDownload(toolId, fileType, fileSize),
    trackCopy: (contentType: string, length?: number) => analytics.trackCopy(toolId, contentType, length),
    trackConversion: (conversionType: string, value?: number) => analytics.trackConversion(toolId, conversionType, value),
    trackError: (errorType: string, errorMessage?: string) => analytics.trackError(toolId, errorType, errorMessage),
    trackPerformance: (metric: string, value: number, unit?: string) => analytics.trackPerformance(toolId, metric, value, unit),
    
    // Métodos gerais ainda disponíveis
    ...analytics
  };
};