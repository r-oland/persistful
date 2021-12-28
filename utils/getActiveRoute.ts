export const getActiveRoute = (pathname: string, link?: string) => {
  if (!link) return;

  if (link === '/') return pathname === link;
  return pathname.includes(link);
};
