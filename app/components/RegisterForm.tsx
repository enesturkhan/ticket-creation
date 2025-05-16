"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

interface FormData {
  name: string;
  email: string;
  profession: string;
  days: string[];
  avatar: string | null;
}

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    profession: '',
    days: [],
    avatar: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('E-posta gönderiliyor...', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID,
        toEmail: EMAILJS_CONFIG.TO_EMAIL
      });

      // EmailJS ile e-posta gönder
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          to_email: EMAILJS_CONFIG.TO_EMAIL,
          from_name: formData.name,
          from_email: formData.email,
          profession: formData.profession,
          days: formData.days.join(', '),
          message: `Yeni kayıt:\nİsim: ${formData.name}\nE-posta: ${formData.email}\nMeslek: ${formData.profession}\nKatılım Günleri: ${formData.days.join(', ')}`
        }
      );

      console.log('E-posta gönderildi:', result);

      // Bilet sayfasına yönlendir
      router.push(`/success?data=${encodeURIComponent(JSON.stringify(formData))}`);
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      // Hata durumunda sessizce devam et
      router.push(`/success?data=${encodeURIComponent(JSON.stringify(formData))}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          İsim Soyisim
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md bg-[#374151] border-[#4b5563] text-white shadow-sm focus:border-[#3b82f6] focus:ring-[#3b82f6]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          E-posta
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md bg-[#374151] border-[#4b5563] text-white shadow-sm focus:border-[#3b82f6] focus:ring-[#3b82f6]"
        />
      </div>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium text-white">
          Meslek
        </label>
        <select
          id="profession"
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md bg-[#374151] border-[#4b5563] text-white shadow-sm focus:border-[#3b82f6] focus:ring-[#3b82f6]"
        >
          <option value="">Seçiniz</option>
          <option value="Yazılım Geliştirici">Yazılım Geliştirici</option>
          <option value="DevOps Mühendisi">DevOps Mühendisi</option>
          <option value="UI/UX Tasarımcı">UI/UX Tasarımcı</option>
          <option value="Proje Yöneticisi">Proje Yöneticisi</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Katılım Günleri
        </label>
        <div className="space-y-2">
          {['gun1', 'gun2', 'gun3'].map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.days.includes(day)}
                onChange={() => handleDayChange(day)}
                className="rounded bg-[#374151] border-[#4b5563] text-[#3b82f6] focus:ring-[#3b82f6]"
              />
              <span className="text-white">
                {day === 'gun1' ? '22 Kasım 2025' : day === 'gun2' ? '23 Kasım 2025' : '24 Kasım 2025'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-white">
          Profil Fotoğrafı
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={handleAvatarChange}
          className="mt-1 block w-full text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]"
      >
        Kayıt Ol
      </button>
    </form>
  );
} 