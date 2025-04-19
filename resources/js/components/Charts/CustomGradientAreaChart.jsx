import React from "react";
import Chart from "react-apexcharts";

const CustomGradientAreaChart = ({
    chartType = "area", // Default chart type (area, line, bar, etc.)
    title = "Dynamic Chart",
    categories = [],
    seriesData = [],
    gradientColors = ["#4e54c8", "#8f94fb"], // Gradient colors
    curve = "smooth", // Line curve type (smooth, straight, stepped)
    height = 350,
  }) => {
    const options = {
        chart: {
            type: chartType,
            height: height,
            toolbar: {
                show: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: curve,
        },
        xaxis: {
            categories: categories,
        },
        yaxis: {
            title: {
                text: "Values",
            },
        },
        colors: [gradientColors[0]], // Main color
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                type: "vertical",
                gradientToColors: [gradientColors[1]],
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 100],
            },
        },
        tooltip: {
            theme: "dark",
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
        ],
    };
    
    const series = seriesData.map((data) => ({
        name: data.name,
        data: data.values,
    }));
    
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Chart options={options} series={series} type={chartType} height={height} />
        </div>
    );
};

export default CustomGradientAreaChart;
