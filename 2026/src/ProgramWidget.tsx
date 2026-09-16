import React from 'react';
import './ProgramWidget.css';
import BaseListWidget, { BaseListWidgetItem } from './BaseListWidget';

export interface ProgramDay {
  date: string;
  name: string;
  description: string;
}

export const programDays: ProgramDay[] = [
  { date: '27.12.', name: 'Karlův Hod Vánoční', description: 'Tradiční sváteční Karlopoliský obyčej' },
  { date: '28.12.', name: 'Připravený program', description: 'Tato aktivita ještě nebude veřejná' },
  { date: '29.12.', name: 'Připravená indoor aktivita', description: 'Tato aktivita se dá uhádnout' },
  { date: '30.12.', name: 'Evžentura 3.0', description: 'Nebo Fakokracie nebo něco mezi' },
  { date: '31.12.', name: 'Propracovaná outdoorová hra', description: 'Mečovaní, týmování, běhání a aplikace' },
  { date: '01.01.', name: 'Nelegendový sportovní den', description: 'Turnaj ve sportovních aktivitách a volný program' },
  { date: '02.01.', name: 'Nelegendované workshopy', description: 'Workshopy a volný program' },
  { date: '03.01.', name: 'Nelegendovaný odjezd', description: 'Však už toho bude dost' },
];

const programRows: BaseListWidgetItem[] = programDays.map((day) => ({
  key: day.date,
  date: day.date,
  name: day.name,
  description: day.description,
}));

const ProgramWidget: React.FC = () => {
  return <BaseListWidget heading="Přes den freestyle, večer legenda a program" items={programRows} />;
};

export default ProgramWidget;
