"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Utils from "../../../infrastructure/shared/Utils";
import { Errors, ValidationProps, ValidationShape } from "../../../infrastructure/types";

const useValidation = function <TData extends object>(data: TData, params: ValidationProps<TData>[], step?: number) {
  const _errors = useRef<Errors<TData>>({});
  const [errors, setErrors] = useState<Errors<TData>>({});
  const [submit, setSubmit] = useState<boolean>(false);

  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const setError = useCallback((key: keyof TData, message: string, paramStep?: number, trackByValue?: number) => {
    let _key = paramStep ? `${paramStep}_${key as string}` : key;
    if (trackByValue !== undefined) _key = `${_key as string}_${trackByValue}`;

    _errors.current[_key as keyof typeof _errors.current] = message;
  }, []);

  const paramsShape = useCallback(
    (param: ValidationProps<TData>, value: string | undefined, trackByValue?: number) => {
      const vLength = value ? value.length : 0;

      const getKey = (subkey: string | undefined) => {
        if (!subkey) return param.key;
        const levels = subkey.split(".");
        return levels[levels.length - 1] as keyof TData;
      };

      const handleValidation = (key: keyof TData, s: ValidationShape) => {
        // Zorunluluk Kontrolleri (Geliştirildi).
        if (s.type === "required" && Utils.IsNullOrEmpty(value)) {
          setError(key, s.message, param.step, trackByValue);
          return;
        }

        const validationTypes = ["phone", "email", "iban", "account-number"];
        if (validationTypes.includes(s.type) && Utils.IsNullOrEmpty(value)) {
          setError(key, s.message, param.step, trackByValue);
          return;
        }

        // Uzunluk Kontrolleri.
        if (s.type === "minimum" && vLength < (s.value as number)) {
          setError(key, Utils.StringFormat(s.message, s.value), param.step, trackByValue);
        }
        if (s.type === "maximum" && vLength > (s.value as number)) {
          setError(key, Utils.StringFormat(s.message, s.value), param.step, trackByValue);
        }

        // Format (Regex) Kontrolleri (Sadece değer doluysa çalışır).
        if (value && !Utils.IsNullOrEmpty(value)) {
          const phoneRegex = /^\d{7,14}$/;
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const ibanRegex = /^TR\d{24}$/;
          const accountNumberRegex = /^\d{6,16}$/;

          if (s.type === "phone" && !phoneRegex.test(value.replace(/\D/g, ""))) {
            setError(key, s.message, param.step, trackByValue);
          }
          if (s.type === "email" && !emailRegex.test(value)) {
            setError(key, s.message, param.step, trackByValue);
          }
          if (s.type === "iban" && !ibanRegex.test(value.replace(/\s/g, ""))) {
            setError(key, s.message, param.step, trackByValue);
          }
          if (s.type === "account-number" && !accountNumberRegex.test(value)) {
            setError(key, s.message, param.step, trackByValue);
          }
        }
      };

      param.shape?.forEach((s) => {
        const key = getKey(param.subkey);

        // ÖNEMLİ KONTROL: Eğer bu alan için zaten bir hata basıldıysa,
        // shape içindeki sonraki kuralları kontrol etme, döngüdeki bu adımı atla!
        let currentKey = param.step ? `${param.step}_${key as string}` : key;
        if (trackByValue !== undefined) currentKey = `${currentKey as string}_${trackByValue}`;

        // Hafızada zaten bu alanın hatası var, sonrakileri çalıştırma.
        if (_errors.current[currentKey as keyof typeof _errors.current]) return;

        if (param.where) {
          if (param.where(data)) {
            setError(param.subkey ? key : param.key, s.message, param.step, trackByValue);
          }
          return;
        }

        handleValidation(key, s);
      });
    },
    [data, setError],
  );

  const handleParams = useCallback(
    (param: ValidationProps<TData>) => {
      const value = data[param.key as keyof typeof data] as string | undefined;

      if (param.subkey) {
        if (param.subkey.includes(".")) {
          const levels = param.subkey.split(".");
          let currentData: any = value;

          for (const key of levels) {
            if (!currentData) {
              paramsShape(param, currentData);
              return;
            }
            currentData = currentData[key as keyof typeof currentData];
          }
          paramsShape(param, currentData);
        } else {
          if (Array.isArray(value)) {
            const extractedValues = value.map((item) => ({
              value: item?.[param.subkey as keyof typeof item],
              trackByValue: item?.trackByValue,
            }));

            extractedValues.forEach((extractedValue) =>
              paramsShape(param, extractedValue.value, extractedValue.trackByValue),
            );
          } else {
            paramsShape(param, value?.[param.subkey as keyof typeof value] as string);
          }
        }
      } else {
        paramsShape(param, value);
      }
    },
    [data, paramsShape],
  );

  // Tüm kuralları senkron çalıştırıp sonucu dönen fonksiyon.
  const validateAll = useCallback(() => {
    _errors.current = {};

    params.forEach((param) => handleParams(param));
    setErrors({ ..._errors.current });

    if (!data || Object.keys(data).length === 0 || params.length === 0) return false;

    if (step) {
      const filteredErrors = Object.keys(_errors.current).filter((k) => k.startsWith(`${step}_`));
      return filteredErrors.length === 0;
    }

    return Object.keys(_errors.current).length === 0;
  }, [data, paramsKey, step, handleParams]);

  const onSubmit = (callback: (result: boolean) => void): void => {
    setSubmit(true);
    const isValid = validateAll();
    callback(isValid);
  };

  useEffect(() => {
    if (!submit) {
      _errors.current = {};
      setErrors({});
      return;
    }

    validateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, submit, paramsKey]);

  // Adım filtresi.
  const filteredErrors = step
    ? (Object.fromEntries(
        Object.entries(errors)
          .filter(([key]) => key.startsWith(`${step}_`))
          .map(([key, value]) => [key.replace(/^\d+_/, ""), String(value)]),
      ) as Errors<TData>)
    : errors;

  return {
    onSubmit,
    setSubmit,
    errors: filteredErrors,
  };
};

export default useValidation;
