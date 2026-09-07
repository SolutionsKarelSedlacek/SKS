import React, { useState } from 'react';
import './ProgramWidget.css';

interface ProgramDay {
  date: string;
  name: string;
  description: string;
}

const days: ProgramDay[] = [
  { date: '27.12.', name: 'Karlův Hod Vánoční', description: 'Tradiční sváteční Karlopoliský obyčej' },
  { date: '28.12.', name: 'Připravený program', description: 'Tato aktivita ještě nebude veřejná' },
  { date: '29.12.', name: 'Připravená indoor aktivita', description: 'Tato aktivita se dá uhádnout' },
  { date: '30.12.', name: 'Evžentura 3.0', description: 'Nebo Fakokracie nebo něco mezi' },
  { date: '31.12.', name: 'Propracovaná outdoorová hra', description: 'Mečovaní, týmování, běhání a aplikace' },
  { date: '01.01.', name: 'Nelegendový sportovní den', description: 'Turnaj ve sportovních aktivitách a volný program' },
  { date: '02.01.', name: 'Nelegendované workshopy', description: 'Workshopy a volný program' },
  { date: '03.01.', name: 'Nelegendovaný odjezd', description: 'Však už toho bude dost' },
];

const ProgramWidget: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="program-widget">
      <h2 className="program-heading">Přes den freestyle, večer legenda a&nbsp;program</h2>

      <ul
        className={`program-list${activeIndex !== null ? ' has-active' : ''}`}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {days.map((day, index) => {
          const isActive = activeIndex === index;
          return (
            <li
              key={day.date}
              className={`program-row${isActive ? ' is-active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="program-line">
                <span className="program-date">{day.date}</span>
                <span className="program-name">{day.name}</span>
              </div>
              <p className="program-description">{day.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ProgramWidget;
