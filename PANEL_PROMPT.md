# Dijital Onay Zinciri Panel Promptu

Bu dosya, hazirlanan panellerin en guncel halini tek parca ve duzgun bir prompt olarak icerir. Mevcut durum `v1.4.3` arayuz mantigini baz alir.

```text
Kurumsal bir "Dijital Onay Zinciri" web arayuzu tasarla. Uygulama 4 ana ekrandan olussun: Giris Ekrani, Kullanici Onay Kutusu, Talep Olusturma Ekrani ve Yonetici Onay Takip Ekrani. Arayuz modern, temiz, kurumsal ve guven veren bir gorunume sahip olsun. Acik zemin, yumusak mavi ve soft turkuaz tonlari, hafif gradyanli arka planlar, ince border'li beyaz paneller, golge efekti, yuvarlatilmis koseler ve masaustu + mobil uyumlu responsive yapi kullan.

Genel sistem mantigi:
- Rol bazli calisan bir sistem olsun.
- Giris yapan kullanici rolune gore sadece ilgili ekranlari gorsun.
- Yonetici hesabi sabit olsun:
  kullanici adi: admin
  sifre: 12345678
- Calisanlar kendi ad-soyadlari ve kendilerine tanimlanan sifre ile giris yapsin.
- Oturum varsa kullanici otomatik uygun ana ekrana yonlendirilsin.
- Sayfalarin sag alt kosesinde surum rozeti bulunsun.
- Ust menu her rolde farkli gorunsun.
- Yonetici sadece "Talep Olustur" ve "Yonetici Takip" ekranlarini gorsun.
- Calisan sadece "Onay Kutum" ve "Talep Olustur" ekranlarini gorsun.
- Tum korumali ekranlarda "Cikis" butonu bulunsun.

1) Giris Ekrani:
- Ortalanmis tek bir giris karti olsun.
- Baslik: "Dijital Onay Zinciri Girisi"
- Alt aciklama: "Rolunuze gore ilgili ekranlar otomatik acilir."
- Alanlar:
  Kullanici Adi Soyadi
  Sifre
- Hata mesaji alani olsun.
- Alt tarafta ekstra bilgi karti veya ornek kullanici listesi gorunmesin.
- Tasarim sade, ciddi, kurumsal ve net olsun.

2) Kullanici Onay Kutusu:
- Bu ekran yalnizca giris yapan calisanin kendisine atanmis aktif onaylarini gostersin.
- Sayfanin sol tarafinda evrak veya talep listesi, sag tarafinda secilen kaydin detaylari bulunsun.
- Ustte aktif kullanici adi ayri bir bilgi kutusunda gosterilsin.
- Ozet kutulari:
  Bekleyen Evrak
  Onayladiklarim
  Reddettiklerim
- Her talep kartinda sunlar yer alsin:
  talep tipi
  talep numarasi
  baslik
  gonderen birim
  tarih
  kacınci adimda oldugu
  durum rozeti
- Durum rozeti iki ozel hali desteklesin:
  "Bekleyen Onay"
  "Revize Bekleniyor"
- Her talep kartinda "Hizli karar notu" alani bulunsun.
- Hizli karar notu alanina yazi yazarken kart yeniden render olup metni silinmesin.
- Her kartta iki aksiyon butonu olsun:
  Onayla
  Reddet
- Sag panelde secilen talebin detaylari gosterilsin:
  baslik
  numara
  gonderen birim
  olusturulma tarihi
  aktif adim
  aksiyon sahibi
  gerekiyorsa geri donus nedeni
- Sag panelde dikey zaman akisi olsun.
- Her adimda kisi, rol, durum ve not gorunsun.
- Calisan, secilen talep icin ayrica detay panelinden de karar verebilsin.
- Red sureci su mantikla calissin:
  ilk adimdan sonraki bir adim reddederse talep onceki kisilere sirayla geri donsun
  red nedeni sadece reddeden kullaniciya kadar olan zincirde gorunsun
  daha sonraki kisiler bu nedeni gormesin
- Talep tekrar donduyse uygun renk ve metinle "Revize Bekleniyor" gosterilsin.

3) Talep Olusturma Ekrani:
- Sol tarafta form, sag tarafta canli onizleme alani olsun.
- Ust baslik:
  "Talep Olusturma ve Onay Rotasi Tanimi"
- Form alanlari:
  Talep Turu
  Oncelik
  Gonderen Departman
  Belge / Talep No
  Belge / Talep Basligi
  Aciklama
- Alt bolumde "Onay Adimi Ekle" alani olsun.
- Kullanici asagidaki bilgilerle onay zinciri tanimlasin:
  Departman
  Onaylayacak Kisi
  Rol
- Eklenen adimlar listelensin.
- Her adim icin:
  yukari tasi
  asagi tasi
  sil
- Sag tarafta canli onizleme anlik guncellensin.
- Onizleme ayri butonla degil otomatik calissin.
- Sayfada "Onay Surecini Baslat" butonu bulunsun.
- Surec baslatildiginda olusturulan kayit takip ekranina dussun.
- Talep olusturma ekrani hem calisan hem yonetici tarafindan gorulebilsin.

4) Yonetici Onay Takip Ekrani:
- Sol tarafta tum taleplerin listesi, sag tarafta detay ve timeline alani olsun.
- Ust baslik:
  "Yonetici Onay Takip"
- Alt aciklama:
  "Tum talepleri, takilan adimlari ve onay gecmisini izleyin."
- Filtre chip'leri olsun:
  Tumu
  Evrak
  Satin Alma
  Beklemede
- Her kayit kartinda:
  talep tipi
  talep numarasi
  baslik
  birim
  tarih
  su an kimde oldugu
  ilerleme yuzdesi
  durum rozeti
- Sag panelde ozet kutulari:
  Mevcut Durum
  Su An Kimde
  Tamamlanma
- Altinda zaman akisiyla tum onay adimlari gosterilsin.
- Yonetici detay alaninda "Red sonrasi revize ile tekrar onaylanabilir" gibi ek aciklama gorunmesin.
- Geri donus veya revizyon varsa yalnizca gerekli geri donus nedeni gosterilsin.

5) Yonetici icindeki "Calisan Yonetimi":
- Yonetici ekraninda bir butonla acilan kucuk modal veya popup pencere olsun.
- Bu alan tam sayfa degil, kompakt bir modal olsun.
- Baslik:
  "Calisan Yonetimi"
- Yonetici departman secsin.
- Secili departmana yeni calisan ekleyebilsin.
- Var olan calisanlari silebilsin.
- Her calisan satirinda iki buton olsun:
  Bilgi
  Sil
- Bilgi butonuna basinca o calisanin mevcut sifresi satir icinde gosterilsin.
- Ilk tanimlanan ve yonetici tarafindan eklenen tum calisanlar icin sistem otomatik random 8 haneli sifre uretsin.
- Bu ilk uretilen sifreler sadece rakamlardan olussun.
- Calisan daha sonra sifresini degistirirse yeni sifre 8 karakter uzunlugunda olsun ve harf + rakam icerebilsin.
- Yonetici tarafindaki "Bilgi" alani ile calisanin guncel sifresi her zaman senkron olsun.

6) Calisan Sifre Degistirme:
- Calisan oturumunda ust menude "Sifre Degistir" butonu olsun.
- Tiklayinca modal acilsin.
- Alanlar:
  Mevcut Sifre
  Yeni Sifre
  Yeni Sifre Tekrar
- Yeni sifre 8 karakterli olsun.
- Harf ve rakam icerebilsin.
- Hatali mevcut sifre veya eslesmeyen tekrar durumu icin kullaniciya hata mesaji gosterilsin.
- Basarili guncellemede sifre degissin ve yonetici panelindeki bilgi alani da ayni degeri gostersin.

Tasarim dili:
- Kart tabanli ama asiri kaba olmayan, zarif kurumsal bir yapi kur.
- Acik renkli, ferah, veri odakli, modern dashboard hissi ver.
- Arka planda hafif gradyanlar olsun.
- Yazilar okunakli, butonlar net, durum rozetleri belirgin olsun.
- Mobilde paneller alt alta dussun.
- Icerik kesilmesin, tasmasin, ekran boyutuna gore duzgun uyum saglasin.
- Butun sayfalar arasinda gorsel tutarlilik korunsun.
```
