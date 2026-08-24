import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { toastSpan } from '../../state/atoms';
import { useOneTimeAnimationControl } from '../../hooks/useOneTimeAnimationControl';
import { PopoverMenu } from '../popover-menu';
import { MenuOptions } from '../menu-options';
import { MenuOption } from '../menu-options/types';
import { OptionsThreeDotsIcon } from '../animated-icons/options-arrow-down-icon';
import { AnimatedIconRef } from '../animated-icons/animated-icon/types';
import { ShareIcon } from '../animated-icons/share-icon';
import { CopyIcon } from '../animated-icons/copy-icon';
import {
  IconWrapper,
  OptionsButton,
  OptionsButtonContainer,
} from './styles';
import { ListOptionsButtonProps } from './types';

const ListOptionsButton: React.FC<ListOptionsButtonProps> = memo(
  ({ onShareTextPress, onShareFilePress, onSharePress }) => {
    const { t } = useTranslation();
    const iconRef = useRef<AnimatedIconRef>(null);
    const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
    const { animateOnceOnly } = useOneTimeAnimationControl();
    const toastBottomSpan = useRecoilValue(toastSpan);

    const handlePress = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverMenuVisible(true);
    }, []);

    const handlePopoverRequestClose = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverMenuVisible(false);
    }, []);

    const handleShareText = useCallback(() => {
      handlePopoverRequestClose();
      onShareTextPress?.();
    }, [handlePopoverRequestClose, onShareTextPress]);

    const handleShareFile = useCallback(() => {
      handlePopoverRequestClose();
      if (onShareFilePress) {
        onShareFilePress();
      } else if (onSharePress) {
        onSharePress();
      }
    }, [handlePopoverRequestClose, onShareFilePress, onSharePress]);

    const options: MenuOption[] = useMemo(
      () => [
        {
          Icon: CopyIcon,
          label: t('menuLabels.shareText', { defaultValue: 'Compartilhar texto' }),
          onPress: handleShareText,
        },
        {
          Icon: ShareIcon,
          label: t('menuLabels.shareFile', { defaultValue: 'Compartilhar arquivo (.tudu)' }),
          onPress: handleShareFile,
        },
      ],
      [handleShareFile, handleShareText, t],
    );

    const buttonContent = (
      <OptionsButtonContainer
        entering={animateOnceOnly(ZoomIn.delay(100))}
        extraBottomMargin={toastBottomSpan}>
        <OptionsButton onPress={handlePress} scaleFactor={0.08}>
          <IconWrapper>
            <OptionsThreeDotsIcon ref={iconRef} size={28} speed={2} />
          </IconWrapper>
        </OptionsButton>
      </OptionsButtonContainer>
    );

    return (
      <PopoverMenu
        isVisible={popoverMenuVisible}
        arrowSize={{ width: 0, height: 0 }}
        popoverShift={{ y: 50 }}
        onRequestClose={handlePopoverRequestClose}
        offset={-10}
        from={buttonContent}>
        <MenuOptions options={options} />
      </PopoverMenu>
    );
  },
);

export { ListOptionsButton };
