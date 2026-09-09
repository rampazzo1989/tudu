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
 * Calendar icon (extraído fielmente de calendar_black.json frame 60)
 */
export const CalendarChipSvg = memo<TuduIconProps>(({size = 11, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 500 500" fill="none" {...props}>
      <Path
        d="M 395.81 83.36 C 395.81 83.36, 354.15 83.36, 354.15 83.36 C 354.15 83.36, 354.15 62.53, 354.15 62.53 C 354.15 51.03, 344.84 41.70, 333.32 41.70 C 321.80 41.70, 312.49 51.03, 312.49 62.53 C 312.49 62.53, 312.49 83.36, 312.49 83.36 C 312.49 83.36, 187.51 83.36, 187.51 83.36 C 187.51 83.36, 187.51 62.53, 187.51 62.53 C 187.51 51.03, 178.20 41.70, 166.68 41.70 C 155.16 41.70, 145.85 51.03, 145.85 62.53 C 145.85 62.53, 145.85 83.36, 145.85 83.36 C 145.85 83.36, 104.19 83.36, 104.19 83.36 C 81.27 83.36, 62.53 102.10, 62.53 125.02 C 62.53 125.02, 62.53 167.51, 62.53 167.51 C 62.53 167.51, 83.36 167.51, 83.36 167.51 C 83.36 167.51, 104.19 167.51, 104.19 167.51 C 104.19 167.51, 395.81 167.51, 395.81 167.51 C 395.81 167.51, 416.64 167.51, 416.64 167.51 C 416.64 167.51, 437.47 167.51, 437.47 167.51 C 437.47 167.51, 437.47 125.02, 437.47 125.02 C 437.47 102.10, 418.72 83.36, 395.81 83.36 Z"
        fill={c}
      />
      <Path
        d="M 395.81 198.75 C 395.81 198.75, 104.19 198.75, 104.19 198.75 C 104.19 198.75, 83.36 198.75, 83.36 198.75 C 83.36 198.75, 62.53 198.75, 62.53 198.75 C 62.53 198.75, 62.53 266.26, 62.53 300.01 C 62.53 331.94, 62.53 395.81, 62.53 395.81 C 62.53 418.72, 81.27 437.47, 104.19 437.47 C 104.19 437.47, 395.81 437.47, 395.81 437.47 C 418.72 437.47, 437.47 418.72, 437.47 395.81 C 437.47 395.81, 437.47 334.61, 437.47 304.01 C 437.47 268.93, 437.47 198.75, 437.47 198.75 C 437.47 198.75, 416.64 198.75, 416.64 198.75 C 416.64 198.75, 395.81 198.75, 395.81 198.75 Z M 166.68 333.94 C 178.13 333.94, 187.51 343.31, 187.51 354.77 C 187.51 366.23, 178.34 375.60, 166.89 375.60 C 166.89 375.60, 166.68 375.60, 166.68 375.60 C 155.22 375.60, 145.85 366.23, 145.85 354.77 C 145.85 343.31, 155.22 333.94, 166.68 333.94 Z M 166.68 261.04 C 178.13 261.04, 187.51 270.20, 187.51 281.87 C 187.51 293.32, 178.34 302.70, 166.89 302.70 C 166.89 302.70, 166.68 302.70, 166.68 302.70 C 155.22 302.70, 145.85 293.32, 145.85 281.87 C 145.85 270.20, 155.22 261.04, 166.68 261.04 Z M 250.00 333.94 C 261.66 333.94, 270.83 343.31, 270.83 354.77 C 270.83 366.23, 261.66 375.60, 250.00 375.60 C 238.54 375.60, 229.17 366.23, 229.17 354.77 C 229.17 343.31, 238.33 333.94, 250.00 333.94 Z M 250.00 261.04 C 261.66 261.04, 270.83 270.20, 270.83 281.87 C 270.83 293.32, 261.66 302.70, 250.00 302.70 C 238.54 302.70, 229.17 293.32, 229.17 281.87 C 229.17 270.20, 238.33 261.04, 250.00 261.04 Z M 333.11 261.04 C 333.11 261.04, 333.32 261.04, 333.32 261.04 C 344.77 261.04, 354.15 270.20, 354.15 281.87 C 354.15 293.32, 344.77 302.70, 333.32 302.70 C 321.86 302.70, 312.49 293.32, 312.49 281.87 C 312.49 270.20, 321.65 261.04, 333.11 261.04 Z"
        fill={c}
        fillRule="evenodd"
      />
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
 * Rename/Edit pencil icon (extraído fielmente de rename.json frame 70)
 */
export const RenameActionSvg = memo<TuduIconProps>(({size = 24, color = 'white', overrideColor, ...props}) => {
  const c = overrideColor || color;
  return (
    <Svg width={size} height={size} viewBox="0 0 500 500" fill="none" {...props}>
      <Path
        d="M 437.55 375.00 C 437.55 375.00, 176.58 375.00, 176.58 375.00 C 176.58 375.00, 304.21 251.25, 304.21 251.25 C 304.21 251.25, 213.59 160.63, 213.59 160.63 C 213.59 160.63, 48.17 318.33, 48.17 318.33 C 44.00 322.08, 41.71 327.71, 41.71 333.33 C 41.71 333.33, 41.71 395.83, 41.71 395.83 C 41.71 407.29, 51.09 416.67, 62.55 416.67 C 62.55 416.67, 125.05 416.67, 125.05 416.67 C 125.05 416.67, 437.55 416.67, 437.55 416.67 C 449.00 416.67, 458.38 407.29, 458.38 395.83 C 458.38 384.38, 449.00 375.00, 437.55 375.00 Z"
        fill={c}
      />
      <Path
        d="M 372.55 185.00 C 380.88 176.46, 385.46 165.42, 385.46 153.54 C 385.46 141.67, 380.88 130.63, 371.71 121.46 C 371.71 121.46, 343.80 96.25, 343.80 96.25 C 327.13 79.58, 297.55 80.00, 281.50 96.04 C 281.50 96.04, 243.80 131.88, 243.80 131.88 C 243.80 131.88, 334.21 222.29, 334.21 222.29 C 334.21 222.29, 372.55 185.00, 372.55 185.00 Z"
        fill={c}
      />
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
