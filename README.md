# EnergyLab

Cihazların enerji tüketimini ve tahmini elektrik maliyetini hesaplayan, iki cihazı karşılaştıran mobil uyumlu web uygulaması.

## Özellikler

- Günlük ve dönemlik kWh tüketimi ve maliyet hesabı
- Aynı kullanım koşullarında iki cihazın karşılaştırılması
- Son 10 hesaplamanın tarayıcıda saklanması
- Açıklamalı formüller ve örnek cihazlar

## Çalıştırma

`index.html` dosyasını tarayıcıda açın veya bu klasörde `python3 -m http.server 8080` çalıştırın.

Derleme veya sunucu tarafı servis gerektirmez. GitHub Pages için `main` dalının kök dizini yayınlanabilir.

## Hesaplama

`Günlük kWh = güç (W) / 1000 × günlük saat`

`Dönem maliyeti = günlük kWh × gün × birim fiyat`

Güç ve fiyatlar örnektir. Sabit güç varsayımı kullanılır; gerçek tüketim ve tarife farklılık gösterebilir. Veriler yalnızca kullanıcının tarayıcısında tutulur. Google Fonts erişilemezse sistem yazı tipi kullanılır.
