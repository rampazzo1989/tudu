import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '../../../components/animated-icons/star-icon';
import { DefaultHeader } from '../../../components/default-header';
import { Page } from '../../../components/page';
import { PageContent } from '../../../components/page-content';
import { useSubscription } from '../../../service/subscription/useSubscription';
import { SyncEngine } from '../../../service/sync/sync-engine';
import { SubscriptionSettingsProps } from './types';
import {
  BenefitCard,
  BenefitDescription,
  BenefitIconBox,
  BenefitIconText,
  BenefitsList,
  BenefitTextContainer,
  BenefitTitle,
  Container,
  DevActionButton,
  DevActionButtonText,
  DevButtonsRow,
  DevSandboxBadge,
  DevSandboxContainer,
  DevSandboxDescription,
  DevSandboxHeader,
  DevSandboxTitle,
  HeroBadge,
  HeroBadgeText,
  HeroCard,
  HeroHeaderRow,
  HeroSubtitle,
  HeroTitle,
  PriceRow,
  PriceSubtext,
  PriceValue,
  PrimaryActionButton,
  PrimaryActionText,
  SecondaryActionButton,
  SecondaryActionText,
  SectionContainer,
  SectionTitleText,
  StatusDetailBox,
  StatusDetailText,
  TermsNote,
  scrollContentContainerStyle,
} from './styles';

