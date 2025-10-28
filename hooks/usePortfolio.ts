'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Stock, SectorSummary, PortfolioSummary } from '@/types/portfolio';
import { initialPortfolioData, simulatePriceUpdate } from '@/data/portfolio-data';

export const usePortfolio = () => {
  const [stocks, setStocks] = useState<Stock[]>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize lastUpdated on client side only to avoid hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  // Simulate real-time updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        setStocks(prevStocks => {
          const updatedStocks = prevStocks.map(simulatePriceUpdate);
          
          // Recalculate weights based on new total value
          const totalPortfolioValue = updatedStocks.reduce((sum, stock) => sum + stock.totalValue, 0);
          
          return updatedStocks.map(stock => ({
            ...stock,
            weight: (stock.totalValue / totalPortfolioValue) * 100
          }));
        });
        
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Calculate portfolio summary
  const portfolioSummary = useMemo((): PortfolioSummary => {
    const totalValue = stocks.reduce((sum, stock) => sum + stock.totalValue, 0);
    const totalInvested = stocks.reduce((sum, stock) => sum + (stock.avgPrice * stock.quantity), 0);
    const totalPnL = totalValue - totalInvested;
    const totalPnLPercent = (totalPnL / totalInvested) * 100;
    const dayChange = stocks.reduce((sum, stock) => sum + (stock.dayChange * stock.quantity), 0);
    const dayChangePercent = (dayChange / (totalValue - dayChange)) * 100;

    return {
      totalValue,
      totalInvested,
      totalPnL,
      totalPnLPercent,
      dayChange,
      dayChangePercent
    };
  }, [stocks]);

  // Calculate sector summaries
  const sectorSummaries = useMemo((): SectorSummary[] => {
    const sectorMap = new Map<string, SectorSummary>();
    
    stocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector);
      if (existing) {
        existing.totalValue += stock.totalValue;
        existing.totalPnL += stock.totalPnL;
        existing.stockCount += 1;
      } else {
        sectorMap.set(stock.sector, {
          sector: stock.sector,
          totalValue: stock.totalValue,
          totalPnL: stock.totalPnL,
          totalPnLPercent: 0,
          stockCount: 1,
          weight: 0
        });
      }
    });

    const summaries = Array.from(sectorMap.values());
    const totalPortfolioValue = portfolioSummary.totalValue;
    
    return summaries.map(summary => {
      const totalInvested = summary.totalValue - summary.totalPnL;
      return {
        ...summary,
        totalPnLPercent: totalInvested > 0 ? (summary.totalPnL / totalInvested) * 100 : 0,
        weight: (summary.totalValue / totalPortfolioValue) * 100
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  }, [stocks, portfolioSummary.totalValue]);

  // Manual refresh function
  const refreshPortfolio = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setStocks(prevStocks => {
        const updatedStocks = prevStocks.map(simulatePriceUpdate);
        const totalPortfolioValue = updatedStocks.reduce((sum, stock) => sum + stock.totalValue, 0);
        
        return updatedStocks.map(stock => ({
          ...stock,
          weight: (stock.totalValue / totalPortfolioValue) * 100
        }));
      });
      
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    stocks,
    portfolioSummary,
    sectorSummaries,
    isLoading,
    lastUpdated,
    refreshPortfolio
  };
};