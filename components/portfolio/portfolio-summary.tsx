'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart, RefreshCw } from 'lucide-react';
import { PortfolioSummary } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PortfolioSummaryProps {
  summary: PortfolioSummary;
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export function PortfolioSummaryComponent({ 
  summary, 
  isLoading, 
  lastUpdated, 
  onRefresh 
}: PortfolioSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(summary.totalValue)}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Invested: {formatCurrency(summary.totalInvested)}
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${
        summary.totalPnL >= 0 
          ? 'from-green-50 to-green-100 border-green-200' 
          : 'from-red-50 to-red-100 border-red-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${
            summary.totalPnL >= 0 ? 'text-green-700' : 'text-red-700'
          }`}>
            Total P&L
          </CardTitle>
          {summary.totalPnL >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            summary.totalPnL >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            {summary.totalPnL >= 0 ? '+' : ''}{formatCurrency(summary.totalPnL)}
          </div>
          <p className={`text-xs mt-1 ${
            summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.totalPnLPercent >= 0 ? '+' : ''}{summary.totalPnLPercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${
        summary.dayChange >= 0 
          ? 'from-emerald-50 to-emerald-100 border-emerald-200' 
          : 'from-orange-50 to-orange-100 border-orange-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${
            summary.dayChange >= 0 ? 'text-emerald-700' : 'text-orange-700'
          }`}>
            Day's Change
          </CardTitle>
          <PieChart className={`h-4 w-4 ${
            summary.dayChange >= 0 ? 'text-emerald-600' : 'text-orange-600'
          }`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            summary.dayChange >= 0 ? 'text-emerald-900' : 'text-orange-900'
          }`}>
            {summary.dayChange >= 0 ? '+' : ''}{formatCurrency(summary.dayChange)}
          </div>
          <p className={`text-xs mt-1 ${
            summary.dayChange >= 0 ? 'text-emerald-600' : 'text-orange-600'
          }`}>
            {summary.dayChangePercent >= 0 ? '+' : ''}{summary.dayChangePercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Last Updated</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-gray-900">
            {lastUpdated ? formatTime(lastUpdated) : '--:--:--'}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Auto-refresh: 15s
          </p>
        </CardContent>
      </Card>
    </div>
  );
}