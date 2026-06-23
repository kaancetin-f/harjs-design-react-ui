"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import Input from "..";
import IProps from "./IProps";

const Otp = ({ character, onChange, ...attributes }: IProps) => {
  // refs
  const _inputs = useRef<(HTMLInputElement | null)[]>([]);

  // states
  const [otpValues, setOtpValues] = useState<string[]>(() => Array(character).fill(""));

  // methods
  const triggerChange = (newValues: string[], event: any) => {
    setOtpValues(newValues);
    const combinedValue = newValues.join("");

    onChange?.({
      ...event,
      target: {
        ...event.currentTarget,
        name: attributes.name ?? "",
        value: combinedValue,
      },
    });
  };

  const handleKeyDown = useCallback(
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (attributes.disabled) return;

      const { key } = event;
      const currentInput = _inputs.current[index];

      // Sol / Aşağı Ok Tuşları
      if (key === "ArrowDown" || key === "ArrowLeft") {
        event.preventDefault(); // Tarayıcı imleç hareketini engelle
        if (index > 0) {
          const prevInput = _inputs.current[index - 1];
          prevInput?.focus();
          setTimeout(() => prevInput?.select(), 0);
        }
        return;
      }

      // Sağ / Yukarı Ok Tuşları
      if (key === "ArrowUp" || key === "ArrowRight") {
        event.preventDefault(); // Tarayıcı imleç hareketini engelle
        if (index < character - 1) {
          const nextInput = _inputs.current[index + 1];
          nextInput?.focus();
          setTimeout(() => nextInput?.select(), 0);
        }
        return;
      }

      // Backspace (Silme) İşlemi
      if (key === "Backspace") {
        event.preventDefault();
        const newValues = [...otpValues];

        if (otpValues[index] !== "") {
          // Mevcut kutu doluysa temizle
          newValues[index] = "";
          triggerChange(newValues, event);
        } else if (index > 0) {
          // Mevcut kutu boşsa bir öncekini temizle ve focus ol
          newValues[index - 1] = "";
          triggerChange(newValues, event);
          _inputs.current[index - 1]?.focus();
          setTimeout(() => _inputs.current[index - 1]?.select(), 0);
        }
        return;
      }

      // Sadece rakamlara izin ver (Meta tuşları hariç: Ctrl+V, Cmd+V vb.)
      if (!/[0-9]/.test(key) && key.length === 1 && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        return;
      }

      // Eğer tek bir rakam basıldıysa ve input seçiliyse (üzerine yazma mantığı)
      if (/[0-9]/.test(key) && key.length === 1) {
        event.preventDefault();
        const newValues = [...otpValues];
        newValues[index] = key; // Değeri set et (seçili olduğu için direkt üzerine yazar)
        triggerChange(newValues, event);

        // Son kutuda değilsek bir sonrakine geç ve seç
        if (index < character - 1) {
          const nextInput = _inputs.current[index + 1];
          nextInput?.focus();
          setTimeout(() => nextInput?.select(), 0);
        } else {
          // Son kutudaysa sadece seçili bırak ki tekrar basıldığında üzerine yazabilsin
          setTimeout(() => currentInput?.select(), 0);
        }
      }
    },
    [character, otpValues, attributes.disabled, onChange, attributes.name],
  );

  const handlePaste = useCallback(
    (index: number) => (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (attributes.disabled) return;

      const pastedData = event.clipboardData.getData("text").trim();
      if (!/^\d+$/.test(pastedData)) return; // Sadece rakam ise kabul et

      const digits = pastedData.split("").slice(0, character - index);
      const newValues = [...otpValues];

      digits.forEach((digit, i) => {
        if (index + i < character) {
          newValues[index + i] = digit;
        }
      });

      triggerChange(newValues, event);

      // Yapıştırılan son karaktere veya son input'a focus at
      const focusIndex = Math.min(index + digits.length, character - 1);
      const targetInput = _inputs.current[focusIndex];
      targetInput?.focus();
      setTimeout(() => targetInput?.select(), 0);
    },
    [character, otpValues, attributes.disabled],
  );

  const handleClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  }, []);

  // useEffects
  useEffect(() => {
    setOtpValues(Array(character).fill(""));
  }, [character]);

  return (
    <div className="ar-input-otp-wrapper">
      {Array.from({ length: character }, (_, index) => (
        <span key={index}>
          <Input
            ref={(el) => {
              _inputs.current[index] = el;
            }}
            {...attributes}
            value={otpValues[index]}
            onChange={() => {}} // React warning vermemesi için boş handler
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste(index)}
            onFocus={(event) => event.target.select()}
            onClick={handleClick}
            size={1}
            maxLength={1}
            placeholder={undefined}
            autoFocus={index === 0}
            autoComplete="off"
          />
        </span>
      ))}
    </div>
  );
};

Otp.displayName = "Input.Otp";
export default Otp;
