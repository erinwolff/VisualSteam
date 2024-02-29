import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js/auto';

ChartJS.register(BarElement, CategoryScale, LinearScale, BarController);


export default function BarChart({ filteredGames }) {
  const chartRef = useRef(null);
  const peakCCUData = filteredGames.map(game => game["Peak CCU"]);

  let chartInstance = null; // Store the chart instance

  const labels = filteredGames.map(game => game["Name"]);


  const data = {
    labels: labels,
    datasets: [{
      label: 'Peak CCU',
      data: peakCCUData,
      maxBarThickness: 40,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(36, 46, 216, 0.6)',
        'rgba(245, 40, 145, 0.6)',
        'rgba(201, 203, 200, 0.6)',
        'rgba(201, 203, 64, 0.6)',
      ],
      borderColor: [
        'rgb(53, 53, 57)',
      ],
      borderWidth: 1
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      tooltips: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem, data) {
            let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return datasetLabel + ': ' + value;
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#000'
          },
        },
        x: {
          type: 'category',
          ticks: {
            color: '#000'
          },
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
  }, [filteredGames]);

  return (
    <div>
      <canvas width="600px" id="myChart" ref={chartRef}></canvas>
    </div>
  );
};


