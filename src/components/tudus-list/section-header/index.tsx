import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionsThreeDotsIcon } from '../../animated-icons/options-arrow-down-icon';
import { DeleteStaticIcon, RenameStaticIcon } from '../../../assets/static/tudu-icons';
import { AnimatedIconRef } from '../../animated-icons/animated-icon/types';
import { PopoverMenu } from '../../popover-menu';
import { MenuOptions } from '../../menu-options';
import { MenuOption } from '../../menu-options/types';
import { SectionHeaderProps } from './types';
import {
  CountBadge,
  CountBadgeText,
  OptionsIconWrap,
  SectionHeaderContainer,
  SectionOptionsTouchable,
  SectionTitleText,
  TitleRow,
} from './styles';

export const SectionHeader: React.FC<SectionHeaderProps> = memo(
  ({
    section,
    itemCount,
    onRename,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
  }) => {
    const { t } = useTranslation();
    const iconRef = useRef<AnimatedIconRef>(null);
    const [popoverVisible, setPopoverVisible] = useState(false);

    const handleOpenMenu = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverVisible(true);
    }, []);

    const handleCloseMenu = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverVisible(false);
    }, []);

    const handleRename = useCallback(() => {
      handleCloseMenu();
      onRename(section);
    }, [handleCloseMenu, onRename, section]);

    const handleDelete = useCallback(() => {
      handleCloseMenu();
      onDelete(section);
    }, [handleCloseMenu, onDelete, section]);

    const handleMoveUp = useCallback(() => {
      handleCloseMenu();
      onMoveUp?.(section);
    }, [handleCloseMenu, onMoveUp, section]);

    const handleMoveDown = useCallback(() => {
      handleCloseMenu();
      onMoveDown?.(section);
    }, [handleCloseMenu, onMoveDown, section]);

    const options: MenuOption[] = useMemo(() => {
      const opts: MenuOption[] = [
        {
          Icon: RenameStaticIcon,
          label: t('sections.renameSection', { defaultValue: 'Renomear seção' }),
          onPress: handleRename,
        },
      ];

      if (onMoveUp && !isFirst) {
        opts.push({
          label: `↑ ${t('sections.moveUp', { defaultValue: 'Mover para cima' })}`,
          onPress: handleMoveUp,
        });
      }

      if (onMoveDown && !isLast) {
        opts.push({
          label: `↓ ${t('sections.moveDown', { defaultValue: 'Mover para baixo' })}`,
          onPress: handleMoveDown,
        });
      }

      opts.push({
        Icon: DeleteStaticIcon,
        label: t('sections.deleteSection', { defaultValue: 'Excluir seção' }),
        onPress: handleDelete,
      });

      return opts;
    }, [handleDelete, handleMoveDown, handleMoveUp, handleRename, isFirst, isLast, onMoveDown, onMoveUp, t]);

    const TriggerButton = useCallback(
      () => (
        <SectionOptionsTouchable onPress={handleOpenMenu} scaleFactor={0.08} hitSlop={12}>
          <OptionsIconWrap>
            <OptionsThreeDotsIcon ref={iconRef} size={16} speed={2} />
          </OptionsIconWrap>
        </SectionOptionsTouchable>
      ),
      [handleOpenMenu],
    );

    return (
      <SectionHeaderContainer>
        <TitleRow>
          <SectionTitleText numberOfLines={1}>{section.title}</SectionTitleText>
          <CountBadge>
            <CountBadgeText>{itemCount}</CountBadgeText>
          </CountBadge>
        </TitleRow>

        <PopoverMenu
          isVisible={popoverVisible}
          onRequestClose={handleCloseMenu}
          from={TriggerButton}>
          <MenuOptions options={options} />
        </PopoverMenu>
      </SectionHeaderContainer>
    );
  },
);
