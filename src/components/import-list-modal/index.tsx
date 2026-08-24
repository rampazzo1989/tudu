import React, { memo } from 'react';
import { ActivityIndicator, Text, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BlurredModal } from '../blurred-modal';
import {
  ButtonContainer,
  CancelButton,
  CancelButtonText,
  HeaderRow,
  IconContainer,
  InfoCard,
  InfoText,
  ListNameBadge,
  ListNameText,
  ModalContainer,
  ModalSubtitle,
  ModalTitle,
  PrimaryButton,
  PrimaryButtonText,
  StatBox,
  StatLabel,
  StatNumber,
  StatsGrid,
  TitleContainer,
} from './styles';
import { ImportListModalProps } from './types';

export const ImportListModal: React.FC<ImportListModalProps> = memo(
  ({ visible, preview, onConfirmImport, onCancel, isLoading = false }) => {
    const { t } = useTranslation();

    if (!preview) {
      return null;
    }

    return (
      <BlurredModal visible={visible} onTouchBackground={() => !isLoading && onCancel()}>
        <TouchableWithoutFeedback>
          <ModalContainer>
            <HeaderRow>
              <IconContainer>
                <Text style={{ fontSize: 22 }}>📋</Text>
              </IconContainer>
              <TitleContainer>
                <ModalTitle>
                  {t('importModal.title', { defaultValue: 'Importar Lista' })}
                </ModalTitle>
                <ModalSubtitle>
                  {t('importModal.subtitle', { defaultValue: 'Arquivo .tudu compartilhado' })}
                </ModalSubtitle>
              </TitleContainer>
            </HeaderRow>

            <ListNameBadge>
              <ListNameText numberOfLines={2}>
                {preview.list.label}
              </ListNameText>
            </ListNameBadge>

            <StatsGrid>
              <StatBox>
                <StatNumber>{preview.totalTudus}</StatNumber>
                <StatLabel>
                  {t('importModal.statTotal', { defaultValue: 'Total de itens' })}
                </StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{preview.pendingTudus}</StatNumber>
                <StatLabel>
                  {t('importModal.statPending', { defaultValue: 'Pendentes' })}
                </StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{preview.starredTudus}</StatNumber>
                <StatLabel>
                  {t('importModal.statStarred', { defaultValue: 'Favoritos' })}
                </StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{preview.scheduledTudus}</StatNumber>
                <StatLabel>
                  {t('importModal.statScheduled', { defaultValue: 'Agendados' })}
                </StatLabel>
              </StatBox>
            </StatsGrid>

            <InfoCard>
              <Text style={{ fontSize: 16 }}>✨</Text>
              <InfoText>
                {t(
                  'importModal.infoText',
                  { defaultValue: 'Uma nova lista será criada com todos os itens e prazos preservados.' },
                )}
              </InfoText>
            </InfoCard>

            <ButtonContainer>
              <CancelButton onPress={onCancel} disabled={isLoading}>
                <CancelButtonText>
                  {t('buttons.cancel', { defaultValue: 'Cancelar' })}
                </CancelButtonText>
              </CancelButton>
              <PrimaryButton onPress={onConfirmImport} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <PrimaryButtonText>
                    {t('importModal.confirmButton', { defaultValue: 'Importar Lista' })}
                  </PrimaryButtonText>
                )}
              </PrimaryButton>
            </ButtonContainer>
          </ModalContainer>
        </TouchableWithoutFeedback>
      </BlurredModal>
    );
  },
);
