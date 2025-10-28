'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SectorSummary } from '@/types/portfolio';
import { TrendingUp, TrendingDown, Building2 } from 'lucide-react';

interface SectorSummaryProps {
  sectorSummaries: SectorSummary[];
}

export function SectorSummaryComponent({ sectorSummaries }: SectorSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSectorIcon = () => <Building2 className="h-4 w-4" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Sector Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sectorSummaries.map((sector, index) => (
          <div key={sector.sector} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getSectorIcon()}
                <span className="font-medium text-gray-900">{sector.sector}</span>
                <Badge variant="outline" className="text-xs">
                  {sector.stockCount} stock{sector.stockCount !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatCurrency(sector.totalValue)}
                </div>
                <div className="text-xs text-gray-500">
                  {sector.weight.toFixed(1)}% of portfolio
                </div>
              </div>
            </div>
            
            <Progress 
              value={sector.weight} 
              className="h-2 mb-2" 
              style={{
                background: `hsl(${210 + index * 30}, 70%, 95%)`,
              }}
            />
            
            <div className="flex items-center justify-between text-sm">
              <div className={`flex items-center gap-1 ${
                sector.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {sector.totalPnL >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">
                  {sector.totalPnL >= 0 ? '+' : ''}{formatCurrency(sector.totalPnL)}
                </span>
              </div>
              <div className={`text-xs ${
                sector.totalPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {sector.totalPnLPercent >= 0 ? '+' : ''}{sector.totalPnLPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}