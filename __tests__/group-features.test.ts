import {DraggableItem} from '../src/modules/draggable/draggable-context/types';
import {ListDataViewModel} from '../src/scenes/home/types';

describe('Group Features', () => {
  const createMockList = (
    id: string,
    label: string,
    groupName?: string,
  ): ListDataViewModel => ({
    id,
    label,
    groupName,
    origin: 'default',
    numberOfActiveItems: 2,
    mapBackList: jest.fn(),
    mapBackTudus: jest.fn(),
    clone: jest.fn(),
    getNumberOfActiveItems: jest.fn(),
  });

  describe('Home Group Card 4-item limit', () => {
    it('should calculate displayed items and remaining count correctly when > 4 lists', () => {
      const MAX_DISPLAYED_LISTS = 4;
      const lists = [
        createMockList('1', 'Lista 1', 'Trabalho'),
        createMockList('2', 'Lista 2', 'Trabalho'),
        createMockList('3', 'Lista 3', 'Trabalho'),
        createMockList('4', 'Lista 4', 'Trabalho'),
        createMockList('5', 'Lista 5', 'Trabalho'),
        createMockList('6', 'Lista 6', 'Trabalho'),
      ];

      const groupData = new DraggableItem(lists, 'Trabalho');
      const displayedLists = groupData.data.slice(0, MAX_DISPLAYED_LISTS);
      const remainingCount = groupData.data.length - MAX_DISPLAYED_LISTS;

      expect(displayedLists).toHaveLength(4);
      expect(displayedLists.map(l => l.id)).toEqual(['1', '2', '3', '4']);
      expect(remainingCount).toBe(2);
    });

    it('should calculate remaining count <= 0 when <= 4 lists', () => {
      const MAX_DISPLAYED_LISTS = 4;
      const lists = [
        createMockList('1', 'Lista 1', 'Trabalho'),
        createMockList('2', 'Lista 2', 'Trabalho'),
        createMockList('3', 'Lista 3', 'Trabalho'),
      ];

      const groupData = new DraggableItem(lists, 'Trabalho');
      const displayedLists = groupData.data.slice(0, MAX_DISPLAYED_LISTS);
      const remainingCount = groupData.data.length - MAX_DISPLAYED_LISTS;

      expect(displayedLists).toHaveLength(3);
      expect(remainingCount).toBe(-1);
    });
  });

  describe('Group Editing and State Transformation', () => {
    it('should correctly update group name and unlink removed lists when editing group', () => {
      const listA = createMockList('a', 'Lista A', 'Grupo 1');
      const listB = createMockList('b', 'Lista B', 'Grupo 1');
      const listC = createMockList('c', 'Lista C', 'Grupo 1');
      const listD = createMockList('d', 'Lista D'); // Ungrouped

      const group1 = new DraggableItem([listA, listB, listC], 'Grupo 1');
      const ungroupedD = new DraggableItem([listD]);

      const initialData: DraggableItem<ListDataViewModel>[] = [group1, ungroupedD];

      // Simulate user editing Group 1:
      // - Keeps listA, listC
      // - Removes listB
      // - Adds listD
      // - Renames to "Grupo 1 Novo"
      const selectedLists = [
        new DraggableItem([listA]),
        new DraggableItem([listC]),
        new DraggableItem([listD]),
      ];
      const newTitle = 'Grupo 1 Novo';

      const allSelectedLists = selectedLists.flatMap(x => x.data);
      const selectedListIds = selectedLists.map(s => s.data[0].id);

      const removedLists = group1.data.filter(
        orig => !selectedListIds.includes(orig.id),
      );

      const newlyAddedListIds = selectedLists
        .filter(s => !group1.data.some(orig => orig.id === s.data[0].id))
        .map(s => s.data[0].id);

      const updatedGroup = new DraggableItem(allSelectedLists, newTitle);
      const newData: DraggableItem<ListDataViewModel>[] = [];

      for (const item of initialData) {
        if (item === group1) {
          if (allSelectedLists.length > 0) {
            newData.push(updatedGroup);
          }
          removedLists.forEach(removed => {
            newData.push(new DraggableItem([removed]));
          });
        } else if (item.groupId) {
          newData.push(item);
        } else {
          if (!newlyAddedListIds.includes(item.data[0].id)) {
            newData.push(item);
          }
        }
      }

      // Check results
      expect(newData).toHaveLength(2);
      expect(newData[0].groupId).toBe('Grupo 1 Novo');
      expect(newData[0].data.map(l => l.id)).toEqual(['a', 'c', 'd']);

      // listB should now be ungrouped
      expect(newData[1].groupId).toBeUndefined();
      expect(newData[1].data[0].id).toBe('b');
    });
  });

  describe('Section and orderingPrompt preservation', () => {
    it('should preserve sections and orderingPrompt in getListFromViewModel', () => {
      const {getListFromViewModel} = require('../src/utils/list-and-group-utils');
      const listWithSections: ListDataViewModel = {
        id: 'list-sec',
        label: 'Lista com Seções',
        groupName: 'Trabalho',
        origin: 'default',
        numberOfActiveItems: 3,
        sections: [
          {id: 'sec-1', title: 'Urgente', order: 0},
          {id: 'sec-2', title: 'Depois', order: 1},
        ],
        orderingPrompt: 'ordene por urgencia',
        mapBackList: jest.fn(),
        mapBackTudus: jest.fn(),
        clone: jest.fn(),
        getNumberOfActiveItems: jest.fn(),
      };

      const mapped = getListFromViewModel(listWithSections);
      expect(mapped.sections).toEqual([
        {id: 'sec-1', title: 'Urgente', order: 0},
        {id: 'sec-2', title: 'Depois', order: 1},
      ]);
      expect(mapped.orderingPrompt).toBe('ordene por urgencia');
      expect(mapped.groupName).toBe('Trabalho');
      expect(mapped.id).toBe('list-sec');
      expect(mapped.label).toBe('Lista com Seções');
    });
  });

  describe('getUngroupedItems robustness', () => {
    const {getUngroupedItems} = require('../src/modules/draggable/draggable-utils');

    it('should return an empty array when passed undefined or null', () => {
      expect(getUngroupedItems(undefined)).toEqual([]);
      expect(getUngroupedItems(null as any)).toEqual([]);
    });

    it('should return only ungrouped items when list has mixed items', () => {
      const listA = createMockList('a', 'Lista A', 'Grupo 1');
      const listB = createMockList('b', 'Lista B');

      const groupItem = new DraggableItem([listA], 'Grupo 1');
      const ungroupedItem = new DraggableItem([listB]);

      const result = getUngroupedItems([groupItem, ungroupedItem]);
      expect(result).toHaveLength(1);
      expect(result[0].data[0].id).toBe('b');
    });
  });
});

