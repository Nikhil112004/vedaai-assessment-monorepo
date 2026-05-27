export const formatUiDate = (isoDate: string) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
};
