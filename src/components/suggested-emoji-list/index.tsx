import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Title, EmojiList, EmojiButton, EmojiText } from './styles';

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
                keyboardShouldPersistTaps="handled"
            >
                {emojis.map((emoji) => (
                    <EmojiButton
                        key={emoji}
                        onPress={() => handleEmojiPress(emoji)}
                        selected={selectedEmoji === emoji}
                    >
                        <EmojiText>{emoji}</EmojiText>
                    </EmojiButton>
                ))}
            </EmojiList>
        </Container>
    );
};

export default memo(SuggestedEmojiList);