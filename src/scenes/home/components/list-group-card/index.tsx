import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {DraggableItem} from '../../../../modules/draggable/draggable-item';
import {ListGroupContainer, SubListCard, Title, TitleContainer} from './styles';
import {ListGroupProps} from './types';
import Popover from 'react-native-popover-view';
import {StatusBar, Text} from 'react-native';

const ListGroupCard: React.FC<ListGroupProps> = memo(({groupTitle, items}) => {
  return (
    <ListGroupContainer>
      <TitleContainer>
        <Title>{groupTitle}</Title>
        <Popover
          statusBarTranslucent
          verticalOffset={StatusBar.currentHeight}
          popoverStyle={{
            backgroundColor: '#3C414A',
            padding: 12,
            borderRadius: 8,
          }}
          from={
            <TouchableOpacity style={{width: 30, height: 30, borderWidth: 1}} />
          }>
          <Text style={{color: 'white'}}>Rename</Text>
        </Popover>
      </TitleContainer>
      {items.map(list => {
        return (
          <DraggableItem
            key={generateRandomHash(`${list.label}${groupTitle}`)}
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
