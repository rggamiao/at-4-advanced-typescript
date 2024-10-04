import React from 'react';
import { Pie } from 'react-chartjs-2';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
}

interface PieChartProps {
  data: ChartData;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  return <Pie data={data} />;
};

export default PieChart;