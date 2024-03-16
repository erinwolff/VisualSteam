import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, DoughnutController, ArcElement } from 'chart.js/auto';

ChartJS.register(ArcElement, DoughnutController);

const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function DoughnutChart({ recentlyPlayedGamesData }) {
  const chartRef = useRef(null);
  const recentlyPlayedGames = recentlyPlayedGamesData.response.games.map(game => game.playtime_2weeks);

  let chartInstance = null; // Store the chart instance

  const labels = recentlyPlayedGamesData.response.games.map(game => game.name);


  const data = {
    labels: labels,
    datasets: [{
      label: 'Total Playtime (in minutes)',
      data: recentlyPlayedGames,
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
      hoverOffset: 4
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      borderColor: '#E1AFD1',
      borderWidth: 1,
      plugins: {
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
              let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return datasetLabel + ': ' + value;
            }
          },
        },
        legend: {
          labels: {
            color: 'white',
          }
        }
      },
      responsive: true,
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
  }, [recentlyPlayedGamesData]);

  return (
    <div>
      <canvas width="600px" id="myChart" ref={chartRef}></canvas>
    </div>
  );
};


