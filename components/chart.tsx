"use client"

import * as React from "react"
import { BarChart as ReBarChart, LineChart as ReLineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as RePieChart, Pie, Cell } from 'recharts';

interface ChartProps {
  data: any[]
  categories: string[]
  index: string
  colors: string[]
  stack?: boolean
  valueFormatter?: (value: number) => string
}

export const BarChart = React.forwardRef<SVGSVGElement, ChartProps>(
  ({ data, categories, index, colors, stack, valueFormatter }) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis tickFormatter={valueFormatter} />
          <Tooltip formatter={valueFormatter} />
          <Legend />
          {categories.map((category, i) => (
            <Bar key={category} dataKey={category} fill={colors[i % colors.length]} stackId={stack ? 'a' : undefined} />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    );
  },
);
BarChart.displayName = "BarChart";

export const LineChart = React.forwardRef<SVGSVGElement, ChartProps>(
  ({ data, categories, index, colors, valueFormatter }, ref) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis tickFormatter={valueFormatter} />
          <Tooltip formatter={valueFormatter} />
          <Legend />
          {categories.map((category, i) => (
            <Line key={category} type="monotone" dataKey={category} stroke={colors[i % colors.length]} />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    );
  },
)
LineChart.displayName = "LineChart"

export const PieChart = React.forwardRef<SVGSVGElement, ChartProps>(({ data, categories, colors, valueFormatter }, ref) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RePieChart>
        <Pie
          data={data}
          dataKey={categories[0]}
          nameKey={categories[1]}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={({ name, value }) => `${name}: ${valueFormatter ? valueFormatter(value) : value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={valueFormatter} />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
});
PieChart.displayName = "PieChart";

