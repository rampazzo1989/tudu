import React, {PropsWithChildren, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {HomePageProps} from './types';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {atom, useRecoilState} from 'recoil';
import {PageContent} from '../../components/page-content';
import {Header} from '../../components/header';

type TestRecoilType = {
  name: string;
  age: number;
};

const testRecoil = atom<TestRecoilType | undefined>({
  key: 'testRecoil',
  default: undefined,
});

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [test, setTest] = useRecoilState(testRecoil);

  useEffect(() => {
    setTest({name: 'Rampazzo', age: 30});
  }, [setTest]);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text>{test?.name}</Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Animated.View entering={FadeInDown}>
          <Header>
            <View />
          </Header>
        </Animated.View>
        <PageContent>
          <View />
        </PageContent>
      </ScrollView>
    </SafeAreaView>
  );
};

export {HomePage};
