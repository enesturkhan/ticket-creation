"use client";

import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      type,
      placeholder,
      description,
      required = false,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-white">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          className={`w-full px-4 py-2 border bg-white/20 ${
            error ? 'border-red-400' : 'border-white/30'
          } rounded-md focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
          } text-white placeholder-white/60`}
          {...props}
        />
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
);

InputField.displayName = 'InputField';

export default InputField; 