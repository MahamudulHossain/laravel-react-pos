import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
const Edit = ({ category }) => {
    const { data, setData, post, errors, } = useForm({
        name: category.name,
        status: category.status,
        _method: 'put'
    })
    const submitForm = (e) => {
        e.preventDefault()
        post(route('category.update', category.id))
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="page-title">
                        Edit Category
                    </h2>
                </div>
            }
        >
            <Head title="Edit Category" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card">
                        <div className="p-6 text-ink-900 sm:p-8">
                            <form className="space-y-6" onSubmit={submitForm}>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700">Name</label>
                                    <div className="mt-1">
                                        <TextInput
                                            type="text"
                                            name="name"
                                            className="block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <span className="text-sm font-medium text-red-500">{errors.name}</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700">Status</label>
                                    <SelectInput
                                        name="status"
                                        className="mt-1 block w-full"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </SelectInput>
                                    {errors.status && <span className="text-sm font-medium text-red-500">{errors.status}</span>}
                                </div>
                                <div className='flex justify-end'>
                                    <button type="submit" className="btn-create">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default Edit
