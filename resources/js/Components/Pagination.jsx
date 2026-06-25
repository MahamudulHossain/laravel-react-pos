import React from 'react'
import { Link } from '@inertiajs/react'
const Pagination = ({links}) => {
    // console.log(links);
  return (
    <nav className="flex items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        {links.map((link) => (
            <Link
                key={link.label}
                href={link.url || ''}
                className={"text-center mt-4 text-sm text-gray-700 hover:text-gray-900 px-4 " + (!link.url ? "cursor-not-allowed opacity-50 ":" ") + (link.active ? "font-semibold text-indigo-600" : "")}
                dangerouslySetInnerHTML={{ __html: link.label }}
                />
        ))}
    </nav>
  )
}

export default Pagination
