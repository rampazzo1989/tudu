import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Voice from '@react-native-voice/voice';
import { useVoiceRecognition } from '../src/hooks/useVoiceRecognition';

jest.mock('@react-native-voice/voice', () => ({
  onSpeechStart: null,
  onSpeechRecognized: null,
  onSpeechEnd: null,
  onSpeechError: null,
  onSpeechResults: null,
  onSpeechPartialResults: null,
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  cancel: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

const TestVoiceComponent: React.FC<{
  onSpeechFinal?: (text: string) => void;
  onSpeechPartial?: (text: string) => void;
  onMountHook?: (hook: ReturnType<typeof useVoiceRecognition>) => void;
}> = ({ onSpeechFinal, onSpeechPartial, onMountHook }) => {
  const hook = useVoiceRecognition({
    onSpeechFinal,
    onSpeechPartial,
  });

  React.useEffect(() => {
    onMountHook?.(hook);
  }, [hook, onMountHook]);

  return null;
};

describe('useVoiceRecognition Multi-Instance & Active Handler Routing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should deliver speech results to whichever instance starts listening', async () => {
    const onFinal1 = jest.fn();
    const onPartial1 = jest.fn();
    const onFinal2 = jest.fn();
    const onPartial2 = jest.fn();

    let hook1Instance: ReturnType<typeof useVoiceRecognition> | null = null;
    let hook2Instance: ReturnType<typeof useVoiceRecognition> | null = null;

    let tree1: renderer.ReactTestRenderer;
    let tree2: renderer.ReactTestRenderer;

    await act(async () => {
      tree1 = renderer.create(
        <TestVoiceComponent
          onSpeechFinal={onFinal1}
          onSpeechPartial={onPartial1}
          onMountHook={h => {
            hook1Instance = h;
          }}
        />,
      );
    });

    await act(async () => {
      tree2 = renderer.create(
        <TestVoiceComponent
          onSpeechFinal={onFinal2}
          onSpeechPartial={onPartial2}
          onMountHook={h => {
            hook2Instance = h;
          }}
        />,
      );
    });

    // Instance 1 starts listening
    await act(async () => {
      await hook1Instance?.startListening('pt-BR');
    });

    // Emit partial speech event
    act(() => {
      Voice.onSpeechPartialResults?.({ value: ['comprar pão'] } as any);
    });

    expect(onPartial1).toHaveBeenCalledWith('comprar pão');
    expect(onPartial2).not.toHaveBeenCalled();

    // Emit final speech event
    act(() => {
      Voice.onSpeechResults?.({ value: ['comprar pão e leite'] } as any);
    });

    expect(onFinal1).toHaveBeenCalledWith('comprar pão e leite');
    expect(onFinal2).not.toHaveBeenCalled();

    // Now unmount Instance 2 (simulating navigating away from a list screen)
    act(() => {
      tree2.unmount();
    });

    // Instance 1 starts listening again
    await act(async () => {
      await hook1Instance?.startListening('pt-BR');
    });

    // Emit speech results - Instance 1 must STILL receive them even after Instance 2 unmounted!
    act(() => {
      Voice.onSpeechResults?.({ value: ['fazer almoço'] } as any);
    });

    expect(onFinal1).toHaveBeenCalledWith('fazer almoço');
  });
});
