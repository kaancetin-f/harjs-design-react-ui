class NUMBER {
  public Decimal = (locale: Intl.LocalesArgument, digits?: { minimum?: number; maximum?: number }) => {
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: digits?.minimum ?? 0,
      maximumFractionDigits: digits?.maximum ?? 2,
    });
  };
}

export default new NUMBER();
