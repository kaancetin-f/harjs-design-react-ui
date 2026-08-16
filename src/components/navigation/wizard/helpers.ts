export const resolveWizardLocale = (locale?: Intl.LocalesArgument): string => {
  if (locale == null) return "tr";
  if (Array.isArray(locale)) return String(locale[0] ?? "tr");
  return String(locale);
};
