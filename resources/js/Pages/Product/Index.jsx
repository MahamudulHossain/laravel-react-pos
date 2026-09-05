import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import Pagination from '@/Components/Pagination'
import { STATUS_CLASS_MAP, STATUS_LABEL_MAP } from '@/Constants'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react";


const Index = ({ products, queryParams = null }) => {
    const { flash } = usePage().props;
    // console.log(usePage());
    const [flashMessage, setFlashMessage] = useState(false);

    queryParams = queryParams || {};
    const searchFeildCLicked = (field, value) => {
        queryParams[field] = value
        router.get(route('product.index'), queryParams, { preserveState: true });
    }

    const filterClicked = (field) => {
        queryParams.filterColumn = field
        queryParams.filterDirection = queryParams.filterDirection === 'asc' ? 'desc' : 'asc'
        router.get(route('product.index'), queryParams, { preserveState: true });
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

    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('product.destroy', id));
        }
    }

    const editProduct = (id) => {
        router.get(route('product.edit', id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="page-title">
                        Product List
                    </h2>
                    <button className="btn-create" onClick={() => router.get(route('product.create'))}>Create</button>
                </div>
            }
        >

            <Head title="Product" />

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
                                            <th scope="col" className="cursor-pointer" onClick={(e) => filterClicked('id')}>
                                                <div className="flex items-center justify-between gap-1">
                                                    #
                                                    <div>
                                                        <ChevronUpIcon
                                                            className={"h-4 w-4 " + (queryParams.filterColumn === 'id' && queryParams.filterDirection === 'asc' ? 'text-brand-700' : '')}
                                                        />
                                                        <ChevronDownIcon
                                                            className={"-mt-1 h-4 w-4 " + (queryParams.filterColumn === 'id' && queryParams.filterDirection === 'desc' ? 'text-brand-700' : '')}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th scope="col" className="cursor-pointer" onClick={(e) => filterClicked('name')}>
                                                <div className="flex items-center justify-between gap-1">
                                                    Product Name
                                                    <div>
                                                        <ChevronUpIcon
                                                            className={"h-4 w-4 " + (queryParams.filterColumn === 'name' && queryParams.filterDirection === 'asc' ? 'text-brand-700' : '')}
                                                        />
                                                        <ChevronDownIcon
                                                            className={"-mt-1 h-4 w-4 " + (queryParams.filterColumn === 'name' && queryParams.filterDirection === 'desc' ? 'text-brand-700' : '')}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th scope="col" className="cursor-pointer" onClick={(e) => filterClicked('category_id')}>
                                                <div className="flex items-center justify-between gap-1">
                                                    Category
                                                    <div>
                                                        <ChevronUpIcon
                                                            className={"h-4 w-4 " + (queryParams.filterColumn === 'category_id' && queryParams.filterDirection === 'asc' ? 'text-brand-700' : '')}
                                                        />
                                                        <ChevronDownIcon
                                                            className={"-mt-1 h-4 w-4 " + (queryParams.filterColumn === 'category_id' && queryParams.filterDirection === 'desc' ? 'text-brand-700' : '')}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th scope="col">
                                                Image
                                            </th>
                                            <th scope="col">
                                                Status
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
                                                    type="text"
                                                    name="Product_name"
                                                    defaultValue={queryParams.product_name}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Product Name"
                                                    onBlur={e => searchFeildCLicked("product_name", e.target.value)}
                                                    onKeyPress={e => keyPress("product_name", e)} />
                                            </th>
                                            <th scope="col">

                                            </th>
                                            <th scope="col">

                                            </th>
                                            <th scope="col">
                                                <SelectInput name="status" defaultValue={queryParams.status} onChange={e => searchFeildCLicked("status", e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </SelectInput>
                                            </th>
                                            <th scope="col">

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.map((product, index) => (
                                            <tr key={product.id}>
                                                <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-medium text-ink-900">
                                                    {index + 1}
                                                </th>
                                                <td>
                                                    <Link href={route('product.show', product.id)} className="font-medium text-ink-900 hover:text-brand-700">
                                                        {product.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {product.category.name}
                                                </td>
                                                <td>
                                                    <img className="h-12 w-16 rounded-lg object-cover" src={product.image} alt={product.name} />
                                                </td>
                                                <td>
                                                    <span className={"status-pill text-white " + STATUS_CLASS_MAP[product.status]}>
                                                        {STATUS_LABEL_MAP[product.status]}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => editProduct(product.id)}
                                                        className="link-action mr-3">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="link-danger">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <Pagination links={products.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default Index
