"use client";
import React from "react";
import Chart from "react-apexcharts";
export const RadialBarChart = ({data}) => {

  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -100,
        endAngle: 100, 
        hollow: {
          size: "20%", // Adjusts the thickness of the bars
        },
        track: {
          show: true,
          background: "#eee",
          strokeWidth: "100%",
          margin: 15,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    colors: ["#F4A100", "#28A745", "#007BFF"],
    labels: ["Apples", "Oranges", "Bananas"],
  };

  const series = data;

  return (
    <div className="w-full sm:h-full h-[310px] flex justify-center items-center  absolute sm:bottom-[-100px] bottom-[-120px] mx-[2px]  ">
      <Chart options={options} series={series} type="radialBar" width="100%" height="100%" />
    </div>
  );
};






export const AreaChartComponent = ({ options, series, type = "area", height = 188 }) => {
  return (
    <div className="">
      <Chart options={options} series={series} type={type} height={height} />
    </div>
  );
};