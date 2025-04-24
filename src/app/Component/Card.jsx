import React from 'react'

function Card({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-gray-500 flex items-center space-x-2">
          {icon && <span className={`text-${color}-500 text-lg`}>{icon}</span>}
          {title}
        </p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  )
}

export default Card;
