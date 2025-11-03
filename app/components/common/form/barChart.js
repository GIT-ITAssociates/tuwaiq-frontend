import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';



const BarChartComponent = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={100}
        height={200}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={50}
      >
        
        <CartesianGrid strokeDasharray="3 3" radius={[5, 5, 5, 5]} />
        <XAxis dataKey="name" tickLine={false}/>
        <YAxis dataKey={'total'} tickLine={false}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="paid" stackId="a" fill="rgb(84, 79, 197)" />
        <Bar dataKey="due" stackId="a" fill="rgb(84 79 197 / 0.5)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
