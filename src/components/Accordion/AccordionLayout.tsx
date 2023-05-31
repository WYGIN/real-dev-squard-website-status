import React from 'react';
import './Accordion.module.css';

export type AccordionLayoutProps = {
  expanded: boolean;
}

export const AccordionContext = React.createContext();

export const AccordionLayout: React.VFC<AccordionLayoutProps> = ({ expanded, children }) => {
  const [expandedPosition, setExpandedPosition] = React.useState<number | null>(expanded ? 0 : null);
  return(
    <AccordionContext.Provider value={{ expandedPosition, setExpandedPosition }} class='accordion'>
      {children}
    </AccordionContext.Provider>
  );
}
