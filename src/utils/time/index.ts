export const getFormattedTime = () => {
    const now = new Date()

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}
export const getFormattedDate = () => {
    const today = new Date()

    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}-${month}-${year}`
}

export const convertSecondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    // Aseguramos que los valores tengan dos dígitos
    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(seconds).padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
export const getDifferenceInSeconds = (date1: Date, date2: Date) => {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    const diffInSeconds = Math.floor(diffInMs / 1000);
    return diffInSeconds;
}

export const addSecondsToDate = (date: Date, seconds: number): Date => {
    const milliseconds = seconds * 1000; // Convert seconds to milliseconds
    return new Date(date.getTime() + milliseconds); // Add milliseconds to the current date
}

// Retorna la fecha de hoy en formato "YYYY-MM-DD"
export const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Retorna el mes actual en formato "YYYY-MM"
export const getCurrentMonth = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  // getMonth() devuelve de 0 a 11, sumamos 1 y hacemos padStart para dos dígitos
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

// Retorna el mes actual en formato "YYYY-MM-DD-HH-MM-SS-MS"
export const getStartOfCurrentMonthFullDate = (): string => {
  const today = new Date();
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,      // día 1
    0, 0, 0, 0 // hora, min, seg, ms
  );
  return startOfMonth.toISOString();
};

// Retorna la franja horaria
export function getDateRange(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const startMinutes = Math.floor(minutes / 30) * 30;
  const endMinutes = startMinutes + 30;

  const startHourStr = String(hours).padStart(2, '0');
  const startMinStr = String(startMinutes).padStart(2, '0');

  const endHour = hours + Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;
  const endHourStr = String(endHour).padStart(2, '0');
  const endMinStr = String(endMin).padStart(2, '0');

  return `${startHourStr}:${startMinStr} - ${endHourStr}:${endMinStr}`;
}

export function subMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60 * 1000);
}