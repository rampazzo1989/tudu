import React, {memo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {ListCard} from '../../../../components/list-card';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {ListGroupCard} from '../list-group-card';
import {CustomListsProps} from './types';
import {Container} from './styles';

const CustomLists: React.FC<CustomListsProps> = memo(({data}) => {
  return (
    <Container>
      {data.map((item, index) => {
        if (item.groupId) {
          return (
            <DraggableView
              key={generateRandomHash(
                `${item.groupId}${index}${item.data.length}`,
              )}
              payload={item}
              isReceiver>
              <ListGroupCard groupData={item} />
            </DraggableView>
          );
        } else {
          const onlyItem = item.data[0];
          return (
            <DraggableView
              key={generateRandomHash(`${onlyItem.label}${index}`)}
              payload={item}>
              <ListCard
                Icon={ListDefaultIcon}
                label={onlyItem.label}
                numberOfActiveItems={onlyItem.numberOfActiveItems}
                color={onlyItem.color}
              />
            </DraggableView>
          );
        }
      })}
    </Container>
  );
});

export {CustomLists};
