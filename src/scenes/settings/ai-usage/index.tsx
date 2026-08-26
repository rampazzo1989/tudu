import React, {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SettingsIcon} from '../../../components/animated-icons/settings-icon';
import {DefaultHeader} from '../../../components/default-header';
import {Page} from '../../../components/page';
import {PageContent} from '../../../components/page-content';
import {styles} from '../../home/styles';
import {AIProvider, UsagePeriod, useAITokenUsage} from '../../../service/ai';
import {
  BreakdownCard,
  BreakdownItem,
  BreakdownItemIcon,
  BreakdownItemLeft,
  BreakdownItemName,
  BreakdownItemRequests,
  BreakdownItemRight,
  BreakdownItemSub,
  BreakdownItemTextContainer,
  BreakdownItemTokens,
  BreakdownSeparator,
  Card,
  Container,
  DangerButton,
  DangerButtonText,
  EmptyStateCard,
  EmptyStateText,
  HeroBadge,
  HeroBadgeText,
  HeroBigValue,
  HeroCard,
  HeroCardTop,
  HeroLabel,
  HeroSubvalue,
  LastResetText,
  PeriodSelectorRow,
  PeriodTab,
  PeriodTabText,
  ResetCard,
  ResetCardDesc,
  ResetCardTitle,
  Section,
  SectionTitle,
  StatCard,
  StatCardDesc,
  StatCardHeader,
  StatCardIcon,
  StatCardTitle,
  StatCardValue,
  StatsGrid,
} from './styles';
import {AIUsagePageProps} from './types';

const PERIODS: UsagePeriod[] = ['week', 'month', 'total'];

const PROVIDER_METADATA: Record<
  AIProvider,
  {emoji: string; nameKey: string; defaultName: string}
> = {
  gemini: {
    emoji: '✨',
    nameKey: 'settings.ai.providers.gemini',
    defaultName: 'Google Gemini',
  },
  openai: {
    emoji: '🟢',
    nameKey: 'settings.ai.providers.openai',
    defaultName: 'OpenAI',
  },
  claude: {
    emoji: '🟠',
    nameKey: 'settings.ai.providers.claude',
    defaultName: 'Anthropic Claude',
  },
};

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } catch {
    return isoString;
  }
};

