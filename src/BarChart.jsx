import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js/auto';
import Utils from './Utils.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, BarController);


export default function BarChart() {
  const chartRef = useRef(null);

  let chartInstance = null; // Store the chart instance

  const labels = Utils.months(7);

  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          type: 'category',
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy(); // Destroy previous chart
    }

    chartInstance = new ChartJS(ctx, config);

    return () => {
      chartInstance.destroy(); // Cleanup on unmount

    }
  }, []);

  return (
    <div>
      <canvas width="600px" id="myChart" ref={chartRef}></canvas>
    </div>
  );
};


