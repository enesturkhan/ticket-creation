"use client";

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  options: Option[];
  description?: string;
  name: string;
  value?: string[];
  onChange?: (values: string[]) => void;
  error?: string;
}

export default function CheckboxGroup({
  label,
  options,
  description,
  name,
  value = [],
  onChange,
  error,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;
    
    if (checked) {
      // Eger kutucuk isaretlendiyse, degeri ekle
      onChange([...value, optionValue]);
    } else {
      // Eger kutucuk isareti kaldirildiysa, degeri cikar
      onChange(value.filter(val => val !== optionValue));
    }
  };

  return (
    <div className="mb-4">
      <p className="block text-sm font-medium mb-2 text-white">
        {label} {error && <span className="text-red-400">*</span>}
      </p>
      
      <div 
        className="space-y-2" 
        role="group" 
        aria-labelledby={`${name}-group-label`}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="checkbox"
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-white/30 rounded bg-white/20"
            />
            <label 
              htmlFor={`${name}-${option.value}`} 
              className="ml-2 text-sm text-white"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : description ? (
        <p id={`${name}-description`} className="mt-1 text-sm text-white/70">
          {description}
        </p>
      ) : null}
    </div>
  );
} 