import React, {forwardRef, memo, useImperativeHandle} from 'react';
import Svg, {Circle, Path, Rect, SvgProps} from 'react-native-svg';
import {AnimatedIconProps} from '../../../components/animated-icons/animated-icon/types';

export interface TuduIconProps extends SvgProps {
  size?: number;
  color?: string;
  overrideColor?: string;
}

/**
 * Outline Star (Frame 530 de star-white.json)
 */
export const StarOutlineSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2.5l2.83 5.73 6.33.92-4.58 4.46 1.08 6.31L12 16.94l-5.66 2.98 1.08-6.31L2.84 9.15l6.33-.92L12 2.5z"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
});

/**
 * Filled Star (Frame 600 de star-white.json)
 */
export const StarFilledSvg = memo<TuduIconProps>(({size = 20, color = '#FFD700', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2.5l2.83 5.73 6.33.92-4.58 4.46 1.08 6.31L12 16.94l-5.66 2.98 1.08-6.31L2.84 9.15l6.33-.92L12 2.5z"
        fill={c}
        stroke={c}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Unchecked Circle (Frame 81 de tudu_checkbox.json)
 */
export const CheckboxUncheckedSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 65 65" fill="none" {...props}>
      <Circle
        cx="32.5"
        cy="32.5"
        r="26"
        stroke={c}
        strokeWidth={6.5}
        fill="none"
      />
    </Svg>
  );
});

/**
 * Checked Circle with Checkmark (Frame 32 de tudu_checkbox.json)
 */
export const CheckboxCheckedSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 65 65" fill="none" {...props}>
      <Circle
        cx="32.5"
        cy="32.5"
        r="26"
        stroke={c}
        strokeWidth={6.5}
        fill="none"
      />
      <Path
        d="M18 32.2l11.25 10.8L48 25"
        stroke={c}
        strokeWidth={7.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
});

/**
 * Sun chip icon (extraído de sun.json frame 50)
 */
export const SunChipSvg = memo<TuduIconProps>(({size = 12, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} {...props}>
      <Circle cx="12" cy="12" r="4" strokeWidth={2} />
      <Path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
});

/**
 * Crescent Moon icon (extraído de moon.json)
 */
export const MoonSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} {...props}>
      <Path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
});

/**
 * Calendar icon (extraído de calendar_black.json frame 60)
 */
export const CalendarChipSvg = memo<TuduIconProps>(({size = 11, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} {...props}>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
      <Path d="M16 2v4M8 2v4M3 10h18" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});

/**
 * List / Checklist icon (extraído de list_icon.json frame 165)
 */
export const ListChipSvg = memo<TuduIconProps>(({size = 10, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} {...props}>
      <Circle cx="4.5" cy="6" r="1.5" fill={c} />
      <Circle cx="4.5" cy="12" r="1.5" fill={c} />
      <Circle cx="4.5" cy="18" r="1.5" fill={c} />
      <Path d="M9 6h12M9 12h12M9 18h12" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
});

/**
 * Rename/Edit pencil icon (extraído de rename.json frame 70)
 */
