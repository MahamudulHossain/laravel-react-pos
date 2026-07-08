import React from 'react'

export default function PrintOrder({order}) {
  return (
    <div>
        {JSON.stringify(order)}
    </div>
  )
}
