import React, {memo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {ListCard} from '../../../../components/list-card';
import {DraggableContextProvider} from '../../../../modules/draggable/draggable-context';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {List} from '../../types';
import {ListGroupCard} from '../list-group-card';
import {CustomListsProps} from './types';
import {Container} from './styles';

const CustomLists: React.FC<CustomListsProps> = memo(
  ({data, onSetData, onDragStart, onDragEnd}) => {
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
                <ListGroupCard groupTitle={item.groupId} items={item.data} />
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
                />
              </DraggableView>
            );
          }
        })}
      </Container>
    );
  },
);

export {CustomLists};