export const RenameActionSvg = memo<TuduIconProps>(({size = 24, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} {...props}>
      <Path
        d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M15 5l4 4" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});

/**
 * Back Chevron icon (extraído de back.json)
 */
export const BackSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M15 19l-7-7 7-7"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Next Chevron icon (extraído de back.json espelhado)
 */
export const NextSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9 5l7 7-7 7"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Share icon
 */
export const ShareSvg = memo<TuduIconProps>(({size = 18, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Refresh / Undo circular arrow (extraído de refresh.lottie)
 */
export const RefreshSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
        stroke={c}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 3v5h5"
        stroke={c}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Plus icon (extraído de plus2.json)
 */
export const PlusSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 5v14M5 12h14"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Copy / Duplicate sheets icon (extraído de copy.lottie)
 */
export const CopySvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Trash / Delete can icon (extraído de trash2.json)
 */
export const TrashSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Ungroup icon (extraído de ungroup.json)
 */
export const UngroupSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect
        x="9"
        y="9"
        width="12"
        height="12"
        rx="2"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 4l5 5"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
});

/**
 * New Group / Folder with Plus icon (extraído de new_group.json)
 */
export const NewGroupSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11v6M9 14h6"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Hash / Counter icon (extraído de hash.json)
 */
export const HashSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Recurrence / Repeat clock icon (extraído de recurrence.lottie)
 */
export const RecurrenceSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M17 2l4 4-4 4"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11v-1a4 4 0 0 1 4-4h14"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 22l-4-4 4-4"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 13v1a4 4 0 0 1-4 4H3"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Search icon (extraído de search.json)
 */
export const SearchSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle
        cx="11"
        cy="11"
        r="8"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 21l-4.35-4.35"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Settings / Gear icon (extraído de settings.json)
 */
export const SettingsSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Folder icon (extraído de folder.json)
 */
export const FolderSvg = memo<TuduIconProps>(({size = 20, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

/**
 * Checked tudú logo (extraído de checked.json)
 */
export const CheckedLogoSvg = memo<TuduIconProps>(({size = 32, color = '#FFFFFF', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 65 65" fill="none" {...props}>
      <Circle
        cx="32.5"
        cy="32.5"
        r="26"
        stroke={c}
        strokeWidth={6.5}
        fill="none"
      />
      <Path
        d="M18 32.2l11.25 10.8L48 25"
        stroke={c}
        strokeWidth={7.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
});

/**
 * Higher-order component to create static icons compatible with AnimatedIconProps & ForwardedRef
 */
export function createStaticIcon(SvgComponent: React.ComponentType<TuduIconProps>) {
  return memo(
    forwardRef<any, AnimatedIconProps>((props, ref) => {
      useImperativeHandle(ref, () => ({
        play: (options?: any) => {
          options?.onAnimationFinish?.();
        },
        pause: () => {},
        toggle: () => {},
      }));

      const size = typeof props.size === 'number' ? props.size : 20;
      const color = props.overrideColor || (props as any).color || '#FFFFFF';

      return <SvgComponent size={size} color={color} overrideColor={props.overrideColor} style={props.style} />;
    }),
  );
}

/**
 * Drop-in Static Icon wrappers compatible with React.FC<AnimatedIconProps> and ForwardedRefAnimatedIcon
 */
export const BackStaticIcon = createStaticIcon(BackSvg);
export const NextStaticIcon = createStaticIcon(NextSvg);
export const ShareStaticIcon = createStaticIcon(ShareSvg);
export const RefreshStaticIcon = createStaticIcon(RefreshSvg);
export const PlusStaticIcon = createStaticIcon(PlusSvg);
export const CopyStaticIcon = createStaticIcon(CopySvg);
export const DeleteStaticIcon = createStaticIcon(TrashSvg);
export const RenameStaticIcon = createStaticIcon(RenameActionSvg);
export const UngroupStaticIcon = createStaticIcon(UngroupSvg);
export const NewGroupStaticIcon = createStaticIcon(NewGroupSvg);
export const HashStaticIcon = createStaticIcon(HashSvg);
export const ListDefaultStaticIcon = createStaticIcon(ListChipSvg);
export const CalendarStaticIcon = createStaticIcon(CalendarChipSvg);
export const RecurrenceStaticIcon = createStaticIcon(RecurrenceSvg);
export const SunStaticIcon = createStaticIcon(SunChipSvg);
export const MoonStaticIcon = createStaticIcon(MoonSvg);
export const SearchStaticIcon = createStaticIcon(SearchSvg);
export const SettingsStaticIcon = createStaticIcon(SettingsSvg);
export const FolderStaticIcon = createStaticIcon(FolderSvg);
export const CheckedLogoStaticIcon = createStaticIcon(CheckedLogoSvg);

// Legacy exports for backwards compatibility
export const RenameActionStaticIcon = RenameStaticIcon;
export const CalendarActionStaticIcon = CalendarStaticIcon;
