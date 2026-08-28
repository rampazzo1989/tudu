import React, { memo } from 'react';
import { ActivityIndicator, Text, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BlurredModal } from '../blurred-modal';
import {
  ButtonContainer,
  CancelButton,
  CancelButtonText,
  DateBadge,
  DateBadgeLabel,
  DateBadgeValue,
  HeaderRow,
  IconContainer,
  ModalContainer,
  ModalSubtitle,
  ModalTitle,
  PrimaryButton,
  PrimaryButtonText,
  SettingsIncludedBadge,
  SettingsIncludedText,
  StatBox,
  StatLabel,
  StatNumber,
  StatsGrid,
  TitleContainer,
  WarningCard,
  WarningText,
} from './styles';
import { BackupPreviewModalProps } from './types';

export const BackupPreviewModal: React.FC<BackupPreviewModalProps> = memo(
  ({ visible, preview, onConfirmRestore, onCancel, isLoading = false }) => {
    const { t } = useTranslation();

    if (!preview) {
      return null;
    }

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(preview.createdAt);

    const sourceLabel =
      preview.source === 'google_drive'
        ? t('settings.backup.previewSourceCloud', { defaultValue: 'Google Drive' })
        : t('settings.backup.previewSourceLocal', { defaultValue: 'Arquivo Local' });

    return (
      <BlurredModal visible={visible} onTouchBackground={isLoading ? undefined : onCancel}>
        <TouchableWithoutFeedback>
          <ModalContainer>
            <HeaderRow>
              <IconContainer>
                <Text style={{ fontSize: 22 }}>📦</Text>
              </IconContainer>
              <TitleContainer>
                <ModalTitle>{t('settings.backup.previewModalTitle', { defaultValue: 'Restaurar Backup' })}</ModalTitle>
                <ModalSubtitle>{sourceLabel}</ModalSubtitle>
              </TitleContainer>
            </HeaderRow>

            <DateBadge>
              <DateBadgeLabel>{t('settings.backup.previewDateLabel', { defaultValue: 'Criado em:' })}</DateBadgeLabel>
              <DateBadgeValue>{formattedDate}</DateBadgeValue>
            </DateBadge>

            <StatsGrid>
              <StatBox>
                <StatNumber>{preview.listsCount}</StatNumber>
                <StatLabel>{t('settings.backup.statLists', { defaultValue: 'Listas' })}</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{preview.tudusCount}</StatNumber>
                <StatLabel>{t('settings.backup.statTasks', { defaultValue: 'Tarefas' })}</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{preview.countersCount}</StatNumber>
                <StatLabel>{t('settings.backup.statCounters', { defaultValue: 'Contadores' })}</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>{preview.archivedCount}</StatNumber>
                <StatLabel>{t('settings.backup.statArchived', { defaultValue: 'Arquivados' })}</StatLabel>
              </StatBox>
            </StatsGrid>

            {preview.hasSettings && (
              <SettingsIncludedBadge>
                <Text style={{ fontSize: 16 }}>⚙️</Text>
                <SettingsIncludedText>
                  {t(
                    'settings.backup.previewIncludesSettings',
                    { defaultValue: 'Inclui configurações (notificações, segurança, IA, consumo e preferências).' },
                  )}
                </SettingsIncludedText>
              </SettingsIncludedBadge>
            )}

            <WarningCard>
              <Text style={{ fontSize: 16 }}>⚠️</Text>
              <WarningText>
                {t(
                  'settings.backup.restoreWarning',
                  { defaultValue: 'A restauração substituirá todas as listas, tarefas e contadores atuais no aplicativo.' },
                )}
              </WarningText>
            </WarningCard>

            <ButtonContainer>
              <CancelButton onPress={onCancel} disabled={isLoading}>
                <CancelButtonText>{t('buttons.cancel')}</CancelButtonText>
              </CancelButton>
              <PrimaryButton onPress={onConfirmRestore} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <PrimaryButtonText>
                    {t('settings.backup.confirmRestoreButton', { defaultValue: 'Restaurar' })}
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
