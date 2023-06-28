import {useState} from 'react';
import Crypto from 'react-native-quick-crypto';

type UseComponentNameGeneratorProps = {
  componentName: string;
};

function generateRandomHash(text: string) {
  const randomBytes = Crypto.randomBytes(32);

  const hash = Crypto.createHash('sha256')
    .update(text)
    .update(randomBytes)
    .digest('hex');

  return hash;
}

const useHashGenerator = ({componentName}: UseComponentNameGeneratorProps) => {
  const [key] = useState(generateRandomHash(componentName));

  return {key};
};

export {useHashGenerator};
