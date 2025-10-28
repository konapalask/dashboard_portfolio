'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { PortfolioSummaryComponent } from '@/components/portfolio/portfolio-summary';
import { PortfolioTable } from '@/components/portfolio/portfolio-table';
import { SectorChart } from '@/components/portfolio/sector-chart';
import { SectorSummaryComponent } from '@/components/portfolio/sector-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart, Briefcase } from 'lucide-react';

export default function PortfolioDashboard() {
  const { 
    stocks, 
    portfolioSummary, 
    sectorSummaries, 
    isLoading, 
    lastUpdated, 
    refreshPortfolio 
  } = usePortfolio();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-sm text-gray-500">Real-time portfolio tracking & analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary Cards */}
        <PortfolioSummaryComponent
          summary={portfolioSummary}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          onRefresh={refreshPortfolio}
        />

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SectorChart sectorSummaries={sectorSummaries} />
          </div>
          <div>
            <SectorSummaryComponent sectorSummaries={sectorSummaries} />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Best Performer</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {stocks.length > 0 && (
                <>
                  <div className="text-xl font-bold text-purple-900">
                    {stocks.reduce((best, stock) => 
                      stock.totalPnLPercent > best.totalPnLPercent ? stock : best
                    ).company}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    +{stocks.reduce((best, stock) => 
                      stock.totalPnLPercent > best.totalPnLPercent ? stock : best
                    ).totalPnLPercent.toFixed(2)}% returns
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">Top Holding</CardTitle>
              <BarChart3 className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              {stocks.length > 0 && (
                <>
                  <div className="text-xl font-bold text-indigo-900">
                    {stocks.reduce((largest, stock) => 
                      stock.weight > largest.weight ? stock : largest
                    ).company}
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">
                    {stocks.reduce((largest, stock) => 
                      stock.weight > largest.weight ? stock : largest
                    ).weight.toFixed(1)}% of portfolio
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Diversification</CardTitle>
              <PieChart className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-teal-900">
                {sectorSummaries.length} Sectors
              </div>
              <p className="text-xs text-teal-600 mt-1">
                {stocks.length} total holdings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Table */}
        <PortfolioTable stocks={stocks} isLoading={isLoading} />
      </div>
    </div>
  );
}