"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// @ts-expect-error - html2pdf.js için tip tanımı yok
import html2pdf from 'html2pdf.js';

// Bilet için verilerimizin tipini tanımlıyoruz
interface TicketData {
  id: string;
  name: string;
  email: string;
  profession: string;
  type: string;
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

  const getTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      'izleyici': 'Izleyici',
      'konusmaci': 'Konusmaci',
      'sponsor': 'Sponsor',
    };
    return typeLabels[type] || type;
  };

  // Simüle edilmiş e-posta gönderimi
  const handleSendEmail = async () => {
    setSending(true);
    
    try {
      // Gerçek e-posta gönderimi yerine bir gecikme ekleyerek simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (error) {
      console.error('E-posta gönderimi başarısız:', error);
    } finally {
      setSending(false);
    }
  };
  
  // PDF olarak indirme
  const handleDownloadPdf = () => {
    if (!ticketRef.current) return;
    
    setDownloadingPdf(true);
    
    const element = ticketRef.current;
    const opt = {
      margin: 10,
      filename: `CodeFusion2025-Bilet-${data.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true 
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };
    
    // Daha sağlam bir PDF oluşturma yaklaşımı
    const worker = html2pdf().from(element).set(opt);
    
    worker.save()
      .then(() => {
        console.log('PDF başarıyla oluşturuldu');
        setDownloadingPdf(false);
      })
      .catch((error: Error) => {
        console.error('PDF oluşturma hatası:', error);
        setDownloadingPdf(false);
        alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      });
  };

  // QR Kodu için rastgele veriler oluşturuyoruz (gerçekte bilet ID'si kullanılabilir)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CODEFUSION2025-${data.id}-${encodeURIComponent(data.email)}`;

  // Sosyal medyada paylaşma fonksiyonu
  const handleShare = async () => {
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

        <div ref={ticketRef} className="bg-white rounded-lg overflow-hidden shadow-lg mb-6">
          {/* Bilet Başlığı */}
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

          {/* QR Kodu ve Kullanıcı Bilgileri */}
          <div className="flex flex-col md:flex-row">
            {/* Kullanıcı Bilgileri */}
            <div className="p-6 flex-1">
              <div className="flex items-start gap-4 mb-6">
                {data.avatar ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-purple-100">
                    <Image
                      src={data.avatar}
                      alt={data.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center bg-purple-100 rounded-full">
                    <span className="text-purple-700 font-bold text-xl">
                      {data.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{data.name}</h3>
                  <p className="text-gray-600">{data.profession}</p>
                  <p className="text-gray-500 text-sm">{data.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Katilim Turu</p>
                    <p className="font-medium">{getTypeLabel(data.type)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Katilim Gunleri</p>
                    <div>
                      {data.days.map((day) => (
                        <span key={day} className="inline-block bg-purple-100 text-purple-700 text-xs font-medium rounded-full px-2 py-1 mr-1 mb-1">
                          {getDayLabel(day)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Kodu */}
            <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-md shadow-md">
                <Image 
                  src={qrCodeUrl}
                  alt="Bilet QR Kodu"
                  width={120}
                  height={120}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">Etkinlige giriste bu QR kodu gosteriniz</p>
            </div>
          </div>

          {/* Alt Kısım */}
          <div className="bg-gray-50 py-4 px-6 flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              22-24 Kasim 2025
            </p>
            <p className="text-gray-600 text-sm">
              İstanbul Kongre Merkezi
            </p>
          </div>
        </div>

        {/* Paylaş, İndir ve PDF Butonları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center w-full">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors w-full"
          >
            <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="whitespace-nowrap">Bileti Paylaş</span>
          </button>
          
          <a 
            href={qrCodeUrl}
            download={`CodeFusion2025-QR-${data.id}.png`}
            className="flex items-center justify-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors w-full"
          >
            <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="whitespace-nowrap">QR Kodu İndir</span>
          </a>
          
          <button 
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center justify-center px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors w-full"
          >
            {downloadingPdf ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent flex-shrink-0"></span>
                <span className="whitespace-nowrap">PDF Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <span className="whitespace-nowrap">PDF Olarak İndir</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full transition-colors shadow-md"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
} 