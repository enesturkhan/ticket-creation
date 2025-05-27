"use client";

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface TicketData {
  id: string;
  name: string;
  email: string;
  profession: string;
  days: string[];
  avatar: string | null | undefined;
  date: string;
}

interface SuccessTicketProps {
  data: TicketData;
}

export default function SuccessTicket({ data }: SuccessTicketProps) {
  // QR Kodu için veri oluştur
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CODEFUSION2025-${data.id}-${encodeURIComponent(data.email)}`;

  const handleDownload = async () => {
    const element = document.getElementById('bilet-pdf');
    if (!element) return;

    try {
      // Butonları gizle
      const buttons = element.querySelectorAll('button');
      buttons.forEach(button => {
        button.style.display = 'none';
      });

      // QR kodun yüklenmesini bekle
      const qrImage = element.querySelector('img[alt="QR Code"]');
      if (qrImage) {
        await new Promise((resolve) => {
          if ((qrImage as HTMLImageElement).complete) {
            resolve(true);
          } else {
            (qrImage as HTMLImageElement).onload = () => resolve(true);
            (qrImage as HTMLImageElement).onerror = () => resolve(false);
          }
        });
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1f2937'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`codefusion-ticket-${data.id}.pdf`);

      // Butonları tekrar göster
      buttons.forEach(button => {
        button.style.display = '';
      });
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeFusion 2025 Biletim',
          text: `${data.name} olarak CodeFusion 2025 etkinliğine katılıyorum!`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Paylaşım hatası:', error);
      }
    } else {
      // Fallback: URL'yi panoya kopyala
      navigator.clipboard.writeText(window.location.href);
      alert('Bilet linki panoya kopyalandı!');
    }
  };

  const handleEmail = async () => {
    const subject = 'CodeFusion 2025 Biletim';
    const body = `${data.name} olarak CodeFusion 2025 etkinliğine katılıyorum!\n\nBilet detayları:\n- Bilet No: ${data.id}\n- Katılım Tarihleri: ${data.days.map(day => {
      let date;
      switch(day) {
        case 'gun1': date = new Date('2025-11-22'); break;
        case 'gun2': date = new Date('2025-11-23'); break;
        case 'gun3': date = new Date('2025-11-24'); break;
        default: return '';
      }
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    }).join(', ')}\n\nBilet linki: ${window.location.href}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="max-w-xl mx-auto">
      <div id="bilet-pdf" className="relative w-full max-w-2xl mx-auto bg-[#1f2937] rounded-2xl overflow-hidden shadow-2xl border border-[#4b5563]">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#111827] opacity-90"></div>
        
        {/* Content Container */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">CodeFusion 2025</h2>
                <p className="text-[#9ca3af] text-sm">Biletiniz Hazır!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#9ca3af] text-xs">Bilet No</p>
              <p className="text-white font-mono text-sm">{data.id}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column - User Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-[#374151] rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {data.avatar ? (
                    <img
                      src={data.avatar}
                      alt="Profil"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#3b82f6]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#4b5563] flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{data.name}</h3>
                    <p className="text-[#9ca3af] text-sm">{data.profession}</p>
                    <p className="text-[#9ca3af] text-sm">{data.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#374151] rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Katılım Tarihleri</h3>
                <div className="space-y-2">
                  {data.days.map((day, index) => {
                    // Gün numarasına göre tarih oluştur
                    let date;
                    switch(day) {
                      case 'gun1':
                        date = new Date('2025-11-22');
                        break;
                      case 'gun2':
                        date = new Date('2025-11-23');
                        break;
                      case 'gun3':
                        date = new Date('2025-11-24');
                        break;
                      default:
                        console.error('Bilinmeyen gün:', day);
                        return null;
                    }

                    const formattedDate = date.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    return (
                      <div key={index} className="flex items-center text-white text-sm">
                        <svg className="w-4 h-4 text-[#3b82f6] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formattedDate}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#374151] rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Etkinlik Detayları</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-white text-sm">
                    <svg className="w-4 h-4 text-[#3b82f6] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    22-24 Kasım 2025
                  </div>
                  <div className="flex items-center text-white text-sm">
                    <svg className="w-4 h-4 text-[#3b82f6] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    İstanbul Kongre Merkezi
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="bg-[#374151] rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code"
                  width={120} 
                  height={120} 
                  className="rounded-md"
                />
              </div>
              <p className="text-[#9ca3af] text-sm text-center">
                Bu QR kodu etkinliğe giriş için taratınız
              </p>
            </div>
          </div>

          {/* Footer - Buttons */}
          <div className="mt-6 pt-4 border-t border-[#4b5563]">
            <p className="text-[#9ca3af] text-sm text-center mb-4">
              Salona girişiniz için bu bilet gereklidir
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleDownload}
                className="w-full max-w-xs px-6 py-2 bg-[#3b82f6] text-white rounded-full hover:bg-[#2563eb] transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>PDF İndir</span>
              </button>
              <button
                onClick={handleEmail}
                className="w-full max-w-xs px-6 py-2 bg-[#3b82f6] text-white rounded-full hover:bg-[#2563eb] transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>E-posta Gönder</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full max-w-xs px-6 py-2 bg-[#374151] text-white rounded-full hover:bg-[#4b5563] transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 