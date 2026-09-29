import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Switch,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FadeIn} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {SettingsIcon} from '../../../components/animated-icons/settings-icon';
import {DefaultHeader} from '../../../components/default-header';
import {Page} from '../../../components/page';
import {PageContent} from '../../../components/page-content';
import {styles} from '../../home/styles';
import {
  AIProvider,
  getSecureApiKey,
  hasSecureApiKey,
  maskApiKey,
  testAIConnection,
  useAISettings,
  useAITokenUsage,
} from '../../../service/ai';
import {
  ButtonRow,
  Card,
  Container,
  DangerButton,
  DangerButtonText,
  HelpLink,
  HelpLinkText,
  IconButton,
  InputWrapper,
  ModeCard,
  ModeContainer,
  ModeHeaderRow,
  ModeSubtitle,
  ModeTitle,
  PrimaryButton,
  PrimaryButtonText,
  ProStatusBadge,
  ProStatusText,
  ProviderEmoji,
  ProviderName,
  ProviderOption,
  ProvidersRow,
  SecondaryButton,
  SecondaryButtonText,
  Section,
  SectionTitle,
  SecurityBadge,
  SecurityText,
  StatusFeedback,
  StatusFeedbackText,
  StyledTextInput,
  ToggleCard,
  ToggleDescription,
  ToggleTextContainer,
  ToggleTitle,
  UsageCard,
  UsageCardLeftContent,
  UsageChevron,
  UsageIconContainer,
  UsageSubtitle,
  UsageTextContainer,
  UsageTitle,
} from './styles';
import {AISettingsPageProps} from './types';
import {useSubscription} from '../../../service/subscription';


const PROVIDERS: {
  id: AIProvider;
  emoji: string;
  name: string;
  url: string;
}[] = [
  {
    id: 'gemini',
    emoji: '✨',
    name: 'Gemini',
    url: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'openai',
    emoji: '🟢',
    name: 'OpenAI',
    url: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'claude',
    emoji: '🟠',
    name: 'Claude',
    url: 'https://console.anthropic.com/settings/keys',
  },
];

