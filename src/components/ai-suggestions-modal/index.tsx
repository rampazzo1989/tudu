import React, { memo, useCallback, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { BlurredModal } from '../blurred-modal';
import { GradientSeparator } from '../gradient-separator';
import Skeleton from '../skeleton';
import { CheckboxSimple } from '../checkbox-simple';
import { useAITaskSuggestions } from '../../service/ai';
import { AISuggestionsModalProps } from './types';
import {
  ActionPill,
  ActionPillText,
  ActionsBar,
  CloseIconButton,
  CloseIconText,
  EmptyContainer,
  FooterButtonsRow,
  HeaderContainer,
  HeaderTopRow,
  ItemDismissButton,
  ItemDismissText,
  ItemLabel,
  ItemRow,
  ItemsScrollView,
  ItemTextContainer,
  LoadingContainer,
  LoadingText,
  ModalContainer,
  ModalSubtitle,
  ModalTitle,
  NoticeButton,
  NoticeButtonText,
  NoticeCard,
  NoticeIcon,
  NoticeText,
  PrimaryConfirmButton,
  PrimaryConfirmButtonText,
  SecondaryCancelButton,
  SecondaryCancelButtonText,
  SparkleBadge,
  SparkleText,
  TitleContainer,
} from './styles';

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = memo(
  ({
    isVisible,
    listName = '',
    existingTasks = [],
    seedInput,
    onClose,
    onConfirm,
    onOpenAISettings,
  }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const {
      suggestions,
      isLoading,
      error,
      isAIConfigured,
      fetchSuggestions,
      toggleItem,
      removeItem,
      toggleSelectAll,
      regenerate,
      reset,
      selectedCount,
      selectedLabels,
      isAllSelected,
    } = useAITaskSuggestions();

    useEffect(() => {
      if (isVisible) {
        if (isAIConfigured && listName.trim().length > 0) {
          fetchSuggestions({
            listName,
            existingTasks,
            currentInput: seedInput,
          });
        }
      } else {
        reset();
      }
    }, [isVisible, isAIConfigured, listName]);

    const handleToggleItem = useCallback(
      (id: string) => {
        RNReactNativeHapticFeedback.trigger('impactLight');
        toggleItem(id);
      },
      [toggleItem],
    );

    const handleToggleSelectAll = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      toggleSelectAll();
    }, [toggleSelectAll]);

    const handleRegenerate = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      regenerate(existingTasks);
    }, [regenerate, existingTasks]);

    const handleConfirm = useCallback(() => {
      if (selectedCount === 0) return;
      RNReactNativeHapticFeedback.trigger('notificationSuccess');
      onConfirm(selectedLabels);
      onClose();
    }, [selectedCount, selectedLabels, onConfirm, onClose]);

    const handleDismissItem = useCallback(
      (id: string) => {
        RNReactNativeHapticFeedback.trigger('impactLight');
        removeItem(id);
      },
      [removeItem],
    );

    return (
      <BlurredModal
        visible={isVisible}
        transparent
        onTouchBackground={onClose}
        onRequestClose={onClose}>
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOutDown.duration(200)}
          style={{ width: '100%', alignItems: 'center' }}>
          <ModalContainer>
            {/* Header */}
            <HeaderContainer>
              <HeaderTopRow>
                <TitleContainer>
                  <SparkleBadge>
                    <SparkleText>✨</SparkleText>
                  </SparkleBadge>
                  <ModalTitle numberOfLines={1}>
                    {t('aiSuggestions.title', { defaultValue: 'Sugestões de Itens' })}
                  </ModalTitle>
                </TitleContainer>
                <CloseIconButton onPress={onClose} hitSlop={15}>
                  <CloseIconText>×</CloseIconText>
                </CloseIconButton>
              </HeaderTopRow>
              {listName ? (
                <ModalSubtitle numberOfLines={1}>
                  {t('aiSuggestions.subtitle', {
                    listName,
                    defaultValue: `Para "${listName}"`,
                  })}
                </ModalSubtitle>
              ) : null}
            </HeaderContainer>

            <GradientSeparator
              colorArray={theme.colors.defaultSeparatorGradientColors}
              marginTop={6}
            />

            {/* Not configured state */}
            {!isAIConfigured ? (
              <NoticeCard>
                <NoticeIcon>🔑</NoticeIcon>
                <NoticeText>
                  {t('aiSuggestions.noApiKey', {
                    defaultValue:
                      'Configure sua chave de API nas configurações de IA para gerar sugestões inteligentes.',
                  })}
                </NoticeText>
                {onOpenAISettings && (
                  <NoticeButton
                    onPress={() => {
                      onClose();
                      onOpenAISettings();
                    }}>
                    <NoticeButtonText>
                      {t('aiSuggestions.configureAI', {
                        defaultValue: '⚙️ Configurar IA',
                      })}
                    </NoticeButtonText>
                  </NoticeButton>
                )}
              </NoticeCard>
            ) : isLoading ? (
              /* Loading Skeletons */
              <LoadingContainer>
                {Array.from({ length: 4 }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      marginBottom: 6,
                      borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }}>
                    <Skeleton
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: '#585f69',
                      }}
                    />
                    <Skeleton
                      style={{
                        flex: 1,
                        height: 16,
                        borderRadius: 4,
                        marginLeft: 12,
                        backgroundColor: '#585f69',
                      }}
                    />
                  </View>
                ))}
                <LoadingText>
                  {t('aiSuggestions.loading', {
                    defaultValue: '✨ Gerando sugestões com IA...',
                  })}
                </LoadingText>
              </LoadingContainer>
            ) : error && suggestions.length === 0 ? (
              /* Error State */
              <NoticeCard>
                <NoticeIcon>⚠️</NoticeIcon>
                <NoticeText>
                  {error === 'API Key not found'
                    ? t('aiSuggestions.noApiKey')
                    : t('aiSuggestions.error', {
                        defaultValue: 'Não foi possível carregar sugestões no momento.',
                      })}
                </NoticeText>
                <NoticeButton onPress={handleRegenerate}>
                  <NoticeButtonText>
                    {t('buttons.other', { defaultValue: 'Tentar novamente' })}
                  </NoticeButtonText>
                </NoticeButton>
              </NoticeCard>
            ) : (
              /* Suggestions List */
              <>
                {suggestions.length > 0 && (
                  <ActionsBar>
                    <ActionPill onPress={handleToggleSelectAll}>
                      <ActionPillText>
                        {isAllSelected
                          ? t('aiSuggestions.deselectAll', {
                              defaultValue: 'Desmarcar todos',
                            })
                          : t('aiSuggestions.selectAll', {
                              defaultValue: 'Selecionar todos',
                            })}
                      </ActionPillText>
                    </ActionPill>
                    <ActionPill onPress={handleRegenerate}>
                      <ActionPillText>
                        {t('aiSuggestions.regenerate', {
                          defaultValue: '🔄 Sugerir outros',
                        })}
                      </ActionPillText>
                    </ActionPill>
                  </ActionsBar>
                )}

                <ItemsScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled">
                  {suggestions.map(item => (
                    <Animated.View
                      key={item.id}
                      layout={LinearTransition}>
                      <ItemRow
                        isSelected={item.selected}
                        activeOpacity={0.7}
                        onPress={() => handleToggleItem(item.id)}>
                        <CheckboxSimple
                          checked={item.selected}
                          onPress={() => handleToggleItem(item.id)}
                        />
                        <ItemTextContainer>
                          <ItemLabel
                            isSelected={item.selected}
                            numberOfLines={2}>
                            {item.label}
                          </ItemLabel>
                        </ItemTextContainer>
                        <ItemDismissButton
                          onPress={() => handleDismissItem(item.id)}
                          hitSlop={10}>
                          <ItemDismissText>×</ItemDismissText>
                        </ItemDismissButton>
                      </ItemRow>
                    </Animated.View>
                  ))}
                </ItemsScrollView>
              </>
            )}

            {/* Footer Buttons */}
            <FooterButtonsRow>
              <SecondaryCancelButton onPress={onClose}>
                <SecondaryCancelButtonText>
                  {t('buttons.cancel', { defaultValue: 'Cancelar' })}
                </SecondaryCancelButtonText>
              </SecondaryCancelButton>
              {isAIConfigured && (
                <PrimaryConfirmButton
                  disabled={selectedCount === 0 || isLoading}
                  onPress={handleConfirm}>
                  <PrimaryConfirmButtonText disabled={selectedCount === 0 || isLoading}>
                    {selectedCount > 0
                      ? t('aiSuggestions.addSelected', {
                          count: selectedCount,
                          defaultValue: `Adicionar (${selectedCount})`,
                        })
                      : t('aiSuggestions.addSelectedNone', {
                          defaultValue: 'Nenhum selecionado',
                        })}
                  </PrimaryConfirmButtonText>
                </PrimaryConfirmButton>
              )}
            </FooterButtonsRow>
          </ModalContainer>
        </Animated.View>
      </BlurredModal>
    );
  },
);

export { AISuggestionsModal };
