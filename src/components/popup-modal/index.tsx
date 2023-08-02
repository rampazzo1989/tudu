import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {ZoomInRotate} from 'react-native-reanimated';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {BlurredModal} from '../blurred-modal';
import {
  ContentContainer,
  PopupContainer,
  PopupTitle,
  PopupTitleContainer,
} from './styles';
import {PopupModalProps} from './types';

const PopupModal: React.FC<PopupModalProps> = memo(
  ({children, title, onRequestClose, buttons, ...props}) => {
    return (
      <BlurredModal transparent onRequestClose={onRequestClose} {...props}>
        {props.visible && (
          <Animated.View entering={ZoomInRotate.duration(150)}>
            <PopupContainer>
              {title && (
                <PopupTitleContainer>
                  <DeleteIcon
                    autoPlay
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                  <PopupTitle>{`${title}`}</PopupTitle>
                </PopupTitleContainer>
              )}

              <LinearGradient
                colors={['#3C414A', '#FFFFFF20', '#3C414A']}
                style={{flex: 1, maxHeight: 1, marginTop: 10}}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              />
              {/* <ContentContainer> */}
              {children}
              {buttons && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: buttons.length > 2 ? 'wrap' : 'nowrap',
                    flex: 1,
                    justifyContent: 'space-around',
                    paddingRight: 10,
                  }}>
                  {buttons.map(button => (
                    <TouchableOpacity
                      onPress={button.onPress}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        // elevation: 5,
                        borderWidth: 1,
                        borderColor: '#444B56',
                        backgroundColor: button.highlight
                          ? '#444B56'
                          : '#3C414A',
                        marginLeft: 10,
                        marginTop: 10,
                        width: 100,
                        height: 42,
                        alignItems: 'center',
                      }}>
                      <Text>{button.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* </ContentContainer> */}
            </PopupContainer>
          </Animated.View>
        )}
      </BlurredModal>
    );
  },
);

export {PopupModal};
