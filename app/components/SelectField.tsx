"use client";

import * as React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  options: Option[];
  description?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export default function SelectField({
  id,
  label,
  options,
  description,
  required = false,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        id={id}
        required={required}
        value={value || ''}
        onChange={(e: any) => onChange && onChange(e.target.value)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        className={`w-full px-4 py-2 border bg-white/20 ${
          error ? 'border-red-400' : 'border-white/30'
        } rounded-md focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
        } text-white`}
      >
        <option value="" className="bg-indigo-900">Seçiniz</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-indigo-900">
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : description ? (
        <p id={`${id}-description`} className="mt-1 text-sm text-white/70">
          {description}
        </p>
      ) : null}
    </div>
  );
} 