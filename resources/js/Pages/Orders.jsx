import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import Pagination from '@/Components/Pagination'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
import { useEffect, useState } from "react";


const Orders = ({ orders, queryParams = null }) => {
    console.log(orders);
    const { flash } = usePage().props;
    const [flashMessage, setFlashMessage] = useState(false);

    queryParams = queryParams || {};
    const searchFeildCLicked = (field, value) => {
        queryParams[field] = value
        router.get(route('pos.indexOrders'), queryParams, { preserveState: true });
    }

    const keyPress = (field, e) => {
        if (e.key !== 'Enter') return;
        searchFeildCLicked(field, e.target.value);
    }

    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setFlashMessage(true);
            setTimeout(() => {
                setFlashMessage(false);
            }, 3000);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order List
                    </h2>
                </div>
            }
        >

            <Head title="Orders" />

            <div className="py-6">
                <div className="mx-auto max-w-9xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flashMessage && flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-2 rounded relative">
                            {flash.success}
                        </div>
                    )}

                    {flashMessage && flash.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-2 rounded relative">
                            {flash.error}
                        </div>
                    )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                                <table className="w-full text-md text-left text-body">
                                    <thead className="text-md text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                #
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium cursor-pointer" onClick={(e) => searchFeildCLicked('date', '')}>
                                                <div className="px-6 py-3 flex items-center justify-between gap-1">
                                                    Date
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Customer Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Customer Mobile
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Total
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Payment
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <thead className="text-md text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                <TextInput
                                                    type="date"
                                                    name="date"
                                                    defaultValue={queryParams.date}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Date"
                                                    onBlur={e => searchFeildCLicked("date", e.target.value)}
                                                    onKeyPress={e => keyPress("date", e)} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                <TextInput
                                                    type="text"
                                                    name="customer_name"
                                                    defaultValue={queryParams.customer_name}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Customer Name"
                                                    onBlur={e => searchFeildCLicked("customer_name", e.target.value)}
                                                    onKeyPress={e => keyPress("customer_name", e)} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                <TextInput
                                                    type="text"
                                                    name="customer_phone"
                                                    defaultValue={queryParams.customer_phone}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Mobile"
                                                    onBlur={e => searchFeildCLicked("customer_phone", e.target.value)}
                                                    onKeyPress={e => keyPress("customer_phone", e)} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                <SelectInput name="payment_method" defaultValue={queryParams.payment_method} onChange={e => searchFeildCLicked("payment_method", e.target.value)}>
                                                    <option value="">Select Payment</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="card">Card</option>
                                                </SelectInput>
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {orders.data.map((order, index) => (
                                            <tr className="bg-neutral-primary border-b border-default" key={order.id}>
                                                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                    {index + 1}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.customer_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.customer_phone || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={"px-2 py-1 rounded text-white " + (order.payment_method === 'cash' ? 'bg-green-500' : 'bg-blue-500') + " text-white "}>
                                                        {order.payment_method === 'cash' ? 'Cash' : 'Card'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('pos.showOrder', order.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <Pagination links={orders.links} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default Orders
