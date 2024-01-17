import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { API_URL } from "../../../Config/EndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";
import adminAxios from "../../../Axios/adminAxios";
import "./Graphs.css"; // Import your CSS file

function Graphs() {
  const { adminToken } = useSelector(
    (state: RootState) => state.AdminAuthState
  );
  const headers = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  const [lineChartData, setLineChartData] = useState({
    series: [
      {
        name: 'Count Data',
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'line' as const,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });

  const [barChartData, setBarChartData] = useState({
    series: [
      {
        name: 'Amount Data',
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'bar' as const,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });

  const [pieChartData, setPieChartData] = useState({
    series: [
      {
        name: 'Amount Data',
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'bar' as const,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });

  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await adminAxios.get(
          API_URL.GET_LINE_CHART_DATA,
          { headers }
        );

        const data = response.data;

        const count = data.counts.slice(-6);
        const date = data.dates.slice(-6);

        setLineChartData({
          series: [
            {
              name: 'Count Data',
              data: count,
            },
          ],
          options: {
            chart: {
              type: 'line' as const,
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: date,
            },
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchLineChartData();

    const fetchBarChartData = async () => {
      try {
        const response = await adminAxios.get(
          API_URL.GET_BAR_CHART_DATA,
          { headers }
        );

        const data = response.data;

        const amounts = data.amounts.slice(-6);
        const dates = data.dates.slice(-6);

        setBarChartData({
          series: [
            {
              name: 'Amount Data',
              data: amounts,
            },
          ],
          options: {
            chart: {
              type: 'bar' as const,
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: dates,
            },
          },
        });
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();

    const fetchPieChartData = async () => {
      try {
        const response = await adminAxios.get(
          API_URL.GET_PIE_CHART_DATA,
          { headers }
        );

        const data = response.data;

        const amounts = data.amounts.slice(-6);
        const hotels = data.hotels.slice(-6);

        setPieChartData({
          series: [
            {
              name: 'Amount Data',
              data: amounts,
            },
          ],
          options: {
            chart: {
              type: 'bar' as const,
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: hotels,
            },
          },
        });
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchPieChartData();
  }, []);

  return (
    <div className="graph-container">
      <div className="graph">
        <h4 className="graph-title">Daily Bookings</h4>
        <ReactApexChart
          options={lineChartData.options}
          series={lineChartData.series}
          type="line"
          height={350}
        />
      </div>

      <div className="graph">
        <h4 className="graph-title">Daily Earnings</h4>
        <ReactApexChart
          options={barChartData.options}
          series={barChartData.series}
          type="bar"
          height={350}
        />
      </div>

      <div className="graph">
        <h4 className="graph-title">Host Earnings</h4>
        <ReactApexChart
          options={pieChartData.options}
          series={pieChartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

export default Graphs;
