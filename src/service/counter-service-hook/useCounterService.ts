import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {counters as countersState} from '../../scenes/home/state';
import {CounterViewModel} from '../../scenes/home/types';
import {ItemNotFoundError} from '../errors/item-not-found-error';

const useCounterService = () => {
  const [counters, setCounters] = useRecoilState(countersState);

  const getCounterById = useCallback(
    (id: string) => {
      const foundCounter = counters.get(id);

      if (!foundCounter) {
        throw new ItemNotFoundError('Counter not found', {id});
      }

      return new CounterViewModel(foundCounter);
    },
    [counters],
  );

  const getAllCounters = useCallback(() => {
    const viewModels = [...counters].map(([_, c]) => new CounterViewModel(c));

    return viewModels;
  }, [counters]);

  const saveCounter = useCallback(
    (counter: CounterViewModel) => {
      const originalCounter = counter.mapBack();
      setCounters(previousState => {
        const newState = new Map(previousState);
        newState.set(originalCounter.id, originalCounter);

        return newState;
      });
    },
    [setCounters],
  );

  const deleteCounter = useCallback(
    (counter: CounterViewModel) => {
      setCounters(previousState => {
        const newState = new Map(previousState);
        newState.delete(counter.id);

        return newState;
      });
    },
    [setCounters],
  );

  return {getCounterById, getAllCounters, saveCounter, deleteCounter};
};

export {useCounterService};
