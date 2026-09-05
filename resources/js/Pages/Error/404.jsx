import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'

const notFound = () => {
    return (
        <AuthenticatedLayout
            header={null}
        >
            <Head title="Create Category" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card flex justify-center">
                        <div className="p-6 text-ink-900 sm:p-8">
                            <h2 className="page-title">404 | Page Not Found</h2>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default notFound
