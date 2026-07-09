import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({ auth, totalCategories, totalProducts, totalSales, totalUniqueUsers, salesData, topProducts }) {
    const [dateRange, setDateRange] = useState('7days');

    // Filter sales data based on selected date range
    const filteredSalesData = salesData?.filter(item => {
        const itemDate = new Date(item.date);
        const today = new Date();

        switch (dateRange) {
            case '7days':
                return itemDate >= new Date(today.setDate(today.getDate() - 7));
            case '30days':
                return itemDate >= new Date(today.setDate(today.getDate() - 30));
            case '90days':
                return itemDate >= new Date(today.setDate(today.getDate() - 90));
            default:
                return true;
        }
    }) || [];

    // Prepare chart data
    const chartData = {
        labels: filteredSalesData.map(item => item.date),
        datasets: [
            {
                label: 'Sales Count',
                data: filteredSalesData.map(item => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Over Time',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Sales',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    // Metric cards data
    const metrics = [
        { title: 'Categories', value: totalCategories, icon: '📦', color: 'bg-blue-50 text-blue-600' },
        { title: 'Products', value: totalProducts, icon: '💰', color: 'bg-green-50 text-green-600' },
        { title: 'Sales', value: totalSales, icon: '📊', color: 'bg-purple-50 text-purple-600' },
        { title: 'Unique Users', value: totalUniqueUsers, icon: '👥', color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-full ${metric.color} mr-4`}>
                                        <span className="text-xl">{metric.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Date Filter and Graph */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Sales Visualization</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDateRange('7days')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRange === '7days' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    7 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('30days')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRange === '30days' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    30 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('90days')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRange === '90days' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    90 Days
                                </button>
                            </div>
                        </div>

                        {filteredSalesData.length > 0 ? (
                            <div className="h-80 flex items-center justify-center w-full">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-gray-500">
                                No sales data available for the selected time period
                            </div>
                        )}
                    </div>

                    {/* Top Products Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Best-Selling Products</h3>
                        {topProducts && topProducts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Sold Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.map((product, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-900">{product.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{product.category_name}</td>
                                                <td className="py-3 px-4 text-right font-semibold text-gray-900">{product.sold_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No product sales data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
