"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import Header from './components/Header';
import EventSchedulePopup from './components/EventSchedulePopup';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Konferans tarihi - gelecekte bir tarih
    const conferenceDate = new Date('2025-11-22T09:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = conferenceDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Başlık ve Geri Sayım - Her zaman tam genişlikte */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-white">
            CodeFusion 2025 Yolculuğunuz Burada Başlıyor! 
          </h2>
          <p className="text-gray-300 mb-2">
            &ldquo;Kodun birleştirdiği fikirler burada buluşuyor.&rdquo;
          </p>
          <p className="text-gray-300 mb-8">
            Gelecek yılın en büyük kodlama konferansında yerinizi ayırtın.
          </p>
          
          {/* Geri Sayım */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-5 mb-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-3 text-white">Konferansa Kalan Süre</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col">
                <div className="bg-blue-500 rounded-lg py-2 px-1 text-2xl font-bold text-white shadow-md">
                  {timeLeft.days}
                </div>
                <span className="text-xs mt-1 text-gray-300">Gün</span>
              </div>
              <div className="flex flex-col">
                <div className="bg-blue-500 rounded-lg py-2 px-1 text-2xl font-bold text-white shadow-md">
                  {timeLeft.hours}
                </div>
                <span className="text-xs mt-1 text-gray-300">Saat</span>
              </div>
              <div className="flex flex-col">
                <div className="bg-blue-500 rounded-lg py-2 px-1 text-2xl font-bold text-white shadow-md">
                  {timeLeft.minutes}
                </div>
                <span className="text-xs mt-1 text-gray-300">Dakika</span>
              </div>
              <div className="flex flex-col">
                <div className="bg-blue-500 rounded-lg py-2 px-1 text-2xl font-bold text-white shadow-md">
                  {timeLeft.seconds}
                </div>
                <span className="text-xs mt-1 text-gray-300">Saniye</span>
              </div>
            </div>
          </div>

          {/* Kayıt Ol Butonu - Geri sayımın altında, tam genişlikte */}
          <Link 
            href="/form" 
            className="block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full transition-colors text-center shadow-md"
          >
            Şimdi Kayıt Ol
          </Link>
        </div>
        
        {/* İki Sütunlu İçerik - Masaüstü için yan yana, mobil için alt alta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-6">
          {/* Sol Sütun - Neden Katılmalısınız */}
          <div>
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700">
              <h3 className="font-medium mb-4 text-white">Neden Katılmalısınız?</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Sektör liderleriyle ağ kurun</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>En son teknolojileri öğrenin</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Uygulamalı atölyelere katılın</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>Özel iş fırsatları yakalayın</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Sağ Sütun - Program (EventSchedulePopup bileşeni) */}
          <EventSchedulePopup />
        </div>
        
        <div className="text-center text-gray-400 text-sm mt-10">
          <p>Sınırlı sayıda koltuk. Erken kayıt indirimi yakında kapanıyor.</p>
          <p className="mt-1">22-24 Kasım 2025, İstanbul</p>
        </div>
      </main>
    </div>
  );
}
