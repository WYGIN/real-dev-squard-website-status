import React from 'react';
import './Breadcrumb.module.css';

export type BreadcrumbItemProps = {
  label: string;
  href: string;
}

export const BreadcrumbItem: React.VFC<BreadcrumbItemProps> = (props) => {
  const currentElement = this.element;
  const parentElement = currentElement.parent;
  const currentPosition = React.Children.indexOf(parentElement, currentElement); 
  const elementsOfParent = parentElement.childNodes;

  return(
    <li class='breadcrumb__item'>
      <a href={props.href} class='breadcrumb__item__link' { currentPosition === elementsOfParent ? `aria-current="page"` : '' } >{props.label}</a>
    </li>
  );
}
