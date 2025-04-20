import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChartData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartContainerProps {
  chart: ChartData;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ chart }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chart.title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      {chart.type === 'line' && <Line options={options} data={chart.data} />}
      {chart.type === 'bar' && <Bar options={options} data={chart.data} />}
      {chart.type === 'area' && (
        <Line
          options={options}
          data={{
            ...chart.data,
            datasets: chart.data.datasets.map(dataset => ({
              ...dataset,
              fill: true,
            })),
          }}
        />
      )}
    </div>
  );
};

export default ChartContainer;