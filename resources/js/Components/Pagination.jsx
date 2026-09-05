import React from 'react'
import { Link } from '@inertiajs/react'
const Pagination = ({links}) => {
  return (
    <nav className="mt-4 flex flex-wrap items-center justify-end gap-1 border-t border-ink-100 bg-white px-2 py-3">
        {links.map((link) => (
            <Link
                key={link.label}
                href={link.url || ''}
                className={"min-w-[2.25rem] rounded-lg px-3 py-1.5 text-center text-sm transition duration-150 " + (!link.url ? "cursor-not-allowed text-ink-300 ":"cursor-pointer text-ink-600 hover:bg-ink-50 hover:text-ink-900 ") + (link.active ? "bg-brand-600 font-semibold text-white hover:bg-brand-600 hover:text-white" : "")}
                dangerouslySetInnerHTML={{ __html: link.label }}
                />
        ))}
    </nav>
  )
}

export default Pagination
