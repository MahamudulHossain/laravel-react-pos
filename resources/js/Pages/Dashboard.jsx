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
import { Layers, Package, TrendingUp, Users } from 'lucide-react';

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
                backgroundColor: 'rgba(5, 150, 105, 0.55)',
                borderColor: 'rgba(5, 150, 105, 1)',
                borderWidth: 1,
                borderRadius: 6,
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
        { title: 'Categories', value: totalCategories, icon: Layers, color: 'bg-sky-50 text-sky-700' },
        { title: 'Products', value: totalProducts, icon: Package, color: 'bg-brand-50 text-brand-700' },
        { title: 'Sales', value: totalSales, icon: TrendingUp, color: 'bg-violet-50 text-violet-700' },
        { title: 'Unique Users', value: totalUniqueUsers, icon: Users, color: 'bg-amber-50 text-amber-700' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="page-title">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="page-shell">
                    {/* Metric Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                            <div key={index} className="surface-card p-5">
                                <div className="flex items-center">
                                    <div className={`mr-4 rounded-xl p-3 ${metric.color}`}>
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-ink-500">{metric.title}</h3>
                                        <p className="font-display text-2xl font-bold text-ink-900">{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    {/* Date Filter and Graph */}
                    <div className="surface-card mb-8 p-6">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-display text-lg font-semibold text-ink-900">Sales Visualization</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDateRange('7days')}
                                    className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${dateRange === '7days' ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'}`}
                                >
                                    7 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('30days')}
                                    className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${dateRange === '30days' ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'}`}
                                >
                                    30 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('90days')}
                                    className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${dateRange === '90days' ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'}`}
                                >
                                    90 Days
                                </button>
                            </div>
                        </div>

                        {filteredSalesData.length > 0 ? (
                            <div className="flex h-80 w-full items-center justify-center">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        ) : (
                            <div className="flex h-80 items-center justify-center text-ink-500">
                                No sales data available for the selected time period
                            </div>
                        )}
                    </div>

                    {/* Top Products Table */}
                    <div className="surface-card p-6">
                        <h3 className="mb-6 font-display text-lg font-semibold text-ink-900">Top 5 Best-Selling Products</h3>
                        {topProducts && topProducts.length > 0 ? (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Product Name</th>
                                            <th className="text-left">Category</th>
                                            <th className="text-right">Sold Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td className="font-medium text-ink-900">{product.name}</td>
                                                <td className="text-ink-600">{product.category_name}</td>
                                                <td className="text-right font-semibold tabular-nums text-ink-900">{product.sold_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-ink-500">
                                No product sales data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
