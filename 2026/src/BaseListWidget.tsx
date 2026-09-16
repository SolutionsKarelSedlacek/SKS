import React, { useState } from 'react';

export type BaseListWidgetItem = {
  key: string;
  date: string;
  name: string;
  description: string;
};

type BaseListWidgetProps = {
  heading: string;
  items: BaseListWidgetItem[];
  selectedKey?: string | null;
  onSelectItem?: (itemKey: string) => void;
};

const BaseListWidget: React.FC<BaseListWidgetProps> = ({ heading, items, selectedKey = null, onSelectItem }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listHasActive = selectedKey !== null || activeIndex !== null;

  return (
    <section className="program-widget">
      <h2 className="program-heading">{heading}</h2>

      <ul
        className={`program-list${listHasActive ? ' has-active' : ''}`}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {items.map((item, index) => {
          const isSelected = selectedKey === item.key;
          const isActive = isSelected || activeIndex === index;

          return (
            <li
              key={item.key}
              className={`program-row${isActive ? ' is-active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => onSelectItem?.(item.key)}
            >
              <div className="program-line">
                <span className="program-date">{item.date}</span>
                <span className="program-name">{item.name}</span>
              </div>
              <p className="program-description">{item.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BaseListWidget;