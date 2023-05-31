import React from 'react';

export type BreadcrumbProps = {
  divider: SVGElement & HTMLElement;
}

export const BreadcrumbLayout: React.VFC<BreadcrumbProps> = ({ divider, children }) => {
  return(
    <nav class='breadcrumb' aria-label='Breadcrumb'><ol>{children}</ol></nav>
  );
}
