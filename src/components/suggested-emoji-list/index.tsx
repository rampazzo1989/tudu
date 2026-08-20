import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { Container, Title, EmojiList, EmojiButton, EmojiText, RightFadingGradient } from './styles';
import { FadeIn } from 'react-native-reanimated';
import { ListDefaultIcon } from '../animated-icons/list-default-icon';
import { emojiUsageState } from '../../state/atoms';
import { useTheme } from 'styled-components/native';
import Skeleton from '../skeleton';

interface SuggestedEmojiListProps {
    emojis: string[];
    isShowingMostUsedEmojis: boolean;
    isAIGenerated?: boolean;
    onEmojiSelect: (emoji: string) => void;
    showDefaultIcon?: boolean;
    isLoading?: boolean;
}

const SuggestedEmojiList: React.FC<SuggestedEmojiListProps> = ({
    emojis,
    isShowingMostUsedEmojis,
    isAIGenerated = false,
    onEmojiSelect,
    showDefaultIcon = false,
    isLoading = false,
}) => {
    const { t } = useTranslation();
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [_, setEmojiUsage] = useRecoilState(emojiUsageState);
    const theme = useTheme();

    const handleEmojiPress = (emoji: string) => {
        var emojiIsAlreadySelected: boolean = false;
        setSelectedEmoji(current => {
            if (emoji === current) {
                emojiIsAlreadySelected = true;
            }
            return emoji;
        });
        onEmojiSelect(emoji);

        if (emoji !== '' && !emojiIsAlreadySelected) {
            setEmojiUsage((currentUsage) => {
                const newUsage = new Map(currentUsage);
                newUsage.set(emoji, (newUsage.get(emoji) || 0) + 1);
                return newUsage;
            });
        }
    };

    // Only display full skeleton loading if there are NO existing emojis on screen
    if (isLoading && emojis.length === 0) {
        return (
            <Container>
                <Title>{t('popupLabels.loading')}</Title>
                <EmojiList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                marginHorizontal: 4,
                                backgroundColor: '#585f69',
                            }}
                        />
                    ))}
                </EmojiList>
            </Container>
        );
    }

    const getTitle = () => {
        if (isShowingMostUsedEmojis) {
            return t('popupLabels.mostUsedEmojis');
        }
        if (isAIGenerated) {
            return `✨ ${t('popupLabels.suggestedEmojis')}`;
        }
        return t('popupLabels.suggestedEmojis');
    };

    return (
        <Container>
            <Title>{getTitle()}</Title>
            <EmojiList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {showDefaultIcon && (
                    <EmojiButton
                        key={'default'}
                        onPress={() => handleEmojiPress('')}
                        selected={selectedEmoji === ''}
                        entering={FadeIn}>
                        <ListDefaultIcon size={24} />
                    </EmojiButton>
                )}
                {emojis.map((emoji, index) => (
                    <EmojiButton
                        key={emoji}
                        onPress={() => handleEmojiPress(emoji)}
                        selected={selectedEmoji === emoji}
                        entering={FadeIn.delay(30 * (index + 1))}>
                        <EmojiText>{emoji}</EmojiText>
                    </EmojiButton>
                ))}
            </EmojiList>
            <RightFadingGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={theme.colors.suggestedEmoji.scrollFadeGradientColors}
                pointerEvents={'none'} />
        </Container>
    );
};

export default memo(SuggestedEmojiList);