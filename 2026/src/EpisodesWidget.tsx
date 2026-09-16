import React from 'react';
import BaseListWidget, { BaseListWidgetItem } from './BaseListWidget';

export interface TaleIssue {
  id: string;
  label: string;
  description: string;
}

export const taleIssues: TaleIssue[] = [
  {
    id: 'S03E01',
    label: '- Karel poznává svořitele',
    description: 'Karel se po ztrátě paměti snaží poznat kdo vlastně je.',
  },
  {
    id: 'S03E02',
    label: '- Karlopolis tě zahltí',
    description: 'Mock episode pro budoucí story.',
  },
];

const episodeRows: BaseListWidgetItem[] = taleIssues.map((issue) => ({
  key: issue.id,
  date: issue.id,
  name: issue.label,
  description: issue.description,
}));

type EpisodesWidgetProps = {
  activeEpisodeId?: string | null;
  onSelectEpisode?: (id: string) => void;
};

const EpisodesWidget: React.FC<EpisodesWidgetProps> = ({ activeEpisodeId = null, onSelectEpisode }) => {
  return (
    <BaseListWidget
      heading="Příběhy Karlopolis"
      items={episodeRows}
      selectedKey={activeEpisodeId}
      onSelectItem={onSelectEpisode}
    />
  );
};

export default EpisodesWidget;