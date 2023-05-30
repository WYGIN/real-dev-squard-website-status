import React from 'react';
import { ENTER_KEY, SPACE_KEY, TAB_KEY, DOWN_ARROW_KEY, UP_ARROW_KEY, HOME_KEY, END_KEY } from '@/constants/key';
import { AccordionContext } from './Accordion';
import "./Accordion.module.css";

type HTMLSVGElement = HTMLElement & SVGElement;
type AccordionItemProps = {
  as: HTMLElement | string;
  title: string;
  description: string;
  icon?: HTMLSVGElement;
}

export const AccordionItem = ({ as = 'div', title, description, icon }: AccordionItemProps) => {
  const expandedPosition = React.useContext(AccordionContext);
  const currentElement = this.element;
  const parentElement = currentElement.parent;
  const currentPosition = React.Children.indexOf(parentElement, currentElement);

  React.useEffect(() => {
    currentElement.addEventListener('keydown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if(event.key === ENTER_KEY || event.key === SPACE_KEY)
        currentElement.classList.toggle('hidden');
      if(event.key === TAB_KEY && KeyboardEvent.shiftKey)
        parentElement.childNodes.item(currentPosition - 1).querySelector('accordion__item__header').focus();
      else if(event.key === TAB_KEY)
        parentElement.childNodes.item(currentPosition + 1).querySelector('accordion__item__header').focus();
      if(event.key === DOWN_ARROW_KEY)
        parentElement.childNodes.item(currentPosition + 1).querySelector('accordion__item__header').focus();
      if(event.key === UP_ARROW_KEY)
        parentElement.childNodes.item(currentPosition - 1).querySelector('accordion__item__header').focus();
      if(event.key === HOME_KEY)
        parentElement.childNodes.item(0).querySelector('accordion__item__header').focus();
      if(event.key === END_KEY)
        parentElement.childNodes.item(parent element.childNodes.length).querySelector('accordion__item__header').focus();
    });
  }, [currentElement]);

  return(
    <as class='accordion__item'>
      <div class='accordion__item__header'>
        <h3 class='accordion__item__header__title'>{title}</h3>
        <button class='accordion__item__header__button' aria-expanded=`${expandedPosition === currentPosition}` aria-controls="ID">
          <icon class='accordion__item__header__button__icon' />
        </button>
      </div>
      <div class=`accordion__item__pannel ${ isExpanded === currentPosition ? '': 'hidden' }` aria-labelledby="IDREF">
        <p class='accordion__item__pannel__description'>{description}</p>
      </div>
    </as>
  );
}
