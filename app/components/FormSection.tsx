"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';
import InputField from './InputField';
import CheckboxGroup from './CheckboxGroup';
import FileUpload from './FileUpload';
import SuccessTicket from './SuccessTicket';

// Form şeması tanımı
const formSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  github: z.string().optional(),
  profession: z.string().min(2, 'Mesleğinizi giriniz.'),
  days: z.array(z.string()).min(1, 'En az bir gün seçmelisiniz.'),
  avatar: z.instanceof(File).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

// Bilet veri tipi tanımı
interface TicketData {
  id: string;
  name: string;
  email: string;
  profession: string;
  days: string[];
  avatar: string | null | undefined;
  date: string;
}

export default function FormSection() {
  // State tanımlamaları
  const [submitted, setSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form hook'u yapılandırması
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: [],
    },
    mode: 'onChange',
  });

  // Form seçenekleri
  const gunSecenekleri = [
    { value: 'gun1', label: '22 Kasım: Atölyeler' },
    { value: 'gun2', label: '23 Kasım: Konferanslar' },
    { value: 'gun3', label: '24 Kasım: Ağ Kurma' },
  ];

  // Form gönderim işlemi
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // EmailJS ile e-posta gönderimi
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          to_email: EMAILJS_CONFIG.TO_EMAIL,
          from_name: `${data.firstName} ${data.lastName}`,
          from_email: data.email,
          profession: data.profession,
          github: data.github || 'Belirtilmedi',
          days: data.days.join(', '),
          message: `
            Yeni Kayıt Bilgileri:
            Ad: ${data.firstName}
            Soyad: ${data.lastName}
            E-posta: ${data.email}
            GitHub: ${data.github || 'Belirtilmedi'}
            Meslek: ${data.profession}
            Katılım Günleri: ${data.days.join(', ')}
          `
        }
      );

      // Bilet verisi oluşturma
      const ticket: TicketData = {
        id: `DEV-${Math.floor(Math.random() * 10000)}`,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        profession: data.profession,
        days: data.days,
        avatar: data.avatar ? URL.createObjectURL(data.avatar) : null,
        date: new Date().toLocaleDateString(),
      };
      
      setTicketData(ticket);
      setSubmitSuccess(true);
      
      // Animasyon gecikmesi
      setTimeout(() => {
        setSubmitted(true);
      }, 500);
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      setError('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dosya kontrolü
  const handleFileChange = (file: File | null) => {
    if (file && file.size > 500 * 1024) {
      setFileError('Dosya boyutu 500KB\'dan küçük olmalıdır');
    } else {
      setFileError(null);
    }
  };
  
  // Başarılı form gönderimi sonrası bilet gösterimi
  if (submitted && ticketData) {
    return <SuccessTicket data={ticketData} />;
  }

  return (
    <div className="max-w-xl mx-auto bg-[#1f2937] backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#374151]">
      <div className="mb-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          CodeFusion 2025 Kayıt Formu
        </h3>
        <p className="text-gray-300">
          Konferansa katılmak için lütfen aşağıdaki formu doldurun.
        </p>
      </div>

      {submitSuccess && !submitted && (
        <div className="bg-[#dcfce7] border border-[#86efac] text-[#166534] px-4 py-3 rounded mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p>Form başarıyla gönderildi! Biletiniz hazırlanıyor...</p>
          </div>
          <div className="animate-spin h-5 w-5 border-2 border-[#dcfce7] rounded-full border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="bg-[#dcfce7] border border-[#86efac] text-[#166534] px-4 py-3 rounded mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[#166534] hover:text-[#15803d] focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <div>
              <FileUpload
                id="avatar"
                label="Profil Fotoğrafı (İsteğe Bağlı)"
                description="Sürükle bırak veya tıklayarak fotoğraf yükleyin"
                onChange={(file) => {
                  field.onChange(file);
                  handleFileChange(file);
                }}
                error={errors.avatar?.message || fileError}
                required={false}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField
              id="firstName"
              label="Adınız"
              type="text"
              placeholder="Adınızı giriniz"
              required
              {...register('firstName')}
              error={errors.firstName?.message}
            />
          </div>

          <div>
            <InputField
              id="lastName"
              label="Soyadınız"
              type="text"
              placeholder="Soyadınızı giriniz"
              required
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
        </div>

        <InputField
          id="email"
          label="E-posta Adresi"
          type="email"
          placeholder="ornek@mail.com"
          description="Size bu adres üzerinden ulaşacağız"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <InputField
          id="github"
          label="GitHub Kullanıcı Adı"
          type="text"
          placeholder="@kullaniciadi"
          {...register('github')}
        />

        <InputField
          id="profession"
          label="Mesleğiniz"
          type="text"
          placeholder="Yazılım Mühendisi, Tasarımcı, vb."
          required
          {...register('profession')}
          error={errors.profession?.message}
        />

        <Controller
          name="days"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              name="days"
              label="Katılmak İstediğiniz Günler"
              options={gunSecenekleri}
              description="Birden fazla gün seçebilirsiniz"
              onChange={field.onChange}
              value={field.value}
              error={errors.days?.message}
            />
          )}
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 ${
              isSubmitting 
                ? 'bg-[#60a5fa] cursor-not-allowed' 
                : 'bg-[#3b82f6] hover:bg-[#2563eb]'
            } text-[#ffffff] font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 flex items-center justify-center shadow-md`}
            aria-label="Kaydınızı tamamlayın"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-5 w-5 mr-2 border-2 border-[#ffffff] rounded-full border-t-transparent"></span>
                Gönderiliyor...
              </>
            ) : 'Kaydımı Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}