const AIUsagePage: React.FC<AIUsagePageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {getStats, lastResetAt, resetUsage} = useAITokenUsage();
  const [selectedPeriod, setSelectedPeriod] = useState<UsagePeriod>('month');

  const stats = useMemo(
    () => getStats(selectedPeriod),
    [getStats, selectedPeriod],
  );

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleReset = useCallback(() => {
    Alert.alert(
      t('settings.ai.usage.confirmResetTitle'),
      t('settings.ai.usage.confirmResetMessage'),
      [
        {text: t('buttons.cancel'), style: 'cancel'},
        {
          text: t('settings.ai.usage.resetButton'),
          style: 'destructive',
          onPress: () => {
            resetUsage();
          },
        },
      ],
    );
  }, [resetUsage, t]);

  const hasUsage = stats.totalTokens > 0 || stats.totalRequests > 0;

  return (
    <Page>
      <DefaultHeader
        Icon={SettingsIcon}
        title={t('settings.ai.usage.title')}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled">
        <Container>
          {/* Period Selector Tabs */}
          <PeriodSelectorRow>
            {PERIODS.map(period => {
              const isActive = selectedPeriod === period;
              return (
                <PeriodTab
                  key={period}
                  isActive={isActive}
                  onPress={() => setSelectedPeriod(period)}>
                  <PeriodTabText isActive={isActive}>
                    {t(`settings.ai.usage.periods.${period}`)}
                  </PeriodTabText>
                </PeriodTab>
              );
            })}
          </PeriodSelectorRow>

          {/* Hero Card */}
          <HeroCard>
            <HeroCardTop>
              <HeroLabel>{t('settings.ai.usage.heroTokens')}</HeroLabel>
              <HeroBadge>
                <HeroBadgeText>
                  {t(`settings.ai.usage.periods.${selectedPeriod}`)}
                </HeroBadgeText>
              </HeroBadge>
            </HeroCardTop>
            <HeroBigValue>{formatNumber(stats.totalTokens)}</HeroBigValue>
            <HeroSubvalue>
              {stats.totalRequests === 1
                ? t('settings.ai.usage.heroRequests_one', {
                    count: stats.totalRequests,
                  })
                : t('settings.ai.usage.heroRequests_other', {
                    count: stats.totalRequests,
                  })}
            </HeroSubvalue>
          </HeroCard>

          {/* Prompt vs Completion Grid */}
          <StatsGrid>
            <StatCard>
              <StatCardHeader>
                <StatCardIcon>📥</StatCardIcon>
                <StatCardTitle>
                  {t('settings.ai.usage.promptTokens')}
                </StatCardTitle>
              </StatCardHeader>
              <StatCardValue>{formatNumber(stats.promptTokens)}</StatCardValue>
              <StatCardDesc>
                {t('settings.ai.usage.promptDescription')}
              </StatCardDesc>
            </StatCard>

            <StatCard>
              <StatCardHeader>
                <StatCardIcon>📤</StatCardIcon>
                <StatCardTitle>
                  {t('settings.ai.usage.completionTokens')}
                </StatCardTitle>
              </StatCardHeader>
              <StatCardValue>
                {formatNumber(stats.completionTokens)}
              </StatCardValue>
              <StatCardDesc>
                {t('settings.ai.usage.completionDescription')}
              </StatCardDesc>
            </StatCard>
          </StatsGrid>

          {/* Providers Breakdown */}
          <Section>
            <SectionTitle>
              {t('settings.ai.usage.breakdownByProvider')}
            </SectionTitle>
            <Card>
              {(['gemini', 'openai', 'claude'] as AIProvider[]).map(
                (provider, index) => {
                  const meta = PROVIDER_METADATA[provider];
                  const providerStats = stats.byProvider[provider];
                  const name = t(meta.nameKey, {defaultValue: meta.defaultName});
                  const isLast = index === 2;

                  return (
                    <React.Fragment key={provider}>
                      <BreakdownItem>
                        <BreakdownItemLeft>
                          <BreakdownItemIcon>{meta.emoji}</BreakdownItemIcon>
                          <BreakdownItemTextContainer>
                            <BreakdownItemName>{name}</BreakdownItemName>
                            <BreakdownItemSub>
                              {providerStats.requests === 1
                                ? t('settings.ai.usage.heroRequests_one', {
                                    count: providerStats.requests,
                                  })
                                : t('settings.ai.usage.heroRequests_other', {
                                    count: providerStats.requests,
                                  })}
                            </BreakdownItemSub>
                          </BreakdownItemTextContainer>
                        </BreakdownItemLeft>
                        <BreakdownItemRight>
                          <BreakdownItemTokens>
                            {formatNumber(providerStats.totalTokens)}
                          </BreakdownItemTokens>
                          <BreakdownItemRequests>tokens</BreakdownItemRequests>
                        </BreakdownItemRight>
                      </BreakdownItem>
                      {!isLast && <BreakdownSeparator />}
                    </React.Fragment>
                  );
                },
              )}
            </Card>
          </Section>

          {/* Features Breakdown */}
          <Section>
            <SectionTitle>
              {t('settings.ai.usage.breakdownByFeature')}
            </SectionTitle>
            <Card>
              {/* Task Suggestions */}
              <BreakdownItem>
                <BreakdownItemLeft>
                  <BreakdownItemIcon>💡</BreakdownItemIcon>
                  <BreakdownItemTextContainer>
                    <BreakdownItemName>
                      {t('settings.ai.usage.features.task_suggestions')}
                    </BreakdownItemName>
                    <BreakdownItemSub>
                      {stats.byFeature.task_suggestions.requests === 1
                        ? t('settings.ai.usage.heroRequests_one', {
                            count: stats.byFeature.task_suggestions.requests,
                          })
                        : t('settings.ai.usage.heroRequests_other', {
                            count: stats.byFeature.task_suggestions.requests,
                          })}
                    </BreakdownItemSub>
                  </BreakdownItemTextContainer>
                </BreakdownItemLeft>
                <BreakdownItemRight>
                  <BreakdownItemTokens>
                    {formatNumber(stats.byFeature.task_suggestions.totalTokens)}
                  </BreakdownItemTokens>
                  <BreakdownItemRequests>tokens</BreakdownItemRequests>
                </BreakdownItemRight>
              </BreakdownItem>

              <BreakdownSeparator />

              {/* List from Text (Parse List) */}
              <BreakdownItem>
                <BreakdownItemLeft>
                  <BreakdownItemIcon>📋</BreakdownItemIcon>
                  <BreakdownItemTextContainer>
                    <BreakdownItemName>
                      {t('settings.ai.usage.features.parse_list')}
                    </BreakdownItemName>
                    <BreakdownItemSub>
                      {stats.byFeature.parse_list.requests === 1
                        ? t('settings.ai.usage.heroRequests_one', {
                            count: stats.byFeature.parse_list.requests,
                          })
                        : t('settings.ai.usage.heroRequests_other', {
                            count: stats.byFeature.parse_list.requests,
                          })}
                    </BreakdownItemSub>
                  </BreakdownItemTextContainer>
                </BreakdownItemLeft>
                <BreakdownItemRight>
                  <BreakdownItemTokens>
                    {formatNumber(stats.byFeature.parse_list.totalTokens)}
                  </BreakdownItemTokens>
                  <BreakdownItemRequests>tokens</BreakdownItemRequests>
                </BreakdownItemRight>
              </BreakdownItem>

              <BreakdownSeparator />

              {/* Emoji Suggestions */}
              <BreakdownItem>
                <BreakdownItemLeft>
                  <BreakdownItemIcon>😊</BreakdownItemIcon>
                  <BreakdownItemTextContainer>
                    <BreakdownItemName>
                      {t('settings.ai.usage.features.emoji')}
                    </BreakdownItemName>
                    <BreakdownItemSub>
                      {stats.byFeature.emoji.requests === 1
                        ? t('settings.ai.usage.heroRequests_one', {
                            count: stats.byFeature.emoji.requests,
                          })
                        : t('settings.ai.usage.heroRequests_other', {
                            count: stats.byFeature.emoji.requests,
                          })}
                    </BreakdownItemSub>
                  </BreakdownItemTextContainer>
                </BreakdownItemLeft>
                <BreakdownItemRight>
                  <BreakdownItemTokens>
                    {formatNumber(stats.byFeature.emoji.totalTokens)}
                  </BreakdownItemTokens>
                  <BreakdownItemRequests>tokens</BreakdownItemRequests>
                </BreakdownItemRight>
              </BreakdownItem>

              {stats.byFeature.test.requests > 0 && (
                <>
                  <BreakdownSeparator />
                  <BreakdownItem>
                    <BreakdownItemLeft>
                      <BreakdownItemIcon>🧪</BreakdownItemIcon>
                      <BreakdownItemTextContainer>
                        <BreakdownItemName>
                          {t('settings.ai.usage.features.test')}
                        </BreakdownItemName>
                        <BreakdownItemSub>
                          {stats.byFeature.test.requests === 1
                            ? t('settings.ai.usage.heroRequests_one', {
                                count: stats.byFeature.test.requests,
                              })
                            : t('settings.ai.usage.heroRequests_other', {
                                count: stats.byFeature.test.requests,
                              })}
                        </BreakdownItemSub>
                      </BreakdownItemTextContainer>
                    </BreakdownItemLeft>
                    <BreakdownItemRight>
                      <BreakdownItemTokens>
                        {formatNumber(stats.byFeature.test.totalTokens)}
                      </BreakdownItemTokens>
                      <BreakdownItemRequests>tokens</BreakdownItemRequests>
                    </BreakdownItemRight>
                  </BreakdownItem>
                </>
              )}
            </Card>
          </Section>

          {/* Reset Counter Section */}
          <Section>
            <ResetCard>
              <ResetCardTitle>
                {t('settings.ai.usage.resetTitle')}
              </ResetCardTitle>
              <ResetCardDesc>
                {t('settings.ai.usage.resetDescription')}
              </ResetCardDesc>

              <DangerButton onPress={handleReset}>
                <DangerButtonText>
                  {t('settings.ai.usage.resetButton')}
                </DangerButtonText>
              </DangerButton>

              <LastResetText>
                {lastResetAt
                  ? t('settings.ai.usage.lastResetAt', {
                      date: formatDate(lastResetAt),
                    })
                  : t('settings.ai.usage.neverReset')}
              </LastResetText>
            </ResetCard>
          </Section>
        </Container>
      </PageContent>
    </Page>
  );
};

export {AIUsagePage};
