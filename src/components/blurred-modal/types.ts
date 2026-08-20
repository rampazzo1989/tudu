import {ModalProps} from 'react-native';

export type BlurredModalProps = ModalProps & {onTouchBackground: () => void, onRequestClose?: () => void};
