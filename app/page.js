"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [excludeSpaces, setExcludeSpaces] = useState(false);
  const [characterLimit, setCharacterLimit] = useState(false);
  const [limitValue, setLimitValue] = useState(500);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [letterDensity, setLetterDensity] = useState({});
  const [readingTime, setReadingTime] = useState(0);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const textareaRef = useRef(null);

  // Klavye navigasyon algılama
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-focus');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-focus');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Tema ayarları
  useEffect(() => {
    // Sistem tercihini kontrol et
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Başlangıç temasını ayarla
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevState => !prevState);
    document.documentElement.classList.toggle('dark');
  }, []);

  // Metin analiz fonksiyonu
  useEffect(() => {
    if (text) {
      // Karakter sayısı
      const chars = excludeSpaces ? text.replace(/\s/g, '').length : text.length;
      setCharCount(chars);
      
      // Kelime sayısı
      const words = text.trim().split(/\s+/).filter(word => word !== '').length;
      setWordCount(words);
      
      // Cümle sayısı
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '').length;
      setSentenceCount(sentences);
      
      // Okuma süresi (ortalama kişi dakikada ~225 kelime okur)
      const readTime = Math.max(1, Math.ceil(words / 225));
      setReadingTime(readTime);
      
      // Karakter sınırını kontrol et
      setIsLimitExceeded(characterLimit && chars > limitValue);
      
      // Harf yoğunluğu analizi
      const letters = text.toLowerCase().replace(/[^a-z]/g, '');
      const density = {};
      
      for (const letter of letters) {
        density[letter] = (density[letter] || 0) + 1;
      }
      
      // Frekansa göre sırala ve ilk 5'i al
      const sortedDensity = Object.entries(density)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((obj, [key, value]) => {
          obj[key.toUpperCase()] = {
            count: value,
            percentage: ((value / letters.length) * 100).toFixed(2)
          };
          return obj;
        }, {});
      
      setLetterDensity(sortedDensity);
    } else {
      // Metin boşsa tüm değerleri sıfırla
      setCharCount(0);
      setWordCount(0);
      setSentenceCount(0);
      setReadingTime(0);
      setLetterDensity({});
      setIsLimitExceeded(false);
    }
  }, [text, excludeSpaces, characterLimit, limitValue]);

  // Klavye kısayolları işleyicisi
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Sadece Ctrl veya Cmd tuşuyla birleştiğinde kısayolları işle
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'd': // Karanlık mod geçişi
            e.preventDefault();
            toggleTheme();
            break;
          case 'e': // Boşlukları hariç tut geçişi
            e.preventDefault();
            setExcludeSpaces(prev => !prev);
            break;
          case 'l': // Karakter limiti geçişi
            e.preventDefault();
            setCharacterLimit(prev => !prev);
            break;
          case 'f': // Metin alanına odaklan
            e.preventDefault();
            textareaRef.current?.focus();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [toggleTheme]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Başlık */}
        <header className="flex justify-between items-center mb-6 md:mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--purple-primary)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">C</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[var(--heading)]">Karakter Sayacı</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md bg-[var(--card-bg-light)] hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-primary)] shadow-sm border border-[var(--border-light)]"
            aria-label={`${isDarkMode ? 'Açık' : 'Koyu'} temaya geç`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6 text-[var(--icon-color)]">
              {isDarkMode ? (
                <g>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </svg>
          </button>
        </header>

        {/* Klavye kısayolları bilgisi */}
        {isKeyboardUser && (
          <div className="mb-4 md:mb-6 p-2 md:p-3 bg-[var(--purple-light)] rounded-md border border-[var(--purple-primary)] shadow-sm">
            <p className="text-xs md:text-sm text-[var(--text-primary)]">
              <strong>Klavye kısayolları:</strong> Ctrl/Cmd + D (tema), Ctrl/Cmd + E (boşluklar), 
              Ctrl/Cmd + L (limit), Ctrl/Cmd + F (odaklanma)
            </p>
          </div>
        )}

        {/* Ana içerik */}
        <main>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-1 md:mb-2 text-[var(--heading)]">Metninizi analiz edin</h2>
          <p className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-[var(--heading)]">gerçek zamanlı.</p>
          
          <div className="relative mb-8">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full min-h-[150px] md:min-h-[200px] p-4 md:p-6 rounded-lg border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-primary)] bg-[var(--input-bg-light)] border-[var(--border-light)] transition-all text-[var(--text-primary)] ${isLimitExceeded ? 'border-red-500 focus-visible:ring-red-500' : 'border-[var(--border-light)]'}`}
              placeholder="Metninizi buraya yazın veya yapıştırın..."
              aria-label="Metin girişi"
            ></textarea>
            
            {isLimitExceeded && (
              <div className="absolute -bottom-6 md:-bottom-8 left-0 text-red-500 text-xs md:text-sm" role="alert">
                Karakter limiti aşıldı (<span className="text-red-500">{charCount}</span>/<span className="text-red-500">{limitValue}</span>)
              </div>
            )}
          </div>

          {/* Seçenekler */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8 items-start md:items-center justify-between p-4 bg-[var(--card-bg-light)] rounded-lg border border-[var(--border-light)] shadow-sm">
            <div className="flex flex-wrap gap-4 md:gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm md:text-base text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={excludeSpaces}
                  onChange={() => setExcludeSpaces(!excludeSpaces)}
                  className="w-4 h-4 accent-[var(--purple-primary)]"
                  aria-label="Karakter sayımında boşlukları hariç tut"
                />
                <span>Boşlukları Hariç Tut</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer text-sm md:text-base text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={characterLimit}
                  onChange={() => setCharacterLimit(!characterLimit)}
                  className="w-4 h-4 accent-[var(--purple-primary)]"
                  aria-label="Karakter limiti belirle"
                />
                <span>Karakter Limiti Belirle</span>
              </label>
              
              {characterLimit && (
                <input
                  type="number"
                  value={limitValue}
                  onChange={(e) => setLimitValue(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-[var(--border-light)] rounded bg-[var(--input-bg-light)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-primary)] text-sm md:text-base text-[var(--text-primary)]"
                  min="1"
                  aria-label="Karakter limit değeri"
                />
              )}
            </div>
            
            <div className="text-sm md:text-base font-medium text-[var(--text-secondary)]">
              <p aria-live="polite">Yaklaşık okuma süresi: <span className="text-[var(--number-color)]">{readingTime}</span> dakika{readingTime !== 1 ? '' : ''}</p>
            </div>
          </div>

          {/* İstatistik kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
            <div className="bg-[var(--card-bg-light)] p-4 md:p-6 rounded-lg border border-[var(--border-light)] shadow-sm">
              <div className="flex items-baseline">
                <h3 className="text-4xl md:text-6xl font-bold mb-1 md:mb-2 text-[var(--number-color)]">{charCount}</h3>
              </div>
              <p className="text-base md:text-lg text-[var(--text-secondary)]">Toplam Karakter</p>
            </div>
            
            <div className="bg-[var(--card-bg-light)] p-4 md:p-6 rounded-lg border border-[var(--border-light)] shadow-sm">
              <div className="flex items-baseline">
                <h3 className="text-4xl md:text-6xl font-bold mb-1 md:mb-2 text-[var(--number-color)]">{wordCount}</h3>
              </div>
              <p className="text-base md:text-lg text-[var(--text-secondary)]">Kelime Sayısı</p>
            </div>
            
            <div className="bg-[var(--card-bg-light)] p-4 md:p-6 rounded-lg border border-[var(--border-light)] shadow-sm">
              <div className="flex items-baseline">
                <h3 className="text-4xl md:text-6xl font-bold mb-1 md:mb-2 text-[var(--number-color)]">{sentenceCount}</h3>
              </div>
              <p className="text-base md:text-lg text-[var(--text-secondary)]">Cümle Sayısı</p>
            </div>
          </div>

          {/* Harf yoğunluğu */}
          <div className="mb-8 md:mb-10 p-4 bg-[var(--card-bg-light)] rounded-lg border border-[var(--border-light)] shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[var(--heading)]">Harf Yoğunluğu</h3>
            <div className="space-y-3 md:space-y-4">
              {Object.entries(letterDensity).map(([letter, data]) => (
                <div key={letter} className="flex items-center">
                  <div className="w-8 md:w-10 font-mono text-sm md:text-base text-[var(--text-primary)]">{letter}</div>
                  <div className="flex-1 mx-2 md:mx-4">
                    <div className="bg-[var(--progress-bg)] h-5 md:h-6 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--progress-fill)] h-full"
                        style={{ width: `${data.percentage}%` }}
                        aria-label={`${letter}: ${data.count} adet, %${data.percentage}`}
                      ></div>
                    </div>
                  </div>
                  <div className="w-24 md:w-32 text-right font-mono text-xs md:text-base text-[var(--text-secondary)]">
                    <span className="text-[var(--number-color)]">{data.count}</span> (%{data.percentage})
                  </div>
                </div>
              ))}
              
              {Object.keys(letterDensity).length > 0 && (
                <button 
                  className="text-[var(--purple-primary)] flex items-center mt-3 md:mt-4 text-sm md:text-base hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-primary)] rounded"
                  aria-label="Daha fazla harf frekans istatistiği gör"
                >
                  Daha fazla
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 md:w-5 md:h-5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
