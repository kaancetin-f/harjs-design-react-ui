type Mask = {
  mask: string;
  lengths?: number[];
};
type CountryMask = string | Mask;
type CountryMasks = Record<string, CountryMask[]>;

class PHONE {
  public FormatByMask = (countryCode: string, value: string) => {
    const digits = value.replace(/\D/g, "");
    const mask = this.GetMaskByCountry(countryCode ?? "+90", digits.length);

    let result = "";
    let i = 0;

    for (const char of mask) {
      if (char === "9") {
        if (!digits[i]) break;
        result += digits[i++];
      } else {
        result += char;
      }
    }

    return result;
  };

  private GetMaskByCountry(countryCode?: string, length?: number): string {
    const masks = countryCode ? this.countryMasks[countryCode] : undefined;

    if (masks && masks.length > 0) {
      if (length) {
        const exact = masks.find((m): m is Mask => typeof m !== "string" && !!m.lengths?.includes(length));
        if (exact) return exact.mask;

        const generic = masks.find((m): m is Mask => typeof m !== "string" && !m.lengths);
        if (generic) return generic.mask;

        const closest = masks
          .filter((m): m is Mask => typeof m !== "string" && !!m.lengths)
          .sort((a, b) => Math.abs((a.lengths![0] ?? 0) - length) - Math.abs((b.lengths![0] ?? 0) - length))[0];
        if (closest) return closest.mask;
      }

      const first = masks[0];
      return typeof first === "string" ? first : first.mask;
    }

    return this.GenerateMask(length ?? 10);
  }

  private GenerateMask(length: number): string {
    if (length <= 0) return "";

    const max = Math.min(length, 15); // E.164 max
    const groups = max <= 10 ? [3, 3, max - 6] : [3, 3, 4, max - 10];

    return groups
      .filter((g) => g > 0)
      .map((g) => "9".repeat(g))
      .join(" ");
  }

  private countryMasks: CountryMasks = {
    // 🇹🇷 Türkiye
    "+90": [{ mask: "999 999 99 99", lengths: [10] }],

    // 🇩🇪 Almanya
    "+49": [
      { mask: "999 9999999", lengths: [10] },
      { mask: "9999 999999", lengths: [10, 11] },
      { mask: "99999 99999", lengths: [10] },
    ],

    // 🇧🇷 Brezilya
    "+55": [
      { mask: "99 9999 9999", lengths: [10] }, // sabit
      { mask: "99 99999 9999", lengths: [11] }, // mobil
    ],

    // 🇺🇸 ABD / 🇨🇦 Kanada
    "+1": [{ mask: "999 999 9999", lengths: [10] }],

    // 🇬🇧 İngiltere
    "+44": [
      { mask: "9999 999999", lengths: [10] }, // London / area
      { mask: "99 9999 9999", lengths: [10] }, // mobile
    ],

    // 🇫🇷 Fransa
    "+33": [{ mask: "9 99 99 99 99", lengths: [9] }],

    // 🇮🇹 İtalya
    "+39": [{ mask: "999 999 9999", lengths: [9, 10] }],

    // 🇪🇸 İspanya
    "+34": [{ mask: "999 999 999", lengths: [9] }],

    // 🇳🇱 Hollanda
    "+31": [{ mask: "9 99999999", lengths: [9] }],

    // 🇧🇪 Belçika
    "+32": [{ mask: "999 99 99 99", lengths: [9] }],

    // 🇨🇭 İsviçre
    "+41": [{ mask: "99 999 99 99", lengths: [9] }],

    // 🇵🇹 Portekiz
    "+351": [{ mask: "999 999 999", lengths: [9] }],

    // 🇷🇺 Rusya / 🇰🇿 Kazakistan
    "+7": [{ mask: "999 999 99 99", lengths: [10] }],

    // 🇮🇳 Hindistan
    "+91": [{ mask: "99999 99999", lengths: [10] }],

    // 🇨🇳 Çin
    "+86": [{ mask: "999 9999 9999", lengths: [11] }],

    // 🇯🇵 Japonya
    "+81": [{ mask: "99 9999 9999", lengths: [10] }],

    // 🇰🇷 Güney Kore
    "+82": [
      { mask: "99 9999 9999", lengths: [10] },
      { mask: "999 9999 9999", lengths: [11] },
    ],

    // 🇦🇺 Avustralya
    "+61": [{ mask: "9 9999 9999", lengths: [9] }],

    // 🇲🇽 Meksika
    "+52": [{ mask: "999 999 9999", lengths: [10] }],

    // 🇦🇷 Arjantin
    "+54": [{ mask: "99 9999 9999", lengths: [10] }],

    // 🇿🇦 Güney Afrika
    "+27": [{ mask: "99 999 9999", lengths: [9] }],

    // 🇦🇪 BAE
    "+971": [{ mask: "99 999 9999", lengths: [9] }],

    // 🇸🇦 Suudi Arabistan
    "+966": [{ mask: "99 999 9999", lengths: [9] }],

    // 🇮🇱 İsrail
    "+972": [{ mask: "99 999 9999", lengths: [9] }],

    // 🇪🇬 Mısır
    "+20": [{ mask: "9999 999999", lengths: [10] }],

    // 🇳🇬 Nijerya
    "+234": [{ mask: "999 999 9999", lengths: [10] }],

    // 🇸🇪 İsveç
    "+46": [{ mask: "99 999 9999", lengths: [9, 10] }],

    // 🇳🇴 Norveç
    "+47": [{ mask: "999 99 999", lengths: [8] }],

    // 🇩🇰 Danimarka
    "+45": [{ mask: "99 99 99 99", lengths: [8] }],

    // 🇵🇱 Polonya
    "+48": [{ mask: "999 999 999", lengths: [9] }],
  };
}

export default new PHONE();
