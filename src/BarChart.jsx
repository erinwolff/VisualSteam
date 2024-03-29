import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js/auto';

ChartJS.register(BarElement, CategoryScale, LinearScale, BarController);

const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function BarChart({ filteredGames }) {
  const chartRef = useRef(null);
  const highPlaytime = filteredGames.map(game => Math.floor(game.playtime_forever / 60));

  let chartInstance = null; // Store the chart instance

  const labels = filteredGames.map(game => game.name);


  const data = {
    labels: labels,
    datasets: [{
      label: 'Total Playtime (in hours)',
      data: highPlaytime,
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
        '#E1AFD1',
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
          beginAtZero: true,
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
        x: {
          type: 'category',
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        }
      },
      plugins: {
        legend: {
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
          labels: {
            color: 'white',
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }
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


