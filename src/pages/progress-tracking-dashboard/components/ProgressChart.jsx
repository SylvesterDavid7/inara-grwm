import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ProgressChart = ({ data, title, type = 'line', color = '#2D5A87', yDomain = [0, 10], className = "" }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length && payload[0].value !== null) {
      return (
        <div className="bg-popover border border-border rounded-clinical p-3 shadow-clinical-lg">
          <p className="font-body font-body-medium text-sm text-popover-foreground mb-1">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="font-data font-data-normal text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value?.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Check if there is any data to display in the chart
  const hasData = data.some(item => item.value !== null);

  const renderChart = () => {
    const ChartComponent = type === 'area' ? AreaChart : LineChart;
    const ChartElement = type === 'area' ? Area : Line;
    
    return (
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={{ stroke: '#E5E7EB' }}
          interval="preserveStartEnd"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={{ stroke: '#E5E7EB' }}
          domain={yDomain} // Use the yDomain prop here
        />
        {hasData && <Tooltip content={<CustomTooltip />} />}
        {hasData && (
          <ChartElement
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={type === 'area' ? `${color}20` : 'none'}
            strokeWidth={2}
            dot={type === 'line' ? { fill: color, strokeWidth: 1.5, r: 3 } : false}
            activeDot={type === 'line' ? { r: 5, stroke: color, strokeWidth: 2 } : undefined}
            connectNulls={false}
          />
        )}
      </ChartComponent>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      <h3 className="font-heading font-heading-semibold text-lg text-card-foreground mb-4 sm:mb-6">
        {title}
      </h3>
      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
