"use client";
import React from "react";
import Chart from "react-apexcharts";
import { useI18n } from "@/app/providers/i18n";

// ✅ Generic label translations
const labelTranslations = {
  en: {
    pending: "Pending",
    ongoing: "Ongoing",
    success: "Success",
    appointments: "Appointments",
    total: "Total",
    current: "Current",
    previous: "Previous",
  },
  ar: {
    pending: "قيد الانتظار",
    ongoing: "جاري",
    success: "ناجح",
    appointments: "المواعيد",
    total: "المجموع",
    current: "الحالي",
    previous: "السابق",
  },
};

// ✅ Helper to get current language labels
const useLabels = (i18n) => {
  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage = i18n?.languages?.find(
    (lang) => lang?._id === langFromLocalStorage
  )?.name;

  return currentLanguage === "Arabic" ? labelTranslations.ar : labelTranslations.en;
};

export const ProfitChart = ({ data }) => {
  const i18n = useI18n();
  const labels = useLabels(i18n);

  const weekdays = data?.map((item) => item?.weekday);
  const totalPayments = data?.map((item) => item?.total_payment);
  const previousDays = data?.map((item) => item?.previousDay);

  const chartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "50%", borderRadius: 2 },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: weekdays || [] },
    yaxis: { labels: { style: { colors: "#A0AEC0" } } },
    tooltip: { theme: "light" },
    colors: ["#D3D3D3", "#C7A87D"],
  };

  const chartSeries = [
    { name: labels.previous, data: previousDays || [] },
    { name: labels.current, data: totalPayments || [] },
  ];

  return (
    <Chart options={chartOptions} series={chartSeries} type="bar" height={200} width="100%" />
  );
};

export const RevenueAnalyticsChart = ({ data }) => {
  const i18n = useI18n();
  const labels = useLabels(i18n);

  const month = data?.map((item) => item?.month);
  const totalPayments = data?.map((item) => item?.cases);

  const options = {
    chart: { type: "line", toolbar: { show: true } },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories: month || [] },
    yaxis: { title: { text: labels.appointments } },
    colors: ["#29b6f6"],
    legend: {
      position: "bottom",
      markers: { fillColors: ["#29b6f6"] },
    },
  };

  const series = [
    { name: labels.total, data: totalPayments || [], type: "line", color: "#8e44ad" },
  ];

  return <Chart options={options} series={series} type="line" height={392} />;
};

export const DonutChart = ({ data }) => {
  const i18n = useI18n();
  const labels = useLabels(i18n);

  const chartOptions = {
    chart: { type: "donut" },
    labels: [labels.pending, labels.ongoing, labels.success],
    colors: ["#b68c5a", "#a7784b", "#8f613f"],
    legend: { show: false },
    dataLabels: { enabled: false },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const series = [
    data?.pending_cases || 0,
    data?.ongoing_cases || 0,
    data?.success_cases || 0,
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <Chart options={chartOptions} series={series} type="donut" width="380" />
      <div className="flex flex-col justify-center gap-2 mt-4">
        {chartOptions.labels.map((label, index) => (
          <div key={index} className="flex items-center gap-2 text-sm capitalize">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartOptions.colors[index] }}
            ></span>
            {label}: <strong>{series[index]} %</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
