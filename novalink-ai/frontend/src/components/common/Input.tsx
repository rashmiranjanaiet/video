'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-dark-secondary text-white
            border border-dark-tertiary hover:border-neon-blue/50
            focus:border-neon-blue focus:outline-none
            transition-all duration-200
            glass
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}
