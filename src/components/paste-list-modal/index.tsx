import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Toast from 'react-native-toast-message';

import { BlurredModal } from '../blurred-modal';
import { GradientSeparator } from '../gradient-separator';
import Skeleton from '../skeleton';
import { CheckboxSimple } from '../checkbox-simple';
import { useAIParseList } from '../../service/ai';
import { useListService } from '../../service/list-service-hook/useListService';
import { generateRandomHash } from '../../hooks/useHashGenerator';
import { getDuplicateProofListTitle } from '../../utils/list-and-group-utils';
import { List, ListViewModel, TuduItem, TuduViewModel } from '../../scenes/home/types';
import { StackNavigatorParamList } from '../../navigation/stack-navigator/types';
import { PasteListModalProps } from './types';
import {
  ActionPill,
  ActionPillText,
  ActionsBar,
  ClearTextButton,
  ClearTextButtonText,
  CloseIconButton,
  CloseIconText,
  ErrorCard,
  ErrorText,
  FooterButtonsRow,
  HeaderContainer,
  HeaderTopRow,
  InputFooterRow,
  ItemCountBadge,
  ItemCountBadgeText,
  ItemDismissButton,
  ItemDismissText,
  ItemLabel,
  ItemRow,
  ItemsScrollView,
  ItemTextContainer,
  ListTitleContainer,
  ListTitleInput,
  ListTitleLabel,
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
  TextAreaContainer,
  TextAreaInput,
  TextCharCount,
  TitleContainer,
} from './styles';

