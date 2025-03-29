import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Title, EmojiList, EmojiButton, EmojiText } from './styles';
import { FadeIn } from 'react-native-reanimated';
import { ListDefaultIcon } from '../animated-icons/list-default-icon';

interface SuggestedEmojiListProps {
    emojis: string[];
    onEmojiSelect: (emoji: string) => void;
}

const SuggestedEmojiList: React.FC<SuggestedEmojiListProps> = ({ emojis, onEmojiSelect }) => {
    const { t } = useTranslation();
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const handleEmojiPress = (emoji: string) => {
        setSelectedEmoji(emoji);
        onEmojiSelect(emoji);
    };

    return (
        <Container>
            <Title>{t('popupLabels.suggestedEmojis')}</Title>
                <EmojiList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <EmojiButton
                        key={'default'}
                        onPress={() => handleEmojiPress('')}
                        selected={selectedEmoji === ''}
                        entering={FadeIn}>
                        <ListDefaultIcon size={24} />
                </EmojiButton>
                {emojis.map((emoji, index) => (
                    <EmojiButton
                        key={emoji}
                        onPress={() => handleEmojiPress(emoji)}
                        selected={selectedEmoji === emoji}
                        entering={FadeIn.delay(50 * (index + 1))}
                    >
                        <EmojiText>{emoji}</EmojiText>
                    </EmojiButton>
                ))}
            </EmojiList>
        </Container>
    );
};

export default memo(SuggestedEmojiList);