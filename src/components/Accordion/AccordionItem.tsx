import React from 'react';
import { ENTER_KEY, SPACE_KEY, TAB_KEY, DOWN_ARROW_KEY, UP_ARROW_KEY, HOME_KEY, END_KEY } from '@/constants/key';
import { AccordionContext } from './Accordion';
import { ChevrenDown } from '@/icons';
import "./Accordion.module.css";

type HTMLSVGElement = HTMLElement & SVGElement;
type AccordionItemProps = {
  as: HTMLElement | string;
  title: string;
  description: string;
  icon?: HTMLSVGElement;
}

export const AccordionItem = ({ as = 'div', title, description, icon =  }: AccordionItemProps) => {
  const { expandedPosition, setExpandedPosition } = React.useContext(AccordionContext);
  const currentElement = this.element;
  const parentElement = currentElement.parent;
  const currentPosition = React.Children.indexOf(parentElement, currentElement);
  const elementsOfParent = parentElement.childNodes;

  React.useEffect(() => {
    currentElement.addEventListener('keydown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if(event.key === ENTER_KEY || event.key === SPACE_KEY) {
        currentElement.querySelector('accordion__item__pannel').classList.toggle('hidden');
        setExpandedPosition(expandedPosition === currentPosition ? null : currentPosition);
      }
      if(event.key === TAB_KEY && KeyboardEvent.shiftKey)
        elementsOfParent.item(currentPosition - 1).querySelector('accordion__item__header').focus();
      else if(event.key === TAB_KEY)
        elementsOfParent.item(currentPosition + 1).querySelector('accordion__item__header').focus();
      if(event.key === DOWN_ARROW_KEY)
        elementsOfParent.item(currentPosition < elementsOfParent.length ? currentPosition + 1 : 0).querySelector('accordion__item__header').focus();
      if(event.key === UP_ARROW_KEY)
        elementsOfParent.item(currentPosition > 0 ? currentPosition - 1 : 0).querySelector('accordion__item__header').focus();
      if(event.key === HOME_KEY)
        elementsOfParent.item(0).querySelector('accordion__item__header').focus();
      if(event.key === END_KEY)
        elementsOfParent.item(elementsOfParent.length).querySelector('accordion__item__header').focus();
    });
  }, [currentElement]);

  return(
    <as class='accordion__item'>
      <div class='accordion__item__header'>
        <h3 class='accordion__item__header__title'>{title}</h3>
        <button class='accordion__item__header__button' aria-expanded=`${expandedPosition === currentPosition}` aria-controls='accordion-pannel' id='accordion-header-button'>
          <icon class='accordion__item__header__button__icon' />
        </button>
      </div>
      <div class=`accordion__item__pannel ${ expandedPosition === currentPosition ? '': 'hidden' }` aria-labelledby='accordion-header-button' id='accordion-pannel'>
        <p class='accordion__item__pannel__description'>{description}</p>
      </div>
    </as>
  );
}
