import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";

export const formatMsgTime = (date: Date): string => {
  return format(date, "HH:mm");
};

export const formatRelativeTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, "HH:mm");
  }
  if (isYesterday(date)) {
    return "Hôm qua";
  }
  try {
    return formatDistanceToNow(date, { addSuffix: false, locale: vi });
  } catch {
    return format(date, "dd/MM");
  }
};

export const formatFullTime = (date: Date): string => {
  return format(date, "HH:mm - dd/MM/yyyy");
};
