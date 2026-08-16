class DATE {
  public Parse = (value: string, isCloack: boolean = false, isOnlyClock: boolean = false) => {
    if (isOnlyClock) {
      const timePart = value.includes("T") ? (value.split("T")[1]?.split(".")[0] ?? "") : value;
      const [hh, mm] = timePart.split(":").map(Number);
      const now = new Date();

      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hours: Number.isFinite(hh) ? hh : 0,
        minutes: Number.isFinite(mm) ? mm : 0,
      };
    }

    // Seçilmiş Tarih ve Zaman
    const [sd, st] = value.split("T");
    const [y, m, d] = sd.split("-").map(Number);

    // Zaman Bilgileri
    const [c, _] = isCloack && st ? st.split(".") : "00:00";
    const [hh, mm] = isCloack ? c.split(":").map(Number) : [0, 0];

    return {
      year: y,
      month: m,
      day: d,
      hours: hh,
      minutes: mm,
    };
  };

  public ParseValue = (value: string, isCloack: boolean = false, isOnlyClock: boolean = false) => {
    if (isOnlyClock) {
      if (!value) return "";

      const timePart = value.includes("T") ? (value.split("T")[1]?.split(".")[0] ?? "") : value;
      const [hour, minute] = timePart.split(":");

      if (hour === undefined || minute === undefined) return "";

      return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    }

    const [date, time] = value.split("T");
    const [hour, minute] = isCloack && time ? time.split(":") : ["hh", "mm"];

    if (!isCloack) return date || "";
    if (!date) return "";

    return `${date}T${hour}:${minute}`;
  };

  public FormatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };
}

export default new DATE();
