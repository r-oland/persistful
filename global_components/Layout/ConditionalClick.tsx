// Components==============
import Link from 'next/link';
import React from 'react';
import { NavItem } from 'utils/navItems';

export function ConditionaClick({
  item,
  children,
}: {
  item: NavItem;
  children: React.ReactNode;
}) {
  if (item.link) return <Link href={item.link}>{children}</Link>;

  return (
    <button type="button" onClick={item.onClick}>
      {children}
    </button>
  );
}
