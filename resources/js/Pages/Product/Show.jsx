import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
const Show = ({ product }) => {

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="page-title">
                        Product Details
                    </h2>
                </div>
            }
        >
            <Head title="Show Product" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card">
                        <div className="flex flex-col gap-6 p-6 text-ink-900 md:flex-row">
                            <div className='flex-1'>
                                {product.image_url && <img className="w-full rounded-2xl object-cover" src={product.image_url} alt={product.name} />}
                            </div>
                            <div className='flex-1 rounded-2xl bg-ink-50 p-6'>
                                <h2 className='font-display text-2xl font-bold text-ink-900'>{product.name}</h2>
                                <p className='mt-3 text-ink-600'>{product.description}</p>
                                <p className='mt-4 text-ink-600'><span className='font-semibold uppercase tracking-wide text-ink-800'>Category:</span> <span className='ml-1 rounded-lg bg-brand-50 px-2 py-1 text-brand-800'>{product.category.name}</span>
                                </p>
                                <p className='mt-3 text-ink-600'><span className='font-semibold uppercase tracking-wide text-ink-800'>Price:</span> <span className='ml-1 rounded-lg bg-brand-50 px-2 py-1 tabular-nums text-brand-800'>{product.price}</span>
                                </p>
                                <p className='mt-3 text-ink-600'><span className='font-semibold uppercase tracking-wide text-ink-800'>Quantity:</span> <span className='ml-1 rounded-lg bg-brand-50 px-2 py-1 tabular-nums text-brand-800'>{product.quantity}</span>
                                </p>
                                <p className='mt-3 text-ink-600'><span className='font-semibold uppercase tracking-wide text-ink-800'>Status:</span> <span className='ml-1 rounded-lg bg-brand-50 px-2 py-1 text-brand-800'>{product.status}</span>
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
