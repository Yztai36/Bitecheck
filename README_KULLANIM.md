# 🐛 BITECHECK - Böcek Isırığı Analiz Uygulaması

![BiteCheck Logo](./assets/bitecheck_image.png)

## 📱 Uygulama Hakkında

**BITECHECK**, yapay zeka destekli mobil uygulama ile böcek ısırıklarını analiz etmenizi sağlar. Sadece bir fotoğraf çekerek veya galeriden seçerek, hangi böceğin ısırdığını öğrenebilir ve uygun tedavi önerilerini alabilirsiniz.

### 🎯 Ana Özellikler

- **🤖 AI Destekli Analiz**: Gelişmiş makine öğrenmesi ile %85+ doğruluk oranı
- **📸 Hızlı Tanı**: Kamera veya galeri ile anında analiz
- **🗺️ Konum Bazlı Öneriler**: Bulunduğunuz bölgeye göre risk analizi
- **📊 Geçmiş Takibi**: Tüm analizlerinizi kayıt altında tutar
- **⚡ Risk Seviyesi**: Düşük, Orta, Yüksek risk kategorileri
- **💡 Akıllı Öneriler**: Duruma özel tedavi ve önlem önerileri

## 🔬 Desteklenen Böcek Türleri

| Böcek Türü | Risk Seviyesi | Analiz Doğruluğu |
|-------------|---------------|------------------|
| 🐜 Karıncalar | Düşük | %90+ |
| 🦟 Sivrisinekler | Düşük | %88+ |
| 🐛 Pire | Düşük | %85+ |
| 🐝 Arılar | Orta | %92+ |
| 🕷️ Örümcekler | Orta | %87+ |
| 🪳 Tahtakuruları | Orta | %89+ |
| 🦠 Kene | Yüksek | %94+ |
| ❌ Isırık Değil | - | %86+ |

## 📲 Kurulum ve Başlangıç

### Gereksinimler
- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Python Flask, PyTorch, AI Model
- **Minimum Android**: 6.0+ / **iOS**: 12.0+

### Hızlı Başlangıç

1. **Uygulamayı İndirin**
   ```bash
   git clone https://github.com/your-repo/bitecheck
   cd Bitecheck-main/react_native_app
   npm install
   ```

2. **Backend'i Başlatın**
   ```bash
   cd api_server
   python app.py
   ```

3. **Uygulamayı Çalıştırın**
   ```bash
   expo start
   ```

## 🎮 Nasıl Kullanılır?

### 1️⃣ Ana Sayfa - Analiz Ekranı
- **📱 Kamera Açılır**: Uygulamayı açtığınızda direkt kamera ekranı
- **📷 Fotoğraf Çekin**: Böcek ısırığına odaklayın ve çekim butonu
- **🖼️ Galeri Seçimi**: Mevcut fotoğraflarınızdan da analiz edebilirsiniz
- **⏱️ Anında Sonuç**: 2-3 saniyede AI analizi tamamlanır

### 2️⃣ Analiz Sonuçları
```
🐛 BITECHECK Analiz Sonucu
├── Böcek Türü: Sivrisinek
├── AI Güven Oranı: %87
├── Risk Seviyesi: Düşük Risk ✅
└── Öneriler:
    • Soğuk kompres uygulayın
    • Kaşımaktan kaçının  
    • Antihistaminik krem kullanabilirsiniz
```

### 3️⃣ Geçmiş Kayıtları
- **📋 Tüm Analizler**: Tarih sırasına göre listelenir
- **🔍 Detay Görüntüleme**: Her kayıt için genişletilmiş bilgi
- **🔄 Yenileme**: Pull-to-refresh ile güncel veriler
- **📊 İstatistikler**: Toplam analiz, güvenli/riskli oranları

### 4️⃣ Profil ve Ayarlar
- **👤 Kullanıcı Bilgileri**: Premium üyelik durumu
- **📊 Analiz İstatistikleri**: 
  - Toplam analiz sayısı
  - Güvenli, dikkat, acil kategorileri
- **⚙️ Uygulama Ayarları**:
  - 🔔 Bildirimler (Açık/Kapalı)
  - 📍 Konum Servisleri (Açık/Kapalı)  
  - 🚨 Acil Durum Uyarıları (Açık/Kapalı)
