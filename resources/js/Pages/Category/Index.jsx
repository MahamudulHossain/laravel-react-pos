import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import Pagination from '@/Components/Pagination'
const Index = ({ categories }) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Product Category List
                </h2>
            }
        >
            <Head title="Category" />

            <div className="py-6">
                <div className="mx-auto max-w-9xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                                <table className="w-full text-md text-left text-body">
                                    <thead className="text-md text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                #
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Category Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Slug
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.data.map((category,index) => (
                                            <tr className="bg-neutral-primary border-b border-default" key={category.id}>
                                                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                    {index+1}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {category.slug}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {category.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <Pagination links={categories.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default Index
