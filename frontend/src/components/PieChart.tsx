import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from 'chart.js';
import { Chart } from 'chart.js/dist';


ChartJS.register(ArcElement, Tooltip, Legend);

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
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Handedness Distribution',
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Chart data={data} options={options} />
    </div>
  );
};

export default PieChart;