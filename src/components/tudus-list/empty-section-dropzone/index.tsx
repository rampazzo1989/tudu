import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../../../scenes/home/types';
import { DropzoneContainer, DropzoneText } from './styles';

interface EmptySectionDropzoneProps {
  section: Section;
  onPress?: (section: Section) => void;
}

export const EmptySectionDropzone: React.FC<EmptySectionDropzoneProps> = memo(
  ({ section, onPress }) => {
    const { t } = useTranslation();

    return (
      <DropzoneContainer
        onPress={() => onPress?.(section)}
        scaleFactor={0.02}
        activeOpacity={0.7}>
        <DropzoneText>
          {t('sections.emptyDropzone', {
            defaultValue: 'Arraste tudús para cá ou toque para adicionar',
          })}
        </DropzoneText>
      </DropzoneContainer>
    );
  },
);