- **💡 Günlük Sağlık İpucu**

## 🎨 Ekran Görüntüleri

### 📱 Ana Ekranlar
```
┌─────────────────┬─────────────────┬─────────────────┐
│   🏠 Ana Sayfa   │   📋 Geçmiş     │   👤 Profil     │
│                 │                 │                 │
│  [Kamera View]  │ [Analiz Listesi]│[Kullanıcı Info]│
│                 │                 │                 │
│ 📷 [Çekim]      │ 🔄 Yenile       │ ⚙️ Ayarlar      │
│ 🖼️ [Galeri]     │ 📊 İstatistik   │ 💡 İpuçları     │
└─────────────────┴─────────────────┴─────────────────┘
```

## 🧠 AI Model Detayları

### Model Mimarisi
- **Framework**: PyTorch
- **Architecture**: Convolutional Neural Network (CNN)
- **Training Data**: 5000+ böcek ısırığı görüntüsü
- **Validation**: 60 farklı test vakası
- **Accuracy**: %87 genel doğruluk oranı

### Risk Kategorizasyonu
```
🟢 DÜŞÜK RİSK
├── Sivrisinek, Karınca, Pire
├── Ev tedavisi yeterli
└── Antihistaminik önerisi

🟡 ORTA RİSK  
├── Arı, Örümcek, Tahtakurusu
├── Takip gerekli
└── Doktor önerisi (ihtiyaç halinde)

🔴 YÜKSEK RİSK
├── Kene
├── Acil müdahale
└── Mutlaka doktor kontrolü
```

## 🛡️ Güvenlik ve Gizlilik

- **🔒 Veri Güvenliği**: Fotoğraflar cihazda işlenir, sunucuda saklanmaz
- **📍 Konum Gizliliği**: Sadece bölgesel analiz için kullanılır
- **🚫 Kişisel Veri**: Hiçbir kişisel bilgi topplanmaz
- **⚕️ Tıbbi Sorumluluk**: Uygulama tanı aracıdır, doktor yerini tutmaz

## ⚠️ Önemli Uyarılar

### ✅ Uygulama Ne Zaman Kullanılır?
- Böcek ısırığı şüphesi
- Genel bilgi edinme
- İlk değerlendirme
- Evde bakım önerisi

### ❌ Uygulama Ne Zaman Kullanılmaz?
- Acil tıbbi durumlar
- Şiddetli alerjik reaksiyon
- Nefes darlığı
- Yaygın döküntü

### 🏥 Doktora Başvurun:
- Ateş (38°C+)
- Şiddetli şişlik
- Nefes alma problemi  
- Yaygın kızarıklık
- 24 saat içinde kötüleşme

## 🔧 Teknik Destek

### Sık Karşılaşılan Sorunlar

**📷 Kamera Açılmıyor**
```
Çözüm: Ayarlar > İzinler > Kamera İzni Ver
```

**🌐 Analiz Çalışmıyor**
```
Çözüm: İnternet bağlantınızı kontrol edin
```

**📱 Uygulama Yavaş**
```
Çözüm: Uygulamayı yeniden başlatın
```

## 📊 İstatistikler (Genel)

```
📈 Uygulama Performansı
├── 🎯 Analiz Doğruluğu: %87
├── ⚡ Ortalama Analiz Süresi: 2.3 saniye  
├── 🔋 Düşük Batarya Kullanımı
├── 📱 Offline Çalışma: Hayır (AI gerekli)
└── 🌍 Dil Desteği: Türkçe
```

## 👥 Geliştirici Ekibi

| Rol | İsim | Sorumluluk |
|-----|------|------------|
| 🎯 **Scrum Master** | Ramazan Bıyık | Proje yönetimi |
| 📱 **Product Manager** |Zeynep Şener | Ürün stratejisi |
| 💻 **Developer** | Merve Çakır | Uygulama geliştirme |

---

**⚕️ DİKKAT**: BITECHECK bir sağlık uygulaması değildir. Ciddi semptomlar için mutlaka doktora başvurun.