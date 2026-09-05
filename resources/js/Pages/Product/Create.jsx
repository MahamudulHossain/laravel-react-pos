import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
import TextAreaInput from '@/Components/TextAreaInput'
const Create = ({ categories }) => {
    const { data, setData, post, errors } = useForm({
        name: '',
        category_id: '',
        description: '',
        price: '',
        quantity: '',
        image: '',
        status: '',
    })
    const submitForm = (e) => {
        e.preventDefault()
        post(route('product.store'))
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="page-title">
                        Create New Product
                    </h2>
                </div>
            }
        >
            <Head title="Create Product" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card">
                        <div className="p-6 text-ink-900 sm:p-8">
                            <form className="space-y-6" onSubmit={submitForm}>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700">Image</label>
                                    <div className="mt-1">
                                        <input type="file" onChange={(e) => setData('image', e.target.files[0])}
                                            className="block w-full text-sm text-ink-600 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                                        />
                                        {errors.image && <span className="text-sm font-medium text-red-500">{errors.image}</span>}
                                    </div>
                                </div>
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
                                    <label className="block text-sm font-semibold text-ink-700">Description</label>
                                    <div className="mt-1">
                                        <TextAreaInput
                                            type="text"
                                            name="description"
                                            className="block w-full"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        ></TextAreaInput>
                                        {errors.description && <span className="text-sm font-medium text-red-500">{errors.description}</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700">Category</label>
                                    <SelectInput
                                        name="status"
                                        className="mt-1 block w-full"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    {errors.status && <span className="text-sm font-medium text-red-500">{errors.status}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700">Quantity</label>
                                    <div className="mt-1">
                                        <TextInput
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            name="quantity"
                                            className="block w-full"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                        />
                                        {errors.quantity && <span className="text-sm font-medium text-red-500">{errors.quantity}</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700">Unit Price</label>
                                    <div className="mt-1">
                                        <TextInput
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            name="price"
                                            className="block w-full"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                        />
                                        {errors.price && <span className="text-sm font-medium text-red-500">{errors.price}</span>}
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
                                    <button type="submit" className="btn-create">Create</button>
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