export const PasteListModal: React.FC<PasteListModalProps> = memo(
  ({ visible, onRequestClose, onListCreated, onOpenAISettings }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigation =
      useNavigation<NativeStackNavigationProp<StackNavigatorParamList>>();
    const textInputRef = useRef<TextInput>(null);

    const {
      rawText,
      setRawText,
      parsedTitle,
      setParsedTitle,
      items,
      isLoading,
      error,
      hasParsed,
      setHasParsed,
      isAIConfigured,
      parseText,
      toggleItem,
      removeItem,
      toggleSelectAll,
      reset,
      selectedCount,
      selectedLabels,
      isAllSelected,
    } = useAIParseList();

    const { getAllLists, saveListAndTudus } = useListService();

    useEffect(() => {
      if (visible) {
        setTimeout(() => textInputRef.current?.focus(), 250);
      } else {
        reset();
      }
    }, [visible, reset]);

    const handleRequestClose = useCallback(() => {
      reset();
      onRequestClose();
    }, [onRequestClose, reset]);

    const handleProcessWithAI = useCallback(async () => {
      if (!rawText.trim() || rawText.trim().length < 2) return;
      RNReactNativeHapticFeedback.trigger('impactLight');
      await parseText();
    }, [parseText, rawText]);

    const handleBackToInput = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      setHasParsed(false);
      setTimeout(() => textInputRef.current?.focus(), 200);
    }, [setHasParsed]);

    const handleToggleItem = useCallback(
      (id: string) => {
        RNReactNativeHapticFeedback.trigger('impactLight');
        toggleItem(id);
      },
      [toggleItem],
    );

    const handleDismissItem = useCallback(
      (id: string) => {
        RNReactNativeHapticFeedback.trigger('impactLight');
        removeItem(id);
      },
      [removeItem],
    );

    const handleToggleSelectAll = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      toggleSelectAll();
    }, [toggleSelectAll]);

    const handleCreateList = useCallback(() => {
      if (selectedCount === 0) return;

      const allLists = getAllLists() ?? [];
      const cleanTitle = parsedTitle.trim() || '📝 Lista';
      const finalTitle = getDuplicateProofListTitle(allLists, cleanTitle);
      const listId = generateRandomHash('List');

      const newListData: List = {
        id: listId,
        label: finalTitle,
      };

      const tuduViewModels = selectedLabels.map(label => {
        const item: TuduItem = {
          id: generateRandomHash('Tudu'),
          label: label.trim(),
          done: false,
        };
        return new TuduViewModel(item, listId, 'default', finalTitle);
      });

      const tuduMap = new Map(tuduViewModels.map(t => [t.id, t.mapBack()]));
      const newListViewModel = new ListViewModel(newListData, tuduMap, 'default');

      saveListAndTudus(newListViewModel);

      RNReactNativeHapticFeedback.trigger('notificationSuccess');

      Toast.show({
        type: 'success',
        text1: t('pasteListModal.successToast', {
          name: finalTitle,
          defaultValue: `Lista '${finalTitle}' criada com sucesso!`,
        }),
        position: 'bottom',
        bottomOffset: 60,
      });

      handleRequestClose();

      if (onListCreated) {
        onListCreated(listId, finalTitle);
      } else {
        navigation.navigate('List', {
          listId,
          title: finalTitle,
          listOrigin: 'default',
        });
      }
    }, [
      getAllLists,
      handleRequestClose,
      navigation,
      onListCreated,
      parsedTitle,
      saveListAndTudus,
      selectedCount,
      selectedLabels,
      t,
    ]);

    return (
      <BlurredModal
        visible={visible}
        transparent
        onTouchBackground={handleRequestClose}
        onRequestClose={handleRequestClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutDown.duration(200)}
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
                      {t('pasteListModal.title', {
                        defaultValue: 'Lista a partir de Texto',
                      })}
                    </ModalTitle>
                  </TitleContainer>
                  <CloseIconButton onPress={handleRequestClose} hitSlop={15}>
                    <CloseIconText>×</CloseIconText>
                  </CloseIconButton>
                </HeaderTopRow>
                <ModalSubtitle numberOfLines={1}>
                  {t('pasteListModal.subtitle', {
                    defaultValue: 'Cole qualquer texto para organizar com IA',
                  })}
                </ModalSubtitle>
              </HeaderContainer>

              <GradientSeparator
                colorArray={theme.colors.defaultSeparatorGradientColors}
                marginTop={6}
              />

              {/* No API key notice */}
              {!isAIConfigured ? (
                <NoticeCard>
                  <NoticeIcon>🔑</NoticeIcon>
                  <NoticeText>
                    {t('pasteListModal.noApiKey', {
                      defaultValue:
                        'Configure sua chave de API nas configurações de IA para converter textos em listas.',
                    })}
                  </NoticeText>
                  {onOpenAISettings && (
                    <NoticeButton
                      onPress={() => {
                        handleRequestClose();
                        onOpenAISettings();
                      }}>
                      <NoticeButtonText>
                        {t('pasteListModal.configureAI', {
                          defaultValue: '⚙️ Configurar IA',
                        })}
                      </NoticeButtonText>
                    </NoticeButton>
                  )}
                </NoticeCard>
              ) : isLoading ? (
                /* Loading State */
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
                    {t('pasteListModal.loading', {
                      defaultValue: '✨ Analisando e organizando itens com IA...',
                    })}
                  </LoadingText>
                </LoadingContainer>
              ) : !hasParsed ? (
                /* Step 1: Input / Paste Text */
                <>
                  <TextAreaContainer>
                    <TextAreaInput
                      ref={textInputRef}
                      value={rawText}
                      onChangeText={setRawText}
                      placeholder={t('pasteListModal.placeholder', {
                        defaultValue:
                          'Cole aqui sua lista de compras, tarefas, ingredientes ou mensagens do WhatsApp...\n\nExemplo:\n• Pão de forma\n• 8 pão francês\n• Mamão\n• 2 bandejas de ovos',
                      })}
                      placeholderTextColor="#6D7886"
                      multiline
                      numberOfLines={6}
                      autoFocus
                    />
                    <InputFooterRow>
                      <TextCharCount>{rawText.length} caracteres</TextCharCount>
                      {rawText.length > 0 && (
                        <ClearTextButton onPress={() => setRawText('')}>
                          <ClearTextButtonText>Limpar</ClearTextButtonText>
                        </ClearTextButton>
                      )}
                    </InputFooterRow>
                  </TextAreaContainer>

                  {error && (
                    <ErrorCard>
                      <ErrorText>
                        {error === 'API Key not found'
                          ? t('pasteListModal.noApiKey')
                          : t('pasteListModal.genericError', {
                              defaultValue:
                                'Não foi possível processar o texto com IA no momento.',
                            })}
                      </ErrorText>
                    </ErrorCard>
                  )}

                  <FooterButtonsRow>
                    <SecondaryCancelButton onPress={handleRequestClose}>
                      <SecondaryCancelButtonText>
                        {t('buttons.cancel', { defaultValue: 'Cancelar' })}
                      </SecondaryCancelButtonText>
                    </SecondaryCancelButton>
                    <PrimaryConfirmButton
                      disabled={!rawText.trim() || rawText.trim().length < 2}
                      onPress={handleProcessWithAI}>
                      <PrimaryConfirmButtonText
                        disabled={!rawText.trim() || rawText.trim().length < 2}>
                        {t('pasteListModal.buttonProcess', {
                          defaultValue: '✨ Organizar com IA',
                        })}
                      </PrimaryConfirmButtonText>
                    </PrimaryConfirmButton>
                  </FooterButtonsRow>
                </>
              ) : items.length === 0 ? (
                /* Step 2 (Empty Result): No items found */
                <NoticeCard>
                  <NoticeIcon>⚠️</NoticeIcon>
                  <NoticeText>
                    {t('pasteListModal.emptyError', {
                      defaultValue:
                        'Nenhum item identificado no texto colado. Tente colar uma lista com itens ou tarefas.',
                    })}
                  </NoticeText>
                  <NoticeButton onPress={handleBackToInput}>
                    <NoticeButtonText>
                      {t('pasteListModal.buttonBack', {
                        defaultValue: 'Voltar ao texto',
                      })}
                    </NoticeButtonText>
                  </NoticeButton>
                </NoticeCard>
              ) : (
                /* Step 2 (Success): Result Preview & Customization */
                <>
                  <ListTitleContainer>
                    <ListTitleLabel>
                      {t('pasteListModal.listTitleLabel', {
                        defaultValue: 'Nome da Lista',
                      })}
                    </ListTitleLabel>
                    <ListTitleInput
                      value={parsedTitle}
                      onChangeText={setParsedTitle}
                      placeholder="Nome da lista"
                      placeholderTextColor="#6D7886"
                      maxLength={35}
                    />
                  </ListTitleContainer>

                  <ActionsBar>
                    <ItemCountBadge>
                      <ItemCountBadgeText>
                        {t('pasteListModal.itemsFound', {
                          count: items.length,
                          defaultValue: `${items.length} itens encontrados`,
                        })}
                      </ItemCountBadgeText>
                    </ItemCountBadge>

                    <ActionPill onPress={handleToggleSelectAll}>
                      <ActionPillText>
                        {isAllSelected
                          ? t('pasteListModal.deselectAll', {
                              defaultValue: 'Desmarcar todos',
                            })
                          : t('pasteListModal.selectAll', {
                              defaultValue: 'Selecionar todos',
                            })}
                      </ActionPillText>
                    </ActionPill>
                  </ActionsBar>

                  <ItemsScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    {items.map(item => (
                      <Animated.View key={item.id} layout={LinearTransition}>
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

                  <FooterButtonsRow>
                    <SecondaryCancelButton onPress={handleBackToInput}>
                      <SecondaryCancelButtonText>
                        {t('pasteListModal.buttonBack', {
                          defaultValue: 'Voltar ao texto',
                        })}
                      </SecondaryCancelButtonText>
                    </SecondaryCancelButton>
                    <PrimaryConfirmButton
                      disabled={selectedCount === 0}
                      onPress={handleCreateList}>
                      <PrimaryConfirmButtonText disabled={selectedCount === 0}>
                        {selectedCount > 0
                          ? t('pasteListModal.buttonCreate', {
                              count: selectedCount,
                              defaultValue: `Criar Lista (${selectedCount})`,
                            })
                          : t('pasteListModal.buttonCreateNone', {
                              defaultValue: 'Nenhum selecionado',
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
