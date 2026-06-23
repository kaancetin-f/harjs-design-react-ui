class _DATE {
  /**
   * YYYY-MM-DD
   *
   * @param date
   * @returns
   */
  public YMD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /**
   * DD-MM-YYYY
   *
   * @param date
   * @returns
   */
  public DMY = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  /**
   * 30 Mayıs 2021
   *
   * @param date
   * @param locale
   * @returns
   */
  public Verbose = (date: Date, locale: string = "tr", UTC: boolean = false) => {
    return date.toLocaleDateString(this.GetLocaleFromLanguage(locale), {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(UTC ? { timeZone: "UTC" } : {}),
    });
  };

  public WithTime = (date: Date, locale: string = "tr", UTC: boolean = false) => {
    return date.toLocaleString(this.GetLocaleFromLanguage(locale), {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...(UTC ? { timeZone: "UTC" } : {}),
    });
  };

  private GetLocaleFromLanguage = (lang: string) => {
    const languageToLocaleMap = {
      tr: "tr-TR",
      en: "en-US",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
      ja: "ja-JP",
      ru: "ru-RU",
      zh: "zh-CN",
      hi: "hi-IN",
      fa: "fa-IR",
      ko: "ko-KR",
    };

    return languageToLocaleMap[lang as keyof typeof languageToLocaleMap] || lang;
  };
}

export default new _DATE();
