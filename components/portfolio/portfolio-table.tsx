'use client';

import { useState, useMemo } from 'react';
import { Stock } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioTableProps {
  stocks: Stock[];
  isLoading: boolean;
}

type SortField = 'company' | 'sector' | 'currentPrice' | 'totalValue' | 'totalPnL' | 'dayChange';
type SortOrder = 'asc' | 'desc';

export function PortfolioTable({ stocks, isLoading }: PortfolioTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('totalValue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sectors = useMemo(() => {
    const uniqueSectors = Array.from(new Set(stocks.map(stock => stock.sector)));
    return uniqueSectors.sort();
  }, [stocks]);

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(stock => {
      const matchesSearch = stock.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === 'all' || stock.sector === sectorFilter;
      
      return matchesSearch && matchesSector;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      const numA = Number(aValue);
      const numB = Number(bValue);
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    return filtered;
  }, [stocks, searchTerm, sectorFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const getSectorColor = (sector: string) => {
    const colors = {
      'Banking': 'bg-blue-100 text-blue-800 border-blue-200',
      'IT Services': 'bg-purple-100 text-purple-800 border-purple-200',
      'Oil & Gas': 'bg-orange-100 text-orange-800 border-orange-200',
      'Telecom': 'bg-green-100 text-green-800 border-green-200',
      'Engineering': 'bg-gray-100 text-gray-800 border-gray-200',
      'Automobile': 'bg-red-100 text-red-800 border-red-200',
      'Consumer Goods': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[sector as keyof typeof colors] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl font-semibold text-gray-800">Portfolio Holdings</CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                {sectorFilter === 'all' ? 'All Sectors' : sectorFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Sector</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSectorFilter('all')}>
                All Sectors
              </DropdownMenuItem>
              {sectors.map(sector => (
                <DropdownMenuItem key={sector} onClick={() => setSectorFilter(sector)}>
                  {sector}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('company')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    Stock
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('sector')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    Sector
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Qty</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Avg Price</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('currentPrice')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    LTP
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('dayChange')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    Day Change
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('totalValue')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    Value
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('totalPnL')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    P&L
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStocks.map((stock) => (
                <TableRow 
                  key={stock.id} 
                  className={`hover:bg-gray-50 transition-colors ${isLoading ? 'opacity-70' : ''}`}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">{stock.company}</div>
                      <div className="text-sm text-gray-500">{stock.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSectorColor(stock.sector)}>
                      {stock.sector}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{stock.quantity}</TableCell>
                  <TableCell className="text-right">₹{formatNumber(stock.avgPrice)}</TableCell>
                  <TableCell className="text-right font-medium">₹{formatNumber(stock.currentPrice)}</TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      stock.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.dayChange >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-medium">
                        {stock.dayChange >= 0 ? '+' : ''}₹{formatNumber(stock.dayChange)}
                      </span>
                    </div>
                    <div className={`text-xs ${
                      stock.dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stock.dayChangePercent >= 0 ? '+' : ''}{formatNumber(stock.dayChangePercent)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(stock.totalValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-medium ${
                      stock.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.totalPnL >= 0 ? '+' : ''}{formatCurrency(stock.totalPnL)}
                    </div>
                    <div className={`text-xs ${
                      stock.totalPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stock.totalPnLPercent >= 0 ? '+' : ''}{formatNumber(stock.totalPnLPercent)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm font-medium">{formatNumber(stock.weight)}%</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Showing {filteredAndSortedStocks.length} of {stocks.length} holdings</span>
          {isLoading && (
            <span className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Updating prices...</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}