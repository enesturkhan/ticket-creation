"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Bilet icin verilerimizin tipini tanimliyoruz
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
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const getDayLabel = (day: string): string => {
    const dayLabels: Record<string, string> = {
      'gun1': '22 Kasim: Atolyeler',
      'gun2': '23 Kasim: Konferanslar',
      'gun3': '24 Kasim: Ag Kurma',
    };
    return dayLabels[day] || day;
  };

  // Simule edilmis e-posta gonderimi
  const handleSendEmail = async () => {
    setSending(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (error) {
      console.error('E-posta gonderimi basarisiz:', error);
    } finally {
      setSending(false);
    }
  };

  // PDF olarak indirme
  const handleDownloadPdf = async () => {
    const element = document.getElementById('bilet-pdf');
    if (!element) {
      console.error('Bilet elementi bulunamadı');
      return;
    }

    // Elementin görünür olduğundan emin ol
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      console.error('Bilet elementi görünür değil');
      return;
    }

    setDownloadingPdf(true);

    try {
      // İçeriğin tamamen yüklenmesi için bekle
      await new Promise((res) => setTimeout(res, 500));

      // QR kodun yüklenmesini bekle
      const qrImage = element.querySelector('img');
      if (qrImage) {
        await new Promise((resolve) => {
          if (qrImage.complete) {
            resolve(true);
          } else {
            qrImage.onload = () => resolve(true);
            qrImage.onerror = () => resolve(false);
          }
        });
      }

      // Canvas oluştur
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        onclone: (clonedDoc) => {
          // Klonlanmış dokümanda elementin görünür olduğundan emin ol
          const clonedElement = clonedDoc.getElementById('bilet-pdf');
          if (clonedElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
          }
        }
      });

      // Canvas'ı PNG'ye çevir
      const imgData = canvas.toDataURL('image/png', 1.0);

      // PDF oluştur
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Görüntüyü PDF'e ekle
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // PDF'i indir
      pdf.save(`CodeFusion2025-Bilet-${data.id}.pdf`);

    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // QR Kodu icin rastgele veriler olusturuyoruz
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CODEFUSION2025-${data.id}-${encodeURIComponent(data.email)}`;

  // Sosyal medyada paylasma fonksiyonu
  const handleShare = async () => {
    if (typeof window === 'undefined' || !navigator) {
      console.error('Sharing can only be performed in a browser environment');
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeFusion 2025 Biletim',
          text: `CodeFusion 2025'e katiliyorum! ${data.days.length} gun boyunca muhtesem etkinlikler icin heyecanliyim.`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Paylasma hatasi:', error);
      }
    } else {
      alert('Tarayiciniz paylasma ozelligini desteklemiyor. Baglantiyi kopyalayip manuel olarak paylasabilirsiniz.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/30 mb-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-white/20 p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-10 h-10 text-green-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Kayit Basarili!
          </h1>
          <p className="text-white/80 mb-8">
            CodeFusion 2025 etkinligine katiliminiz onaylandi. Bilet detaylariniz asagidadir.
          </p>

          {emailSent ? (
            <div className="bg-green-400/20 border border-green-500/30 text-green-100 px-4 py-3 rounded mb-6 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p>Biletiniz <strong>{data.email}</strong> adresine gonderildi.</p>
            </div>
          ) : (
            <button 
              onClick={handleSendEmail}
              disabled={sending}
              className={`mb-6 inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {sending ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></span>
                  Gonderiliyor...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Bileti E-posta Olarak Al
                </>
              )}
            </button>
          )}
        </div>

        <div ref={ticketRef} id="bilet-pdf" className="bg-white rounded-lg overflow-hidden shadow-lg mb-6">
          {/* Bilet Basligi */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6 flex justify-between items-center">
            <div>
              <h2 className="text-white font-bold text-lg">CodeFusion 2025</h2>
              <p className="text-white/80 text-sm">Yazilim Gelistirici Konferansi</p>
            </div>
            <div className="text-white text-sm text-right">
              <p>Bilet No: {data.id}</p>
              <p>{data.date}</p>
            </div>
          </div>

          {/* QR Kodu ve Kullanici Bilgileri */}
          <div className="flex flex-col md:flex-row">
            {/* Kullanici Bilgileri */}
            <div className="p-6 flex-1">
              <div className="flex items-start gap-4 mb-6">
                {data.avatar ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-purple-100">
                    <Image
                      src={data.avatar}
                      alt={data.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl border-4 border-purple-100">
                    {data.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">{data.name}</h3>
                  <p className="text-gray-600">{data.profession}</p>
                  <p className="text-gray-500 text-sm">{data.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Meslek</p>
                <p className="font-medium text-gray-800">{data.profession}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Etkinlik Gunleri</p>
                <div className="space-y-1">
                  {data.days.map((day) => (
                    <div key={day} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-700">{getDayLabel(day)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">Etkinlik Yeri</p>
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">Teknoloji Merkezi</p>
                    <p className="text-gray-600">Ankara, Turkiye</p>
                    <p className="text-gray-500 text-sm">Kongre Salonu, Kat 3</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Kodu */}
            <div className="bg-gray-50 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-200">
              <div className="mb-4 bg-white p-2 rounded-lg shadow-md">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code"
                  width={120} 
                  height={120} 
                  className="rounded-md"
                />
              </div>
              <p className="text-xs text-center text-gray-500 max-w-[150px]">
                Bu QR kodu etkinlige giris icin tarattiriniz
              </p>
            </div>
          </div>
          
          {/* Bilet Alt Bilgisi */}
          <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">22-24 Kasim 2025</span> • Kapi Acilis: 08:30
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className={`flex-1 py-2 px-4 rounded-full ${
              downloadingPdf ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center shadow-md`}
          >
            {downloadingPdf ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></span>
                Hazirlaniyor...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF Olarak İndir
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-2 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center shadow-md"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Paylas
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <Link 
          className="inline-flex items-center py-2 px-4 text-indigo-100 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          href="/"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfaya Don
        </Link>
      </div>
    </div>
  );
} 