export const SubscriptionSettingsPage: React.FC<SubscriptionSettingsProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    isPro,
    status,
    trialEndsAt,
    currentPeriodEndsAt,
    daysLeftInTrial,
    priceFormatted,
    purchasePro,
    restorePurchases,
    manageSubscription,
    // devSetStatus, // Comentado para testar sempre a assinatura real
  } = useSubscription();

  const [actionLoading, setActionLoading] = useState(false);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePurchase = useCallback(async () => {
    setActionLoading(true);
    try {
      const success = await purchasePro();
      if (success) {
        Alert.alert(
          '🎉 Bem-vindo ao Tudú Pro!',
          'Sua semana gratuita foi ativada com sucesso! A IA integrada e a sincronização em nuvem já estão prontas para você aproveitar.',
        );
        SyncEngine.uploadInitialSnapshot();
      }
    } catch (err: any) {
      if (!err?.userCancelled) {
        Alert.alert('Erro', err?.message || 'Não foi possível concluir a assinatura.');
      }
    } finally {
      setActionLoading(false);
    }
  }, [purchasePro]);

  const handleRestore = useCallback(async () => {
    setActionLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Sucesso', 'Assinatura restaurada com sucesso!');
        SyncEngine.uploadInitialSnapshot();
      } else {
        Alert.alert('Aviso', 'Nenhuma assinatura ativa encontrada para restaurar.');
      }
    } catch (err: any) {
      Alert.alert('Aviso', err?.message || 'Não foi possível restaurar compras.');
    } finally {
      setActionLoading(false);
    }
  }, [restorePurchases]);

  const formatDate = useCallback((dateStr: string | null) => {
    if (!dateStr) {
      return '';
    }
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }, []);

  const badgeType: 'active' | 'free' = isPro ? 'active' : 'free';

  const badgeText = useMemo(() => {
    if (isPro) {
      return t('settings.subscription.badgePro', { defaultValue: 'PRO ATIVO' });
    }
    return t('settings.subscription.badgeFree', { defaultValue: '7 DIAS GRÁTIS' });
  }, [isPro, t]);

  const statusDescription = useMemo(() => {
    if (isPro) {
      const renewDate = formatDate(currentPeriodEndsAt);
      return renewDate
        ? `Sua assinatura Tudú Pro está ativa na loja! Próxima renovação em ${renewDate}.`
        : 'Sua assinatura Tudú Pro está ativa com todos os recursos inteligentes liberados!';
    }
    return 'Assine para sincronizar suas listas na nuvem, criar tudús com IA sem precisar de chaves e fazer backup contínuo.';
  }, [isPro, currentPeriodEndsAt, formatDate]);

  const benefits = useMemo(
    () => [
      {
        icon: '🧠',
        title: t('settings.subscription.benefits.aiTitle', {
          defaultValue: 'IA Nativa Integrada',
        }),
        description: t('settings.subscription.benefits.aiDesc', {
          defaultValue:
            'Sugestões inteligentes de emojis, desdobramento automático de tarefas e importação de listas sem precisar de chave de API.',
        }),
      },
      {
        icon: '☁️',
        title: t('settings.subscription.benefits.syncTitle', {
          defaultValue: 'Sincronização em Nuvem em Tempo Real',
        }),
        description: t('settings.subscription.benefits.syncDesc', {
          defaultValue:
            'Todas as suas anotações, tarefas e contadores salvos instantaneamente e sincronizados no banco de dados.',
        }),
      },
      {
        icon: '📱',
        title: t('settings.subscription.benefits.backupTitle', {
          defaultValue: 'Backup e Multi-Dispositivo',
        }),
        description: t('settings.subscription.benefits.backupDesc', {
          defaultValue:
            'Restaure suas listas e contadores em qualquer aparelho a qualquer momento com total segurança.',
        }),
      },
      {
        icon: '⚡',
        title: t('settings.subscription.benefits.earlyTitle', {
          defaultValue: 'Acesso Antecipado a Recursos Pro',
        }),
        description: t('settings.subscription.benefits.earlyDesc', {
          defaultValue:
            'Receba primeiro todas as novas ferramentas inteligentes e melhorias do Tudú.',
        }),
      },
      {
        icon: '🔒',
        title: t('settings.subscription.benefits.privacyTitle', {
          defaultValue: 'Segurança & Privacidade Total',
        }),
        description: t('settings.subscription.benefits.privacyDesc', {
          defaultValue:
            'Seus dados são protegidos com criptografia de ponta e não são compartilhados com terceiros.',
        }),
      },
    ],
    [t],
  );

  return (
    <Page>
      <DefaultHeader
        Icon={StarIcon}
        title={t('settings.subscription.pageTitle', { defaultValue: 'Tudú Pro' })}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={scrollContentContainerStyle}>
        <Container>
          {/* Hero / Status Card */}
          <HeroCard isPro={isPro}>
            <HeroHeaderRow>
              <HeroBadge type={badgeType}>
                <HeroBadgeText type={badgeType}>{badgeText}</HeroBadgeText>
              </HeroBadge>
              <Text style={{ fontSize: 24 }}>⚡</Text>
            </HeroHeaderRow>

            <HeroTitle>Tudú Pro</HeroTitle>
            <HeroSubtitle>{statusDescription}</HeroSubtitle>

            {!isPro && (
              <PriceRow>
                <PriceValue>
                  {priceFormatted || t('subscription.viewInStore', { defaultValue: '7 Dias Grátis' })}
                </PriceValue>
                <PriceSubtext>
                  {priceFormatted
                    ? t('settings.subscription.priceSubtext', {
                        defaultValue: 'após a 1ª semana grátis',
                      })
                    : t('subscription.consultInStoreSubtext', {
                        defaultValue: 'Consulte o valor na confirmação do Google Play',
                      })}
                </PriceSubtext>
              </PriceRow>
            )}

            {isPro && (
              <StatusDetailBox>
                <Text style={{ fontSize: 16, marginRight: 8 }}>🛡️</Text>
                <StatusDetailText>
                  Assinatura gerenciada diretamente pelo Google Play. Cancele ou altere a qualquer momento na loja.
                </StatusDetailText>
              </StatusDetailBox>
            )}
          </HeroCard>

          {/* Benefits List */}
          <SectionContainer>
            <SectionTitleText>
              {t('settings.subscription.benefitsTitle', {
                defaultValue: 'Vantagens Exclusivas',
              })}
            </SectionTitleText>
            <BenefitsList>
              {benefits.map(b => (
                <BenefitCard key={b.title}>
                  <BenefitIconBox>
                    <BenefitIconText>{b.icon}</BenefitIconText>
                  </BenefitIconBox>
                  <BenefitTextContainer>
                    <BenefitTitle>{b.title}</BenefitTitle>
                    <BenefitDescription>{b.description}</BenefitDescription>
                  </BenefitTextContainer>
                </BenefitCard>
              ))}
            </BenefitsList>
          </SectionContainer>

          {/* Call to Action */}
          {!isPro ? (
            <PrimaryActionButton onPress={handlePurchase} disabled={actionLoading}>
              {actionLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <PrimaryActionText>
                  {t('settings.subscription.buttons.startTrial', {
                    defaultValue: 'Experimentar 7 Dias Grátis',
                  })}
                </PrimaryActionText>
              )}
            </PrimaryActionButton>
          ) : (
            <PrimaryActionButton onPress={manageSubscription}>
              <PrimaryActionText>
                {t('settings.subscription.buttons.manage', {
                  defaultValue: 'Gerenciar Assinatura na Loja',
                })}
              </PrimaryActionText>
            </PrimaryActionButton>
          )}

          {/* Secondary Action */}
          <SecondaryActionButton onPress={handleRestore} disabled={actionLoading}>
            <SecondaryActionText>
              {t('settings.subscription.buttons.restore', {
                defaultValue: 'Restaurar Compras',
              })}
            </SecondaryActionText>
          </SecondaryActionButton>

          {/* Terms info */}
          <TermsNote>
            {t('settings.subscription.termsNote', {
              defaultValue:
                'Assinatura renovada automaticamente a cada mês. Cancele quando quiser no Google Play sem nenhuma cobrança se cancelado antes do fim dos 7 dias.',
            })}
          </TermsNote>

          {/* [DEV ONLY] Controles de Teste / Sandbox comentado para testar sempre a assinatura real no emulador */}
          {/*
          {__DEV__ && (
            <DevSandboxContainer>
              <DevSandboxHeader>
                <DevSandboxTitle>🧪 Simulador de Assinatura (Sandbox Dev)</DevSandboxTitle>
                <DevSandboxBadge>TESTE</DevSandboxBadge>
              </DevSandboxHeader>
              <DevSandboxDescription>
                Simule os estados da assinatura gerenciada diretamente pela loja:
              </DevSandboxDescription>
              <DevButtonsRow>
                <DevActionButton
                  active={!isPro}
                  onPress={() => devSetStatus('FREE')}
                >
                  <DevActionButtonText active={!isPro}>
                    Gratuito (Inativo)
                  </DevActionButtonText>
                </DevActionButton>

                <DevActionButton
                  active={isPro}
                  onPress={() => devSetStatus('ACTIVE')}
                >
                  <DevActionButtonText active={isPro}>
                    ⭐ Assinatura Ativa (Pro)
                  </DevActionButtonText>
                </DevActionButton>
              </DevButtonsRow>
            </DevSandboxContainer>
          )}
          */}
        </Container>
      </PageContent>
    </Page>
  );
};
