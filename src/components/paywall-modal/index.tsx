import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text } from 'react-native';
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
  const { purchasePro, restorePurchases, priceFormatted } = useSubscription();
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
        Alert.alert('Sucesso', 'Assinatura restaurada com sucesso!');
        SyncEngine.uploadInitialSnapshot();
        setVisible(false);
      }
    } catch (err: any) {
      Alert.alert('Aviso', err?.message || 'Nenhuma assinatura ativa encontrada.');
    } finally {
      setLoading(false);
    }
  }, [restorePurchases, setVisible]);

  const handleUseOwnKey = useCallback(() => {
    setAiSettings(prev => ({
      ...prev,
      mode: 'byok',
    }));
    setVisible(false);
    Alert.alert(
      'Modo Chave Própria (BYOK)',
      'Você alternou para o modo de chave própria. Você pode configurar suas chaves gratuitas do Gemini, OpenAI ou Claude nas Configurações de IA.',
    );
  }, [setAiSettings, setVisible]);

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
          <HeaderRow>
            <TrialBadge>
              <TrialBadgeText>7 Dias Grátis</TrialBadgeText>
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
              {priceFormatted
                ? t('settings.subscription.reminder.priceSubtext', {
                    defaultValue: '/ mês após a 1ª semana grátis',
                  })
                : t('subscription.consultInStoreSubtext', {
                    defaultValue: 'Consulte o valor na confirmação do Google Play',
                  })}
            </PriceSubtext>
          </PriceRow>
          <Subtitle>
            Aproveite todos os recursos inteligentes e salve seus dados na nuvem com total segurança. Cancele quando quiser.
          </Subtitle>

          <FeaturesList>
            <FeatureItem>
              <FeatureIconBox>
                <FeatureIconText>🧠</FeatureIconText>
              </FeatureIconBox>
              <FeatureTextContainer>
                <FeatureTitle>IA Nativa Integrada</FeatureTitle>
                <FeatureDescription>
                  Sugestão de emojis, desdobramento de tarefas e importação de listas sem precisar de chaves.
                </FeatureDescription>
              </FeatureTextContainer>
            </FeatureItem>

            <FeatureItem>
              <FeatureIconBox>
                <FeatureIconText>☁️</FeatureIconText>
              </FeatureIconBox>
              <FeatureTextContainer>
                <FeatureTitle>Sincronização em Nuvem</FeatureTitle>
                <FeatureDescription>
                  Seus dados e listas sincronizados e salvos com segurança no banco de dados.
                </FeatureDescription>
              </FeatureTextContainer>
            </FeatureItem>

            <FeatureItem>
              <FeatureIconBox>
                <FeatureIconText>📱</FeatureIconText>
              </FeatureIconBox>
              <FeatureTextContainer>
                <FeatureTitle>Backup e Multi-Dispositivo</FeatureTitle>
                <FeatureDescription>
                  Acesse suas anotações e restaure seus dados em qualquer aparelho a qualquer momento.
                </FeatureDescription>
              </FeatureTextContainer>
            </FeatureItem>
          </FeaturesList>

          <PrimaryButton onPress={handlePurchase}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <PrimaryButtonText>Experimentar 7 Dias Grátis</PrimaryButtonText>
            )}
          </PrimaryButton>

          <SecondaryActionsRow>
            <LinkButton onPress={handleRestore}>
              <LinkButtonText>Restaurar Compras</LinkButtonText>
            </LinkButton>
            <LinkButton onPress={handleClose}>
              <LinkButtonText>Agora Não</LinkButtonText>
            </LinkButton>
          </SecondaryActionsRow>

          <ByokButton onPress={handleUseOwnKey}>
            <ByokButtonText>Prefiro usar minha chave própria (Gratuito)</ByokButtonText>
          </ByokButton>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};
