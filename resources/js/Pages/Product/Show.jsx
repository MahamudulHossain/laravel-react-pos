import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
const Show = ({ product }) => {

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Product Details
                    </h2>
                </div>
            }
        >
            <Head title="Show Product" />

            <div className="py-6">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex gap-4">
                            {/* image */}
                            <div className='flex-1'>
                                {product.image_url && <img  src={product.image_url} alt={product.name} />}
                            </div>
                            {/* Details */}
                            <div className='p-5 bg-slate-300 flex-1'>
                                <h2 className='text-2xl font-bold'>{product.name}</h2>
                                <p className='mt-3 text-gray-600'>{product.description}</p>
                                <p className='text-gray-600 mt-2'><span className='text-zinc-800  uppercase'>Category:</span> <span className='p-1 bg-emerald-50 rounded-md '>{product.category.name}</span>
                                </p>
                                <p className='text-gray-600 mt-2'><span className='text-zinc-800  uppercase'>Price:</span> <span className='p-1 bg-emerald-50 rounded-md '>{product.price}</span>
                                </p>
                                <p className='text-gray-600 mt-2'><span className='text-zinc-800  uppercase'>Quantity:</span> <span className='p-1 bg-emerald-50 rounded-md '>{product.quantity}</span>
                                </p>
                                <p className='text-gray-600 mt-2'><span className='text-zinc-800  uppercase'>Status:</span> <span className='p-1 bg-emerald-50 rounded-md '>{product.status}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default Show
