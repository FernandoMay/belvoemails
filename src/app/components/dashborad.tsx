"use client";

import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { Chart } from 'react-chartjs-2';

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID!, process.env.AWS_SECRET_ACCESS_KEY!),
});

const pinpoint = new AWS.Pinpoint();

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const params = {
        ApplicationId: process.env.PINPOINT_APP_ID!,
        JourneyId: 'your-journey-id', // Replace with your actual Journey ID
      };

      try {
        const response = await pinpoint.getJourneyExecutionMetrics(params).promise();
        setMetrics(response.JourneyExecutionMetricsResponse.Metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const data = {
    labels: Object.keys(metrics || {}),
    datasets: [
      {
        label: 'Email Metrics',
        data: Object.values(metrics || {}),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Email Metrics Dashboard</h2>
      {metrics ? <Chart type="bar" data={data} options={options} /> : <p>Loading metrics...</p>}
    </div>
  );
};

export default Dashboard;
