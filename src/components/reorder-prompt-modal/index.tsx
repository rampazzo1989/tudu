import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { useRecoilValue } from 'recoil';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { BlurredModal } from '../blurred-modal';
import { GradientSeparator } from '../gradient-separator';
import Skeleton from '../skeleton';
import { aiSettingsState } from '../../state/atoms';
import {
  AIOrderingType,
  getSecureApiKey,
  reorderListWithAI,
} from '../../service/ai';
import { ReorderPromptModalProps } from './types';
import {
  CloseIconButton,
  CloseIconText,
  CustomPromptContainer,
  CustomPromptInput,
  ErrorCard,
  ErrorText,
  FooterButtonsRow,
  HeaderContainer,
  HeaderTopRow,
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
  OptionDesc,
  OptionRadioCircle,
  OptionRadioInner,
  OptionTextContainer,
  OptionTitle,
  OrderingOptionCard,
  OrderingOptionsContainer,
  PrimaryConfirmButton,
  PrimaryConfirmButtonText,
  SecondaryCancelButton,
  SecondaryCancelButtonText,
  SparkleBadge,
  SparkleText,
  StepHeader,
  StepSubtitle,
  StepTitle,
  TitleContainer,
} from './styles';

export const ReorderPromptModal: React.FC<ReorderPromptModalProps> = memo(
  ({
    visible,
    initialPrompt = '',
    currentItems,
    currentSections,
    onApplyReorder,
    onRequestClose,
    onOpenAISettings,
  }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const aiSettings = useRecoilValue(aiSettingsState);
    const customPromptInputRef = useRef<TextInput>(null);

    const [orderingType, setOrderingType] = useState<AIOrderingType>('smart');
    const [customPrompt, setCustomPrompt] = useState(initialPrompt);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAIConfigured = useMemo(() => {
      return !!getSecureApiKey(aiSettings.provider);
    }, [aiSettings.provider]);

    useEffect(() => {
      if (visible) {
        if (initialPrompt && initialPrompt.trim().length > 0) {
          setOrderingType('custom');
          setCustomPrompt(initialPrompt.trim());
        } else {
          setOrderingType('smart');
          setCustomPrompt('');
        }
        setIsLoading(false);
        setError(null);
      }
    }, [visible, initialPrompt]);

    const handleSelectOrderingType = useCallback((type: AIOrderingType) => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      setOrderingType(type);
      if (type === 'custom') {
        setTimeout(() => customPromptInputRef.current?.focus(), 150);
      }
    }, []);

    const handleProcessReorder = useCallback(async () => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      setError(null);

      if (orderingType === 'none') {
        await onApplyReorder({
          sections: undefined,
          reorderedItems: currentItems.map(lbl => ({ label: lbl })),
          orderingPrompt: undefined,
        });
        onRequestClose();
        return;
      }

      setIsLoading(true);
      try {
        const result = await reorderListWithAI(
          aiSettings.provider,
          currentItems,
          currentSections,
          orderingType === 'custom' && customPrompt.trim()
            ? customPrompt.trim()
            : undefined,
        );

        const sectionsResult = result.sections || [];
        const reorderedItems: { label: string; sectionTitle?: string }[] = [];

        if (sectionsResult.length > 0) {
          sectionsResult.forEach(sec => {
            sec.items.forEach(lbl => {
              reorderedItems.push({ label: lbl, sectionTitle: sec.title });
            });
          });
        } else if (result.items && result.items.length > 0) {
          result.items.forEach(lbl => {
            reorderedItems.push({ label: lbl });
          });
        }

        // Include any missing original items at the end
        const returnedLabels = new Set(
          reorderedItems.map(it => it.label.trim().toLowerCase()),
        );
        currentItems.forEach(orig => {
          if (!returnedLabels.has(orig.trim().toLowerCase())) {
            reorderedItems.push({ label: orig });
          }
        });

        const activeSections = sectionsResult.map((sec, index) => ({
          title: sec.title,
          order: index,
        }));

        await onApplyReorder({
          sections: activeSections.length > 0 ? activeSections : undefined,
          reorderedItems,
          orderingPrompt:
            orderingType === 'custom' && customPrompt.trim()
              ? customPrompt.trim()
              : undefined,
        });

        onRequestClose();
      } catch (err: any) {
        setError(
          t('reorderPromptModal.genericError', {
            defaultValue:
              'Não foi possível reordenar a lista com IA no momento.',
          }),
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      aiSettings.provider,
      currentItems,
      currentSections,
      customPrompt,
      onApplyReorder,
      onRequestClose,
      orderingType,
      t,
    ]);

    return (
      <BlurredModal
        visible={visible}
        transparent
        onTouchBackground={isLoading ? undefined : onRequestClose}
        onRequestClose={isLoading ? () => {} : onRequestClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(150)}
            style={{ width: '100%', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <ModalContainer>
                {/* Header */}
                <HeaderContainer>
                  <HeaderTopRow>
                    <TitleContainer>
                      <SparkleBadge>
                        <SparkleText>✨</SparkleText>
                      </SparkleBadge>
                      <ModalTitle numberOfLines={1}>
                        {t('reorderPromptModal.title', {
                          defaultValue: 'Reordenar com IA',
                        })}
                      </ModalTitle>
                    </TitleContainer>
                    {!isLoading && (
                      <CloseIconButton onPress={onRequestClose} hitSlop={12}>
                        <CloseIconText>×</CloseIconText>
                      </CloseIconButton>
                    )}
                  </HeaderTopRow>

                  <ModalSubtitle numberOfLines={1}>
                    {t('reorderPromptModal.subtitle', {
                      defaultValue: 'Escolha como a lista deve ser organizada',
                    })}
                  </ModalSubtitle>
                </HeaderContainer>

                <GradientSeparator
                  colorArray={theme.colors.defaultSeparatorGradientColors}
                />

                {/* Body Content */}
                {!isAIConfigured ? (
                  <NoticeCard>
                    <NoticeIcon>⚙️</NoticeIcon>
                    <NoticeText>
                      {t('reorderPromptModal.noApiKey', {
                        defaultValue:
                          'Configure sua chave de API nas configurações de IA para reordenar listas.',
                      })}
                    </NoticeText>
                    <NoticeButton
                      onPress={() => {
                        onRequestClose();
                        onOpenAISettings?.();
                      }}>
                      <NoticeButtonText>
                        {t('reorderPromptModal.configureAI', {
                          defaultValue: '⚙️ Configurar IA',
                        })}
                      </NoticeButtonText>
                    </NoticeButton>
                  </NoticeCard>
                ) : isLoading ? (
                  <LoadingContainer>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          paddingVertical: 10,
                          paddingHorizontal: 8,
                          marginBottom: 6,
                          borderRadius: 8,
                        }}>
                        <Skeleton
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            backgroundColor: '#585f69',
                          }}
                        />
                        <Skeleton
                          style={{
                            flex: 1,
                            height: 16,
                            borderRadius: 4,
                            marginLeft: 10,
                            backgroundColor: '#585f69',
                          }}
                        />
                      </View>
                    ))}
                    <LoadingText>
                      {t('reorderPromptModal.reordering', {
                        defaultValue: '✨ Reordenando lista com IA...',
                      })}
                    </LoadingText>
                  </LoadingContainer>
                ) : (
                  <>
                    <StepHeader>
                      <StepTitle>
                        {t('reorderPromptModal.stepOrderingTitle', {
                          defaultValue: 'Tipo de Ordenação',
                        })}
                      </StepTitle>
                      <StepSubtitle>
                        {t('reorderPromptModal.stepOrderingSubtitle', {
                          defaultValue:
                            'Escolha como a lista deve ser organizada',
                        })}
                      </StepSubtitle>
                    </StepHeader>

                    <OrderingOptionsContainer>
                      {/* Option 1: None */}
                      <OrderingOptionCard
                        isSelected={orderingType === 'none'}
                        onPress={() => handleSelectOrderingType('none')}>
                        <OptionRadioCircle isSelected={orderingType === 'none'}>
                          {orderingType === 'none' && <OptionRadioInner />}
                        </OptionRadioCircle>
                        <OptionTextContainer>
                          <OptionTitle isSelected={orderingType === 'none'}>
                            {t('reorderPromptModal.orderNone', {
                              defaultValue: 'Nenhuma',
                            })}
                          </OptionTitle>
                          <OptionDesc>
                            {t('reorderPromptModal.orderNoneDesc', {
                              defaultValue:
                                'Mantém a ordem original dos itens',
                            })}
                          </OptionDesc>
                        </OptionTextContainer>
                      </OrderingOptionCard>

                      {/* Option 2: Smart */}
                      <OrderingOptionCard
                        isSelected={orderingType === 'smart'}
                        onPress={() => handleSelectOrderingType('smart')}>
                        <OptionRadioCircle isSelected={orderingType === 'smart'}>
                          {orderingType === 'smart' && <OptionRadioInner />}
                        </OptionRadioCircle>
                        <OptionTextContainer>
                          <OptionTitle isSelected={orderingType === 'smart'}>
                            {t('reorderPromptModal.orderSmart', {
                              defaultValue: 'Inteligente ✨',
                            })}
                          </OptionTitle>
                          <OptionDesc>
                            {t('reorderPromptModal.orderSmartDesc', {
                              defaultValue:
                                'Identifica o contexto e organiza em seções lógicas',
                            })}
                          </OptionDesc>
                        </OptionTextContainer>
                      </OrderingOptionCard>

                      {/* Option 3: Custom */}
                      <OrderingOptionCard
                        isSelected={orderingType === 'custom'}
                        onPress={() => handleSelectOrderingType('custom')}>
                        <OptionRadioCircle isSelected={orderingType === 'custom'}>
                          {orderingType === 'custom' && <OptionRadioInner />}
                        </OptionRadioCircle>
                        <OptionTextContainer>
                          <OptionTitle isSelected={orderingType === 'custom'}>
                            {t('reorderPromptModal.orderCustom', {
                              defaultValue: 'Personalizada',
                            })}
                          </OptionTitle>
                          <OptionDesc>
                            {t('reorderPromptModal.orderCustomDesc', {
                              defaultValue:
                                'Defina sua própria lógica ou layout',
                            })}
                          </OptionDesc>
                        </OptionTextContainer>
                      </OrderingOptionCard>

                      {orderingType === 'custom' && (
                        <CustomPromptContainer>
                          <CustomPromptInput
                            ref={customPromptInputRef}
                            value={customPrompt}
                            onChangeText={setCustomPrompt}
                            placeholder={t(
                              'reorderPromptModal.customPromptPlaceholder',
                              {
                                defaultValue:
                                  'Ex: Mercado Assaí, primeira seção é hortifruti, Nescau fica na seção do leite condensado...',
                              },
                            )}
                            placeholderTextColor="#6D7886"
                            multiline
                            numberOfLines={3}
                          />
                        </CustomPromptContainer>
                      )}
                    </OrderingOptionsContainer>

                    {error && (
                      <ErrorCard>
                        <ErrorText>{error}</ErrorText>
                      </ErrorCard>
                    )}

                    <FooterButtonsRow>
                      <SecondaryCancelButton onPress={onRequestClose}>
                        <SecondaryCancelButtonText>
                          {t('buttons.cancel', { defaultValue: 'Cancelar' })}
                        </SecondaryCancelButtonText>
                      </SecondaryCancelButton>
                      <PrimaryConfirmButton onPress={handleProcessReorder}>
                        <PrimaryConfirmButtonText>
                          {t('reorderPromptModal.buttonProcess', {
                            defaultValue: '✨ Reordenar com IA',
                          })}
                        </PrimaryConfirmButtonText>
                      </PrimaryConfirmButton>
                    </FooterButtonsRow>
                  </>
                )}
              </ModalContainer>
            </TouchableWithoutFeedback>
          </Animated.View>
        </KeyboardAvoidingView>
      </BlurredModal>
    );
  },
);