const AISettingsPage: React.FC<AISettingsPageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    settings,
    setAIMode,
    setProvider,
    saveApiKey,
    removeApiKey,
    toggleEmojiSuggestions,
  } = useAISettings();

  const {
    isPro,
    status: subscriptionStatus,
    openPaywall,
    priceFormatted,
  } = useSubscription();

  const {monthlyStats} = useAITokenUsage();

  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(
    settings.provider,
  );
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Sync state when provider changes
  useEffect(() => {
    const savedKey = getSecureApiKey(selectedProvider);
    if (savedKey) {
      setApiKeyInput(savedKey);
    } else {
      setApiKeyInput('');
    }
    setTestResult(null);
  }, [selectedProvider]);

  // Ensure Pro subscribers are always on managed mode (Tudú Cloud AI)
  useEffect(() => {
    if (isPro && settings.mode !== 'managed') {
      setAIMode('managed');
    }
  }, [isPro, settings.mode, setAIMode]);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUsagePress = useCallback(() => {
    if (isPro) return;
    navigation.navigate('AIUsage');
  }, [isPro, navigation]);

  const handleSelectMode = useCallback(
    (mode: 'managed' | 'byok') => {
      if (isPro) {
        return;
      }
      if (mode === 'managed' && !isPro) {
        openPaywall();
        return;
      }
      setAIMode(mode);
    },
    [isPro, openPaywall, setAIMode],
  );

  const handleSubscriptionAction = useCallback(() => {
    if (isPro) {
      navigation.navigate('SubscriptionSettings');
    } else {
      openPaywall();
    }
  }, [isPro, navigation, openPaywall]);

  const handleSelectProvider = useCallback(
    (provider: AIProvider) => {
      setSelectedProvider(provider);
      setProvider(provider);
    },
    [setProvider],
  );

  const handleSaveKey = useCallback(() => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      Alert.alert(t('buttons.cancel'), t('settings.ai.apiKeyPlaceholder'));
      return;
    }

    saveApiKey(selectedProvider, trimmed);
    setTestResult({
      success: true,
      message: t('settings.ai.keySaved'),
    });
  }, [apiKeyInput, saveApiKey, selectedProvider, t]);

  const handleRemoveKey = useCallback(() => {
    Alert.alert(
      t('settings.ai.removeKey'),
      t('settings.ai.confirmRemoveKey'),
      [
        {text: t('buttons.cancel'), style: 'cancel'},
        {
          text: t('actions.delete'),
          style: 'destructive',
          onPress: () => {
            removeApiKey(selectedProvider);
            setApiKeyInput('');
            setTestResult({
              success: false,
              message: t('settings.ai.keyRemoved'),
            });
          },
        },
      ],
    );
  }, [removeApiKey, selectedProvider, t]);

  const handleTestConnection = useCallback(async () => {
    const keyToTest = apiKeyInput.trim() || getSecureApiKey(selectedProvider);
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: t('settings.ai.apiKeyPlaceholder'),
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      await testAIConnection(selectedProvider, keyToTest);
      setTestResult({
        success: true,
        message: t('settings.ai.connectionSuccess'),
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || t('settings.ai.connectionError', {error: 'Desconhecido'});
      setTestResult({
        success: false,
        message: t('settings.ai.connectionError', {error: errorMessage}),
      });
    } finally {
      setIsTesting(false);
    }
  }, [apiKeyInput, selectedProvider, t]);

  const currentProviderConfig = PROVIDERS.find(p => p.id === selectedProvider);
  const isKeyConfigured = hasSecureApiKey(selectedProvider);
  const isManaged = isPro || settings.mode === 'managed';

  return (
    <Page>
      <DefaultHeader
        Icon={SettingsIcon}
        title={t('settings.ai.title')}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <Container>
          {/* AI Mode Selection */}
          <Section>
            <SectionTitle>{t('settings.ai.modeTitle', 'Modo de Inteligência Artificial')}</SectionTitle>
            <ModeContainer>
              <ModeCard
                isSelected={isManaged}
                disabled={isPro}
                onPress={() => handleSelectMode('managed')}>
                <ModeHeaderRow>
                  <ModeTitle isSelected={isManaged}>
                    ✨ Tudú Cloud AI
                  </ModeTitle>
                  <ProStatusBadge isPro={isPro}>
                    <ProStatusText>
                      {isPro
                        ? subscriptionStatus === 'TRIALING'
                          ? 'Teste Grátis'
                          : 'Pro Ativo'
                        : 'Tudú Pro'}
                    </ProStatusText>
                  </ProStatusBadge>
                </ModeHeaderRow>
                <ModeSubtitle>
                  {t(
                    'settings.ai.managedModeDescription',
                    'IA integrada pronta para uso, sem necessidade de chaves de API. Backup e sincronização em nuvem inclusos.',
                  )}
                </ModeSubtitle>
              </ModeCard>

              {!isPro && (
                <ModeCard
                  isSelected={!isManaged}
                  onPress={() => handleSelectMode('byok')}>
                  <ModeHeaderRow>
                    <ModeTitle isSelected={!isManaged}>
                      🔑 Traga sua Chave (BYOK)
                    </ModeTitle>
                    <ProStatusBadge isPro={false}>
                      <ProStatusText>Grátis</ProStatusText>
                    </ProStatusBadge>
                  </ModeHeaderRow>
                  <ModeSubtitle>
                    {t(
                      'settings.ai.byokModeDescription',
                      'Use sua própria chave de API gratuita ou paga (Gemini, OpenAI ou Claude).',
                    )}
                  </ModeSubtitle>
                </ModeCard>
              )}
            </ModeContainer>
          </Section>

          {/* Managed Mode Status Card */}
          {isManaged ? (
            <Section>
              <SectionTitle>{t('settings.ai.managedStatusTitle', 'Status da Assinatura')}</SectionTitle>
              <Card>
                <ModeTitle style={{marginBottom: 6}}>
                  {isPro ? '✨ Tudú Pro Ativo' : '🔒 Desbloqueie o Tudú Pro'}
                </ModeTitle>
                <ModeSubtitle style={{marginBottom: 16}}>
                  {isPro
                    ? 'Sua assinatura inclui acesso completo à IA em nuvem (DeepSeek & OpenAI), sincronização automática e backup seguro dos seus dados.'
                    : priceFormatted
                      ? `Assine por ${priceFormatted} com 7 dias grátis para usar IA sem chave de API e manter seus dados salvos na nuvem.`
                      : 'Experimente 7 dias grátis para usar IA sem chave de API e manter seus dados salvos na nuvem.'}
                </ModeSubtitle>
                <PrimaryButton onPress={handleSubscriptionAction}>
                  <PrimaryButtonText>
                    {isPro ? 'Gerenciar Assinatura' : 'Experimentar 7 Dias Grátis'}
                  </PrimaryButtonText>
                </PrimaryButton>
              </Card>
            </Section>
          ) : (
            <>
              {/* Provider Selection */}
              <Section>
                <SectionTitle>{t('settings.ai.selectProvider')}</SectionTitle>
                <ProvidersRow>
                  {PROVIDERS.map(p => {
                    const isSelected = selectedProvider === p.id;
                    return (
                      <ProviderOption
                        key={p.id}
                        isSelected={isSelected}
                        onPress={() => handleSelectProvider(p.id)}>
                        <ProviderEmoji>{p.emoji}</ProviderEmoji>
                        <ProviderName isSelected={isSelected}>
                          {p.name}
                        </ProviderName>
                      </ProviderOption>
                    );
                  })}
                </ProvidersRow>
              </Section>

              {/* API Key Input & Config */}
              <Section>
                <SectionTitle>{t('settings.ai.apiKeyLabel')}</SectionTitle>
                <Card>
                  <InputWrapper>
                    <StyledTextInput
                      value={apiKeyInput}
                      onChangeText={(text: string) => {
                        setApiKeyInput(text);
                        setTestResult(null);
                      }}
                      placeholder={t('settings.ai.apiKeyPlaceholder')}
                      placeholderTextColor="#7E8895"
                      secureTextEntry={!showKey}
                      autoCapitalize="none"
                      autoCorrect={false}
                      multiline={false}
                      numberOfLines={1}
                    />
                    <IconButton onPress={() => setShowKey(!showKey)}>
                      <Text style={{fontSize: 16}}>
                        {showKey ? '👁️' : '🔒'}
                      </Text>
                    </IconButton>
                  </InputWrapper>

                  {currentProviderConfig && (
                    <HelpLink
                      onPress={() => Linking.openURL(currentProviderConfig.url)}>
                      <HelpLinkText>
                        {t('settings.ai.getApiKey')} ({currentProviderConfig.name}) ↗
                      </HelpLinkText>
                    </HelpLink>
                  )}

                  <SecurityBadge>
                    <Text style={{fontSize: 16}}>🛡️</Text>
                    <SecurityText>
                      {t('settings.ai.securityNotice')}
                    </SecurityText>
                  </SecurityBadge>

                  {testResult && (
                    <StatusFeedback isSuccess={testResult.success}>
                      <StatusFeedbackText isSuccess={testResult.success}>
                        {testResult.message}
                      </StatusFeedbackText>
                    </StatusFeedback>
                  )}

                  <ButtonRow>
                    <PrimaryButton onPress={handleSaveKey}>
                      <PrimaryButtonText>
                        {t('settings.ai.saveKey')}
                      </PrimaryButtonText>
                    </PrimaryButton>

                    <SecondaryButton
                      onPress={handleTestConnection}
                      disabled={isTesting}>
                      {isTesting ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.contrastColor}
                        />
                      ) : (
                        <SecondaryButtonText>
                          {t('settings.ai.testConnection')}
                        </SecondaryButtonText>
                      )}
                    </SecondaryButton>

                    {isKeyConfigured && (
                      <DangerButton onPress={handleRemoveKey}>
                        <DangerButtonText>
                          {t('settings.ai.removeKey')}
                        </DangerButtonText>
                      </DangerButton>
                    )}
                  </ButtonRow>
                </Card>
              </Section>
            </>
          )}

          {/* AI Emoji Suggestions Toggle */}
          <Section>
            <SectionTitle>Recursos de IA</SectionTitle>
            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>
                  {t('settings.ai.emojiSuggestions')}
                </ToggleTitle>
                <ToggleDescription>
                  {t('settings.ai.emojiSuggestionsDescription')}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={
                  isManaged
                    ? (settings.aiEmojiSuggestionsManuallySet !== undefined
                        ? settings.aiEmojiSuggestionsEnabled
                        : true) && isPro
                    : (settings.aiEmojiSuggestionsManuallySet !== undefined
                        ? settings.aiEmojiSuggestionsEnabled
                        : true) && isKeyConfigured
                }
                disabled={
                  isManaged
                    ? !isPro
                    : !isKeyConfigured && !apiKeyInput.trim()
                }
                onValueChange={toggleEmojiSuggestions}
                trackColor={{
                  false: '#3C414A',
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>
          </Section>

          {/* AI Token Usage Summary Card (BYOK only) */}
          {!isPro && !isManaged && (
            <Section>
              <SectionTitle>{t('settings.ai.usage.title')}</SectionTitle>
              <UsageCard onPress={handleUsagePress}>
                <UsageCardLeftContent>
                  <UsageIconContainer>
                    <Text style={{fontSize: 20}}>📊</Text>
                  </UsageIconContainer>
                  <UsageTextContainer>
                    <UsageTitle>{t('settings.ai.usage.cardTitle')}</UsageTitle>
                    <UsageSubtitle>
                      {monthlyStats.totalTokens > 0
                        ? t('settings.ai.usage.cardSubtitle', {
                            tokens: monthlyStats.totalTokens.toLocaleString(),
                          })
                        : t('settings.ai.usage.cardSubtitleEmpty')}
                    </UsageSubtitle>
                  </UsageTextContainer>
                </UsageCardLeftContent>
                <UsageChevron>›</UsageChevron>
              </UsageCard>
            </Section>
          )}
        </Container>
      </PageContent>
    </Page>
  );
};

export {AISettingsPage};

