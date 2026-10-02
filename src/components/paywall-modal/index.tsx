import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { aiSettingsState, paywallModalVisibleState } from '../../state/atoms';
import { useSubscription } from '../../service/subscription/useSubscription';
import { SyncEngine } from '../../service/sync/sync-engine';
import {
  ByokButton,
  ByokButtonText,
  CloseButton,
  CloseButtonText,
  FeatureDescription,
  FeatureIconBox,
  FeatureIconText,
  FeatureItem,
  FeaturesList,
  FeatureTextContainer,
  FeatureTitle,
  HeaderRow,
  LinkButton,
  LinkButtonText,
  ModalContainer,
  Overlay,
  PriceHighlight,
  PriceRow,
  PriceSubtext,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryActionsRow,
  Subtitle,
  Title,
  TrialBadge,
  TrialBadgeText,
} from './styles';

export const PaywallModal: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useRecoilState(paywallModalVisibleState);
  const setAiSettings = useSetRecoilState(aiSettingsState);
  const {
    purchasePro,
    restorePurchases,
    priceFormatted,
    isPro,
    manageSubscription,
  } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handlePurchase = useCallback(async () => {
    setLoading(true);
    try {
      const success = await purchasePro();
      if (success) {
        Alert.alert(
          '🎉 Bem-vindo ao Tudú Pro!',
          'Sua semana gratuita foi ativada com sucesso! A IA gerenciada e a sincronização em nuvem já estão disponíveis.',
        );
        // Upload initial cloud snapshot
        SyncEngine.uploadInitialSnapshot();
        setVisible(false);
      }
    } catch (err: any) {
      if (!err?.userCancelled) {
        Alert.alert('Erro', err?.message || 'Não foi possível concluir a assinatura.');
      }
    } finally {
      setLoading(false);
    }
  }, [purchasePro, setVisible]);

  const handleRestore = useCallback(async () => {
    setLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        const restored = await SyncEngine.restoreFromCloud();
        if (restored) {
          Alert.alert('Sucesso', 'Assinatura e dados da nuvem restaurados com sucesso!');
        } else {
          Alert.alert('Sucesso', 'Assinatura restaurada com sucesso!');
        }
        setVisible(false);
      }
    } catch (err: any) {
      Alert.alert('Aviso', err?.message || 'Nenhuma assinatura ativa encontrada.');
    } finally {
      setLoading(false);
    }
  }, [restorePurchases, setVisible]);

  const handleUseOwnKey = useCallback(() => {
    if (isPro) return;
    setAiSettings(prev => ({
      ...prev,
      mode: 'byok',
    }));
    setVisible(false);
    Alert.alert(
      'Modo Chave Própria (BYOK)',
      'Você alternou para o modo de chave própria. Você pode configurar suas chaves gratuitas do Gemini, OpenAI ou Claude nas Configurações de IA.',
    );
  }, [isPro, setAiSettings, setVisible]);

  const handleManageInStore = useCallback(() => {
    setVisible(false);
    manageSubscription();
  }, [manageSubscription, setVisible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Overlay>
        <ModalContainer>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {isPro ? (
              <>
                <HeaderRow>
                  <TrialBadge style={{ backgroundColor: '#10b981' }}>
                    <TrialBadgeText style={{ color: '#fff' }}>
                      {t('settings.subscription.badgePro', { defaultValue: 'PRO ATIVO' })}
                    </TrialBadgeText>
                  </TrialBadge>
                  <CloseButton onPress={handleClose} activeOpacity={0.7}>
                    <CloseButtonText>✕</CloseButtonText>
                  </CloseButton>
                </HeaderRow>

                <Title>Tudú Pro ⚡</Title>
                <Subtitle style={{ marginBottom: 20 }}>
                  {t(
                    'settings.subscription.proActiveModalDesc',
                    { defaultValue: 'Sua assinatura Tudú Pro está ativa na loja com todos os recursos inteligentes liberados!' }
                  )}
                </Subtitle>

                <PrimaryButton onPress={handleManageInStore}>
                  <PrimaryButtonText>
                    {t('settings.subscription.buttons.manage', {
                      defaultValue: 'Gerenciar Assinatura na Loja',
                    })}
                  </PrimaryButtonText>
                </PrimaryButton>

                <SecondaryActionsRow style={{ justifyContent: 'center', marginTop: 10 }}>
                  <LinkButton onPress={handleClose}>
                    <LinkButtonText>{t('common.close', { defaultValue: 'Fechar' })}</LinkButtonText>
                  </LinkButton>
                </SecondaryActionsRow>
              </>
            ) : (
              <>
                <HeaderRow>
                  <TrialBadge>
                    <TrialBadgeText>
                      {t('settings.subscription.reminder.badge', { defaultValue: '7 Dias Grátis' })}
                    </TrialBadgeText>
                  </TrialBadge>
                  <CloseButton onPress={handleClose} activeOpacity={0.7}>
                    <CloseButtonText>✕</CloseButtonText>
                  </CloseButton>
                </HeaderRow>

                <Title>Tudú Pro ⚡</Title>
                <PriceRow>
                  <PriceHighlight>
                    {priceFormatted || t('subscription.viewInStore', { defaultValue: '7 Dias Grátis' })}
                  </PriceHighlight>
                  <PriceSubtext>
                    {t('settings.subscription.priceSubtext', {
                      defaultValue: 'após a 1ª semana grátis',
                    })}
                  </PriceSubtext>
                </PriceRow>
                <Subtitle>
                  {t('settings.subscription.reminder.subtitle', {
                    defaultValue: 'Aproveite todos os recursos inteligentes e salve seus dados na nuvem com total segurança. Cancele quando quiser.',
                  })}
                </Subtitle>

                <FeaturesList>
                  <FeatureItem>
                    <FeatureIconBox>
                      <FeatureIconText>🧠</FeatureIconText>
                    </FeatureIconBox>
                    <FeatureTextContainer>
                      <FeatureTitle>
                        {t('settings.subscription.benefits.aiTitle', { defaultValue: 'IA Nativa Integrada' })}
                      </FeatureTitle>
                      <FeatureDescription>
                        {t('settings.subscription.benefits.aiDesc', { defaultValue: 'Sugestão de emojis, desdobramento de tarefas e importação de listas sem precisar de chaves.' })}
                      </FeatureDescription>
                    </FeatureTextContainer>
                  </FeatureItem>

                  <FeatureItem>
                    <FeatureIconBox>
                      <FeatureIconText>☁️</FeatureIconText>
                    </FeatureIconBox>
                    <FeatureTextContainer>
                      <FeatureTitle>
                        {t('settings.subscription.benefits.syncTitle', { defaultValue: 'Sincronização em Nuvem' })}
                      </FeatureTitle>
                      <FeatureDescription>
                        {t('settings.subscription.benefits.syncDesc', { defaultValue: 'Seus dados e listas sincronizados e salvos com segurança no banco de dados.' })}
                      </FeatureDescription>
                    </FeatureTextContainer>
                  </FeatureItem>

                  <FeatureItem>
                    <FeatureIconBox>
                      <FeatureIconText>📱</FeatureIconText>
                    </FeatureIconBox>
                    <FeatureTextContainer>
                      <FeatureTitle>
                        {t('settings.subscription.benefits.backupTitle', { defaultValue: 'Backup e Multi-Dispositivo' })}
                      </FeatureTitle>
                      <FeatureDescription>
                        {t('settings.subscription.benefits.backupDesc', { defaultValue: 'Acesse suas anotações e restaure seus dados em qualquer aparelho a qualquer momento.' })}
                      </FeatureDescription>
                    </FeatureTextContainer>
                  </FeatureItem>
                </FeaturesList>

                <PrimaryButton onPress={handlePurchase}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <PrimaryButtonText>
                      {t('settings.subscription.buttons.startTrial', { defaultValue: 'Experimentar 7 Dias Grátis' })}
                    </PrimaryButtonText>
                  )}
                </PrimaryButton>

                <SecondaryActionsRow>
                  <LinkButton onPress={handleRestore}>
                    <LinkButtonText>
                      {t('settings.subscription.buttons.restore', { defaultValue: 'Restaurar Compras' })}
                    </LinkButtonText>
                  </LinkButton>
                  <LinkButton onPress={handleClose}>
                    <LinkButtonText>
                      {t('settings.subscription.reminder.dismissButton', { defaultValue: 'Agora Não' })}
                    </LinkButtonText>
                  </LinkButton>
                </SecondaryActionsRow>

                {!isPro && (
                  <ByokButton onPress={handleUseOwnKey}>
                    <ByokButtonText>
                      {t('settings.subscription.byokButton', { defaultValue: 'Prefiro usar minha chave própria (Gratuito)' })}
                    </ByokButtonText>
                  </ByokButton>
                )}
              </>
            )}
          </ScrollView>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};
