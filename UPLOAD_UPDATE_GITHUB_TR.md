# GitHub V1.1 güncellemesini yükleme

Bu ZIP mevcut **eng-dev-kits/react-shift-planner-starter** Private repository'sini güncellemek içindir.

1. GitHub'da Code -> Add file -> Upload files aç.
2. ZIP'i bilgisayarda çıkar, **içindeki tüm dosya ve klasörleri** yükleme alanına sürükle. Mevcut dosyaların güncellenmesine izin ver.
3. Commit changes tıkla. Commit açıklaması: `Update Shift Planner Starter to v1.1`.
4. `public/index.html`, `public/app.js` ve `public/styles.css` bulunduğunu kontrol et.
5. GitHub, eski `public/app.mjs` dosyasını otomatik silmez. Code -> public -> app.mjs -> ... -> Delete file ile sil. `src/schedule.mjs` dosyası kalmalıdır, test/React örneği için kullanılır.
6. Repo **Private** kalsın; npm test ve ticari/açık kaynak kontrolünden sonra Public yap.

Çalışan demo (Node kullanmadan): https://engconsulting.be/shift-planner/shift-planner/

*Not:* Repo adında React geçiyor, ancak bu sürümün çalışan demo arayüzü vanilla JS'dir. React klasörü yalnızca örnek bir entegrasyon içerir.
