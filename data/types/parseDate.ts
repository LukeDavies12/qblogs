export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  const utcDay = String(date.getUTCDate()).padStart(2, '0');
  const utcYear = String(date.getUTCFullYear()).slice(-2);
  return `${utcMonth}/${utcDay}/${utcYear}`;
};