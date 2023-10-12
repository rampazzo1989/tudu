import {useState} from 'react';
import Crypto from 'react-native-quick-crypto';

type UseHashGeneratorProps = {
  seedText: string;
};

function generateRandomHash(text: string) {
  const randomBytes = Crypto.randomBytes(32);

  const hash = Crypto.createHash('sha256')
    .update(text)
    .update(randomBytes)
    .digest('hex');

  return hash;
}

const useHashGenerator = ({seedText}: UseHashGeneratorProps) => {
  const [key] = useState(generateRandomHash(seedText));

  return {key};
};

export {useHashGenerator, generateRandomHash};
