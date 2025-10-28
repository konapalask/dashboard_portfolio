'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectorSummary } from '@/types/portfolio';

interface SectorChartProps {
  sectorSummaries: SectorSummary[];
}

const COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple  
  '#F59E0B', // Orange
  '#10B981', // Green
  '#6B7280', // Gray
  '#EF4444', // Red
  '#F59E0B', // Yellow
  '#06B6D4', // Cyan
];

export function SectorChart({ sectorSummaries }: SectorChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.sector}</p>
          <p className="text-sm text-gray-600">Value: {formatCurrency(data.totalValue)}</p>
          <p className="text-sm text-gray-600">Weight: {data.weight.toFixed(1)}%</p>
          <p className={`text-sm ${data.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            P&L: {data.totalPnL >= 0 ? '+' : ''}{formatCurrency(data.totalPnL)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Sector Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorSummaries}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ sector, weight }) => `${sector}: ${weight.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalValue"
              >
                {sectorSummaries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}