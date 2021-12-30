export const getActiveRoute = (pathname: string, link?: string) => {
  if (!link) return;

  // <= to prevent /# bug
  if (link === '/') return pathname.length <= 3;
  return pathname.includes(link);
};
