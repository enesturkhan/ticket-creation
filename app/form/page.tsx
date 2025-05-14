import React from 'react';
import FormSection from '../components/FormSection';
import Header from '../components/Header';

export const metadata = {
  title: 'CodeFusion 2025 - Kayıt Formu',
  description: 'Yazılım dünyasının en büyük konferansı için kayıt formunu doldurun.',
};

export default function FormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* Header Kısmı */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Yazılım Dünyasının En Büyük Buluşması
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            22-24 Kasım 2025 tarihlerinde İstanbul&apos;da gerçekleşecek konferans için aşağıdaki formu doldurarak yerinizi hemen ayırtın.
          </p>
        </div>
        
        {/* Form Bölümü */}
        <FormSection />
        
        {/* Alt Bilgi */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">Form ile ilgili herhangi bir sorunuz varsa, <a href="mailto:info@codefusion.org" className="underline hover:text-white">info@codefusion.org</a> adresine e-posta gönderebilirsiniz.</p>
        </div>
      </div>
    </div>
  );
} 