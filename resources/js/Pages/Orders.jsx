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
                    <h2 className="page-title">
                        Order List
                    </h2>
                </div>
            }
        >

            <Head title="Orders" />

            <div className="py-8">
                <div className="page-shell">
                    {/* Flash Messages */}
                    {flashMessage && flash.success && (
                        <div className="flash-success">
                            {flash.success}
                        </div>
                    )}

                    {flashMessage && flash.error && (
                        <div className="flash-error">
                            {flash.error}
                        </div>
                    )}
                    <div className="surface-card">
                        <div className="p-6 text-ink-900">
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                #
                                            </th>
                                            <th scope="col" className="cursor-pointer" onClick={(e) => searchFeildCLicked('date', '')}>
                                                <div className="flex items-center justify-between gap-1">
                                                    Date
                                                </div>
                                            </th>
                                            <th scope="col">
                                                Customer Name
                                            </th>
                                            <th scope="col">
                                                Customer Mobile
                                            </th>
                                            <th scope="col">
                                                Total
                                            </th>
                                            <th scope="col">
                                                Payment
                                            </th>
                                            <th scope="col">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                            </th>
                                            <th scope="col">
                                                <TextInput
                                                    type="date"
                                                    name="date"
                                                    defaultValue={queryParams.date}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Date"
                                                    onBlur={e => searchFeildCLicked("date", e.target.value)}
                                                    onKeyPress={e => keyPress("date", e)} />
                                            </th>
                                            <th scope="col">
                                                <TextInput
                                                    type="text"
                                                    name="customer_name"
                                                    defaultValue={queryParams.customer_name}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Customer Name"
                                                    onBlur={e => searchFeildCLicked("customer_name", e.target.value)}
                                                    onKeyPress={e => keyPress("customer_name", e)} />
                                            </th>
                                            <th scope="col">
                                                <TextInput
                                                    type="text"
                                                    name="customer_phone"
                                                    defaultValue={queryParams.customer_phone}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Mobile"
                                                    onBlur={e => searchFeildCLicked("customer_phone", e.target.value)}
                                                    onKeyPress={e => keyPress("customer_phone", e)} />
                                            </th>
                                            <th scope="col">
                                            </th>
                                            <th scope="col">
                                                <SelectInput name="payment_method" defaultValue={queryParams.payment_method} onChange={e => searchFeildCLicked("payment_method", e.target.value)}>
                                                    <option value="">Select Payment</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="card">Card</option>
                                                </SelectInput>
                                            </th>
                                            <th scope="col">
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {orders.data.map((order, index) => (
                                            <tr key={order.id}>
                                                <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-medium text-ink-900">
                                                    {index + 1}
                                                </th>
                                                <td>
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {order.customer_name}
                                                </td>
                                                <td>
                                                    {order.customer_phone || 'N/A'}
                                                </td>
                                                <td className="tabular-nums">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td>
                                                    <span className={"status-pill text-white " + (order.payment_method === 'cash' ? 'bg-brand-600' : 'bg-ink-700')}>
                                                        {order.payment_method === 'cash' ? 'Cash' : 'Card'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        href={route('pos.showOrder', order.id)}
                                                        className="link-action mr-3"
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
