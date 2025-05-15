"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  accept?: string;
  error?: string | null;
  onChange?: (file: File | null) => void;
}

export default function FileUpload({
  id,
  label,
  description = 'Dosya yuklemek icin tiklayin veya surukleyin.',
  required = false,
  accept = 'image/jpeg, image/png',
  error,
  onChange,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya degistiginde onChange prop fonksiyonunu cagir
  useEffect(() => {
    if (onChange) {
      onChange(selectedFile);
    }
  }, [selectedFile, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Onizleme olustur
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Onizleme olustur
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Dosya girisini guncelle
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  // Dosyayi temizler
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <p className="block text-sm font-medium mb-1 text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </p>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed ${
          error ? 'border-red-400' : 'border-white/30 hover:border-indigo-400'
        } rounded-md cursor-pointer transition-colors bg-white/10`}
        role="button"
        tabIndex={0}
        aria-describedby={error ? `${id}-error` : `${id}-description`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <div className="space-y-3 text-center">
          {preview ? (
            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-indigo-300/30">
                <Image 
                  src={preview}
                  alt="Onizleme"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 text-xs text-red-300 hover:text-red-400"
                aria-label="Fotografi kaldir"
              >
                Kaldir
              </button>
            </div>
          ) : (
            <svg
              className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-white/60'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          
          <div className="flex text-sm text-white/80">
            <input
              ref={fileInputRef}
              id={id}
              name={id}
              type="file"
              accept={accept}
              required={required}
              onChange={handleFileChange}
              className="sr-only"
              aria-label={label}
            />
            <p id={`${id}-description`} className="pl-1">{selectedFile ? selectedFile.name : description}</p>
          </div>
          <p className="text-xs text-white/60">
            PNG, JPG (Maksimum: 500KB)
          </p>
        </div>
      </div>
      
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
} 