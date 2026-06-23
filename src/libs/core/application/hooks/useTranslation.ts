import Utils from "../../../infrastructure/shared/Utils";
import { INotificationLocale, NotificationEN, NotificationTR } from "../locales";
import KanbanBoardEN from "../locales/kanban-board/en";
import IKanbanBoardLocale from "../locales/kanban-board/IKanbanBoardLocale";
import KanbanBoardTR from "../locales/kanban-board/tr";
import TableEN from "../locales/table/en";
import ITableLocale from "../locales/table/ITableLocale";
import TableTR from "../locales/table/tr";

type LocaleMap = Record<string, Record<string, any>>;

const useTranslation = function <TBaseLocale>(currentLanguage: string | undefined, translations: LocaleMap = {}) {
  const merged: LocaleMap = {};
  const ExtraLocales: LocaleMap = {
    tr: { ...TableTR, ...KanbanBoardTR, ...NotificationTR },
    en: { ...TableEN, ...KanbanBoardEN, ...NotificationEN },
  };
  const allLanguages = new Set([...Object.keys(translations), ...Object.keys(ExtraLocales)]);

  allLanguages.forEach((lang) => {
    merged[lang] = {
      ...translations[lang],
      ...ExtraLocales[lang],
    };
  });

  const t = (
    key: Extract<keyof TBaseLocale | keyof ITableLocale | keyof IKanbanBoardLocale | keyof INotificationLocale, string>,
    ...args: any[]
  ) => {
    return Utils.StringFormat(merged[currentLanguage ?? "tr"][key], ...args) ?? "";
  };

  return { t, currentLanguage };
};

export default useTranslation;
