import {useState} from 'react';

type UseHashGeneratorProps = {
  seedText: string;
};

function generateRandomHash(text?: string): string {
  const seed = text || '';
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  let hash = 0;
  const combined = `${seed}-${timestamp}-${randomPart}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hexHash}${randomPart.substring(0, 16)}`;
}

const useHashGenerator = ({seedText}: UseHashGeneratorProps) => {
  const [key] = useState(generateRandomHash(seedText));

  return {key};
};

export {useHashGenerator, generateRandomHash};

