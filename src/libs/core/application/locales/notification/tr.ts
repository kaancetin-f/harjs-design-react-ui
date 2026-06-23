import INotificationLocale from "./INotificationLocale";

const NotificationTR: INotificationLocale = {
  // 200 OK -> GET Processes
  "Notification.200.Title": "İşlem Başarılı",
  "Notification.200.Message": "Veriler başarıyla alındı.",
  "Notification.200.Login.Title": "Oturum Açma Başarılı",
  "Notification.200.Login.Message":
    "Oturum açma işleminiz başarıyla tamamlandı. Şimdi tüm özelliklere erişebilirsiniz.",

  // 201 Created -> POST Processes
  "Notification.201.Title": "Kayıt Oluşturuldu",
  "Notification.201.Message": "Kayıt başarıyla oluşturuldu.",

  // 202 Accepted -> Processing
  "Notification.202.Title": "İstek Kabul Edildi",
  "Notification.202.Message": "İstek kabul edildi, işleniyor.",

  // 204 No Content -> PUT Processes
  "Notification.204.Title": "İşlem Başarılı",
  "Notification.204.Message": "Kayıtlı içerik güncellendi.",
  "Notification.204.Delete.Title": "Kaldırma Başarılı",
  "Notification.204.Delete.Message": "Kaldırma işlemi başarılı.",

  // 301 Moved Permanently
  "Notification.301.Title": "Kalıcı Olarak Taşındı",
  "Notification.301.Message": "Kaynak kalıcı olarak yeni bir konuma taşındı.",

  // 302 Found
  "Notification.302.Title": "Geçici Yönlendirme",
  "Notification.302.Message": "Kaynak geçici olarak farklı bir konumda bulunuyor.",

  // 304 Not Modified
  "Notification.304.Title": "Değişiklik Yok",
  "Notification.304.Message": "Kaynakta herhangi bir değişiklik yapılmadı.",

  // 307 Temporary Redirect
  "Notification.307.Title": "Geçici Yönlendirme",
  "Notification.307.Message": "Kaynak geçici olarak başka bir konuma yönlendirildi.",

  // 400 Bad Request
  "Notification.400.Title": "Geçersiz İstek",
  "Notification.400.Message": "İstek geçerli değil. Lütfen gönderdiğiniz verileri kontrol edin.",

  // 401 Unauthorized
  "Notification.401.Title": "Yetkisiz Erişim",
  "Notification.401.Message": "Bu işlemi gerçekleştirmek için geçerli kimlik doğrulama bilgileri gereklidir.",

  // 403 Forbidden
  "Notification.403.Title": "Erişim Engellendi",
  "Notification.403.Message": "Bu kaynağa erişim yetkiniz yok.",

  // 404 Not Found
  "Notification.404.Title": "Kaynak Bulunamadı",
  "Notification.404.Message": "Aradığınız kaynak bulunamadı. Lütfen URL'yi kontrol edin.",

  // 405 Method Not Allowed
  "Notification.405.Title": "Geçersiz Yöntem",
  "Notification.405.Message": "Bu kaynak için kullanılan HTTP yöntemi uygun değil.",

  // 406 Not Acceptable
  "Notification.406.Title": "Kabul Edilemez",
  "Notification.406.Message": "Sunucu, istemcinin talep ettiği içeriği sağlayamıyor.",

  // 408 Request Timeout
  "Notification.408.Title": "İstek Zaman Aşımı",
  "Notification.408.Message": "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.",

  // 409 Conflict
  "Notification.409.Title": "Çakışma",
  "Notification.409.Message": "İstek mevcut kaynakla çakışıyor.",

  // 410 Gone
  "Notification.410.Title": "Kaynak Artık Mevcut Değil",
  "Notification.410.Message": "Talep edilen kaynak artık mevcut değil.",

  // 413 Payload Too Large
  "Notification.413.Title": "Veri Çok Büyük",
  "Notification.413.Message": "Gönderilen veri boyutu çok büyük.",

  // 415 Unsupported Media Type
  "Notification.415.Title": "Desteklenmeyen Medya Türü",
  "Notification.415.Message": "Sunucu, istemcinin gönderdiği medya türünü desteklemiyor.",

  // 429 Too Many Requests
  "Notification.429.Title": "Çok Fazla İstek",
  "Notification.429.Message": "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",

  // 500 Internal Server Error
  "Notification.500.Title": "Sunucu Hatası",
  "Notification.500.Message": "Bir hata oluştu. Lütfen tekrar deneyin veya yöneticinize başvurun.",

  // 501 Not Implemented
  "Notification.501.Title": "Uygulanmadı",
  "Notification.501.Message": "Sunucu bu işlevi desteklemiyor.",

  // 502 Bad Gateway
  "Notification.502.Title": "Geçersiz Ağ Geçidi",
  "Notification.502.Message": "Sunucu geçersiz bir yanıt aldı.",

  // 503 Service Unavailable
  "Notification.503.Title": "Hizmet Kullanılamıyor",
  "Notification.503.Message": "Sunucu geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.",

  // 504 Gateway Timeout
  "Notification.504.Title": "Ağ Geçidi Zaman Aşımı",
  "Notification.504.Message": "Sunucu, diğer bir sunucudan yanıt alamadı.",

  // 505 HTTP Version Not Supported
  "Notification.505.Title": "HTTP Sürümü Desteklenmiyor",
  "Notification.505.Message": "Sunucu, kullanılan HTTP sürümünü desteklemiyor.",
};

export default NotificationTR;
