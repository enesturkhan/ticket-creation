# Konser Bilet Sistemi - Proje Referansı

Bu dosya, projenin yapısı ve geliştirilmesi hakkında bilgiler içerir.

## 🧩 Form Tasarımı Planı

### 🎯 Form Alanları:
- Adınız (text)
- Soyadınız (text)
- E-posta adresi (email)
- Meslek (text)
- Katılım türü (select)
- Katılmak istediği gün(ler) (checkbox list)
- Profil fotoğrafı (dosya - image)
- Gönder butonu (button)

## 📦 Klasör ve Dosya Yapısı

```
/app
  ├── page.tsx             # Ana sayfa
  ├── layout.tsx           # Temel sayfa yapısı
  ├── globals.css          # Global stiller
  ├── form/
  │   └── page.tsx         # Form sayfası
  └── components/
      ├── FormSection.tsx   # Form bileşeni
      ├── InputField.tsx    # Tekil input bileşeni (reusable)
      ├── SelectField.tsx   # Select alanı
      ├── CheckboxGroup.tsx # Gün seçim grubu
      └── FileUpload.tsx    # Avatar alanı
```

## 🎨 Tasarım Özellikleri
- Responsive bir konteyner (max-w-xl mx-auto)
- label + input çiftleri
- placeholder ile ipuçları
- Her alanın altında küçük bir açıklama alanı
- Mobil ve masaüstü görünüm uyumlu

## 🧠 Erişilebilirlik
- Her input için label kullanımı
- htmlFor → id eşleşmesi
- Placeholder açıklayıcı ve label kullanımı
- Dosya inputu için format bilgisi
- Checkbox grubunda her seçenek ayrı label içinde

## 🛠️ Kullanılan Teknolojiler
- **Sayfa & Bileşen yapısı**: Next.js App Router
- **Stil**: Tailwind CSS
- **Form yönetimi**: Temel HTML form (ileride React Hook Form)
- **Doğrulama**: (İleride eklenecek - Zod veya Yup)
- **Dosya yükleme**: Custom FileUpload komponenti

## ✅ Tamamlanan Adımlar
- [x] Form sayfası oluşturuldu
- [x] Temel komponentler oluşturuldu
- [x] Tailwind ile stil verildi
- [x] Responsive tasarım uygulandı

## 🔜 Sonraki Adımlar
- [ ] Form verilerini işleme fonksiyonları
- [ ] Form doğrulama (validation)
- [ ] Başarılı gönderim durumunda bilgilendirme
- [ ] Verilerin saklanması için API
- [ ] Bilet oluşturma ve görüntüleme ekranı 