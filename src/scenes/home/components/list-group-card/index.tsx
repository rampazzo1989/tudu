import React, {memo, useRef} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {DraggableItem} from '../../../../modules/draggable/draggable-item';
import {ListGroupContainer, SubListCard, Title, TitleContainer} from './styles';
import {ListGroupProps} from './types';
import {PopoverMenu} from '../../../../components/popover-menu';
import {GroupOptions} from './components/group-options';
import {OptionsArrowDownIcon} from '../../../../components/animated-icons/options-arrow-down-icon';
import {BaseAnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';

const ListGroupCard: React.FC<ListGroupProps> = memo(({groupData}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);

  return (
    <ListGroupContainer>
      <TitleContainer>
        <Title>{groupData.groupId}</Title>

        <PopoverMenu
          onRequestClose={() => iconRef.current?.toggle()}
          from={(sourceRef, showPopover) => (
            <TouchableOpacity
              onPress={() => {
                iconRef.current?.toggle();
                showPopover();
              }}
              style={{width: 20, height: 20}}
              hitSlop={20}>
              <OptionsArrowDownIcon ref={iconRef} animateWhenIdle={false} />
            </TouchableOpacity>
          )}>
          <GroupOptions groupData={groupData} />
        </PopoverMenu>
      </TitleContainer>
      {groupData.data.map(list => {
        return (
          <DraggableItem
            key={generateRandomHash(`${list.label}${groupData.groupId}`)}
            payload={list}>
            <SubListCard
              Icon={ListDefaultIcon}
              label={list.label}
              numberOfActiveItems={list.numberOfActiveItems}
            />
          </DraggableItem>
        );
      })}
    </ListGroupContainer>
  );
});

export {ListGroupCard};
