"use client";

import React from 'react';
import FormSection from '../components/FormSection';
import Header from '../components/Header';

export default function FormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* Header Kismi */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Yazilim Dunyasinin En Buyuk Bulusmasi
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            22-24 Kasim 2025 tarihlerinde Istanbul&apos;da gerceklesecek konferans icin asagidaki formu doldurarak yerinizi hemen ayirtin.
          </p>
        </div>
        
        {/* Form Bolumu */}
        <FormSection />
        
        {/* Alt Bilgi */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">Form ile ilgili herhangi bir sorunuz varsa, <a href="mailto:info@codefusion.org" className="underline hover:text-white">info@codefusion.org</a> adresine e-posta gonderebilirsiniz.</p>
        </div>
      </div>
    </div>
  );
} 