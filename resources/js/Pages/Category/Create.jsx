import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
const Create = () => {
    const { data, setData, post, errors } = useForm({
        name: '',
        status: '',
    })
    const submitForm = (e) => {
        e.preventDefault()
        post(route('category.store'))
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create New Category
                    </h2>
                </div>
            }
        >
            <Head title="Create Category" />

            <div className="py-6">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form className="space-y-6" onSubmit={submitForm}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <div className="mt-1">
                                        <TextInput
                                            type="text"
                                            name="name"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring focus:ring-indigo-100 focus:ring-opacity-50"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <SelectInput
                                        name="status"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring focus:ring-indigo-100 focus:ring-opacity-50"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </SelectInput>
                                    {errors.status && <span className="text-red-500">{errors.status}</span>}
                                </div>
                                <div className='flex justify-end'>
                                    <button type="submit" className="btn bg-emerald-400 text-white p-2">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default Create
