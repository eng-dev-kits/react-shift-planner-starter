# GitHub'a yükleme — Türkçe kısa kılavuz

Bu ZIP, **herkese açık paylaşılabilecek ÜCRETSİZ Shift Planner Starter** sürümüdür. **VOLENG kaynak kodu, ücretli Pro sürümü, API anahtarları veya müşteri verileri içermez.** Bağımsız olarak yeniden oluşturulmuştur.

### GitHub'a yükle

1. GitHub organizasyonunda `eng-dev-kits` altında `react-shift-planner-starter` repository'sini **Private** olarak oluştur (README açabilirsin).
2. ZIP'i bilgisayarında **önce çıkar**. **ZIP dosyasını doğrudan repository'ye tek dosya olarak yükleme.**
3. Repository sayfasında **Add file → Upload files** menüsünü aç.
4. Çıkarılmış klasörün **içindeki tüm dosya ve klasörleri** seçip sürükle: `README.md`, `LICENSE`, `server.mjs`, `package.json`, `public`, `src`, `tests`, `react`, ...
5. **Commit changes** düğmesine bas. Eğer GitHub ilk README nedeniyle aynı dosyayı değiştirme uyarısı gösterirse, yeni sürümle üzerine yazmayı onayla.
6. Dosya listesinde `README.md` ve `public/` klasörünün göründüğünü kontrol et.
7. Önce bilgisayarında `npm test` ve `npm start` ile dene. Ardından tarayıcıdan https://github.com/eng-dev-kits/react-shift-planner-starter adresini kontrol et.
8. Kodları, lisansı ve ürün tanıtımını tekrar incelemeden Private → Public yapma. Public yaptıktan sonra tüm dosyalar başkaları tarafından görülebilir ve MIT lisansı kapsamında kullanılabilir.

### Windows'da çalıştır

- Node.js 20+ kuruluysa `START_DEMO_WINDOWS.cmd` dosyasını çalıştır.
- Tarayıcı: `http://127.0.0.1:4309`
- Otomatik test: `TEST_WINDOWS.cmd`

### Hostinger

Bu sürüm, GitHub'da public hale geldikten sonra açık kaynak referans programına başvuru için bir aday olabilir. Kabul garantisi yoktur. GitHub repository adresini Hostinger formuna ekle; onay ve teknik gereksinimleri bekle. VOLENG'in canlı sitesini veya veri tabanlarını kullanmak zorunda değilsin.

### Doğru isimlendirme

Repository adı `react-shift-planner-starter` olsa da şu anki demo **vanilla JavaScript** kullanır; ayrıca `react/` klasöründe React entegrasyon örneği vardır. Tam React komponent kütüphanesi olarak pazarlama. Daha sonra gerçek React versiyonuna dönüştürebiliriz.
