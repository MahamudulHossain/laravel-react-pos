import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import Pagination from '@/Components/Pagination'
import { STATUS_CLASS_MAP, STATUS_LABEL_MAP } from '@/Constants'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
import { ChevronUpIcon,ChevronDownIcon} from '@heroicons/react/24/solid'
const Index = ({ categories, queryParams = null }) => {
    queryParams = queryParams || {};
    const searchFeildCLicked = (field,value) => {
        queryParams[field] = value
        router.get(route('category.index'), queryParams, { preserveState: true });
    }

    const filterClicked = (field) => {
        queryParams.filterColumn = field
        queryParams.filterDirection = queryParams.filterDirection === 'asc' ? 'desc' : 'asc'
        router.get(route('category.index'), queryParams, { preserveState: true });
    }

    const keyPress = (field,e) => {
        if (e.key !== 'Enter') return;
        searchFeildCLicked(field,e.target.value);
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Product Category List
                    </h2>
                    <button className="btn bg-emerald-400 text-white p-2" onClick={() => router.get(route('category.create'))}>Create</button>
                </div>
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
                                            <th scope="col" className="font-medium cursor-pointer" onClick={(e) =>filterClicked('id')}>
                                                <div className="px-6 py-3 flex items-center justify-between gap-1">
                                                    #
                                                    <div>
                                                        <ChevronUpIcon
                                                            className={"w-4 h-4 " + (queryParams.filterColumn === 'id' && queryParams.filterDirection === 'asc' ? 'text-blue-700' : '')}
                                                        />
                                                        <ChevronDownIcon
                                                            className={"w-4 h-4 -mt-1 " + (queryParams.filterColumn === 'id' && queryParams.filterDirection === 'desc' ? 'text-blue-700' : '')}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium cursor-pointer" onClick={(e) =>filterClicked('name')}>
                                                <div className="px-6 py-3 flex items-center justify-between gap-1">
                                                    Category Name
                                                    <div>
                                                        <ChevronUpIcon
                                                            className={"w-4 h-4 " + (queryParams.filterColumn === 'name' && queryParams.filterDirection === 'asc' ? 'text-blue-700' : '')}
                                                        />
                                                        <ChevronDownIcon
                                                            className={"w-4 h-4 -mt-1 " + (queryParams.filterColumn === 'name' && queryParams.filterDirection === 'desc' ? 'text-blue-700' : '')}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium cursor-pointer" onClick={(e) =>filterClicked('slug')}>
                                                <div className="px-6 py-3 flex items-center justify-between gap-1">
                                                    Slug
                                                    <div>
                                                        <ChevronUpIcon
                                                            className={"w-4 h-4 " + (queryParams.filterColumn === 'slug' && queryParams.filterDirection === 'asc' ? 'text-blue-700' : '')}
                                                        />
                                                        <ChevronDownIcon
                                                            className={"w-4 h-4 -mt-1 " + (queryParams.filterColumn === 'slug' && queryParams.filterDirection === 'desc' ? 'text-blue-700' : '')}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Status
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
                                                    type="text"
                                                    name="category_name"
                                                    defaultValue={queryParams.category_name}
                                                    className="mt-1 block w-full"
                                                    placeholder="Search Category Name"
                                                    onBlur={e => searchFeildCLicked("category_name",e.target.value)}
                                                    onKeyPress={e => keyPress("category_name",e)} />
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">

                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                <SelectInput name="status" defaultValue={queryParams.status} onChange={e => searchFeildCLicked("status",e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </SelectInput>
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">

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
                                                    <span className={"px-2 py-1 rounded text-white " + STATUS_CLASS_MAP[category.status]}>
                                                        {STATUS_LABEL_MAP[category.status]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
                                                    <Link href="#" className="text-red-600 hover:text-red-900">Delete</Link>
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
