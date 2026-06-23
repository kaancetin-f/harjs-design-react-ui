class DATE {
  /**
   * Formats a Date object into an ISO standard string format (YYYY-MM-DD).
   *
   * @param date - The Date object to format.
   * @returns A string formatted as "YYYY-MM-DD".
   *
   * @example
   * ```ts
   * DateUtility.toYMD(new Date()); // "2026-06-23"
   * ```
   */
  public YMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /**
   * Formats a Date object into a localized European/Turkish string format (DD-MM-YYYY).
   *
   * @param date - The Date object to format.
   * @returns A string formatted as "DD-MM-YYYY".
   *
   * @example
   * ```ts
   * DateUtility.toDMY(new Date()); // "23-06-2026"
   * ```
   */
  public DMY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  /**
   * Formats a Date object into a verbose text representation based on the requested locale.
   *
   * @param date - The Date object to format.
   * @param lang - The language key (e.g., "tr", "en").
   * @param useUTC - If true, enforces the formatting to target the UTC timezone.
   * @returns A verbose localized date string (e.g., "23 Haziran 2026").
   */
  public Verbose = (date: Date, lang: string = "tr", useUTC: boolean = false): string => {
    return date.toLocaleDateString(this.GetLocaleFromLanguage(lang), {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(useUTC ? { timeZone: "UTC" } : {}),
    });
  };

  /**
   * Formats a Date object into a detailed localized date and time string.
   *
   * @param date - The Date object to format.
   * @param lang - The language key (e.g., "tr", "en").
   * @param useUTC - If true, enforces the formatting to target the UTC timezone.
   * @returns A localized date-time string (e.g., "23 Haziran 2026 15:08").
   */
  public VerboseWithTime = (date: Date, lang: string = "tr", useUTC: boolean = false): string => {
    return date.toLocaleString(this.GetLocaleFromLanguage(lang), {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...(useUTC ? { timeZone: "UTC" } : {}),
    });
  };

  /**
   * Formats a date into a relative human-readable string (e.g., "3 days ago", "just now").
   * Extremely useful for social feeds, activity logs, or comment sections.
   *
   * @param date - The target Date object to evaluate.
   * @param lang - The language key (currently supports "tr" and "en").
   * @returns A relative time string.
   */
  public RelativeTime = (date: Date, lang: "tr" | "en" = "tr"): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const locales = {
      tr: { justNow: "az önce", seconds: "saniye önce", minutes: "dakika önce", hours: "saat önce", days: "gün önce" },
      en: { justNow: "just now", seconds: "seconds ago", minutes: "minutes ago", hours: "hours ago", days: "days ago" },
    };

    const currentLocale = locales[lang] || locales.tr;

    if (diffInSeconds < 5) return currentLocale.justNow;
    if (diffInSeconds < 60) return `${diffInSeconds} ${currentLocale.seconds}`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${currentLocale.minutes}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${currentLocale.hours}`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${currentLocale.days}`;
  };

  /**
   * Safely checks whether a given string, number, or object can be parsed into a valid Date.
   * Prevents runtime crashes from "Invalid Date" outputs.
   *
   * @param value - The input variable to validate.
   * @returns `true` if the input is a valid date, otherwise `false`.
   */
  public IsValid = (value: any): boolean => {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (typeof value === "string" || typeof value === "number") {
      const parsed = new Date(value);
      return !isNaN(parsed.getTime());
    }
    return false;
  };

  /**
   * Compares two dates and checks if the first date is strictly before the second date.
   */
  public IsBefore = (dateA: Date, dateB: Date): boolean => {
    return dateA.getTime() < dateB.getTime();
  };

  /**
   * Compares two dates and checks if the first date is strictly after the second date.
   */
  public IsAfter = (dateA: Date, dateB: Date): boolean => {
    return dateA.getTime() > dateB.getTime();
  };

  /**
   * Map shorthand language identifiers to standard global BCP 47 locale codes.
   */
  private GetLocaleFromLanguage = (lang: string): string => {
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

export default new DATE();
