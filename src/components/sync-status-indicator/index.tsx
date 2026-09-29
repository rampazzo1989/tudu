import React, { useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useCloudSync } from '../../service/sync/useCloudSync';

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
`;

const StatusText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-left: 4px;
`;

const CloudIcon = styled.Text`
  font-size: 13px;
`;

export const SyncStatusIndicator: React.FC = () => {
  const { isPro, isSyncing, lastSyncAt, syncNow } = useCloudSync();

  const handlePress = useCallback(async () => {
    if (!isPro) return;
    try {
      const ok = await syncNow();
      if (ok) {
        Alert.alert('Sincronização', 'Dados sincronizados com sucesso na nuvem!');
      }
    } catch {
      Alert.alert('Aviso', 'Não foi possível sincronizar no momento. Os dados continuam salvos no seu aparelho.');
    }
  }, [isPro, syncNow]);

  if (!isPro) return null;

  return (
    <Container onPress={handlePress} activeOpacity={0.7}>
      {isSyncing ? (
        <>
          <ActivityIndicator size="small" color="#38bdf8" style={{ transform: [{ scale: 0.7 }] }} />
          <StatusText>Salvando...</StatusText>
        </>
      ) : (
        <>
          <CloudIcon>☁️</CloudIcon>
          <StatusText>Nuvem</StatusText>
        </>
      )}
    </Container>
  );
};
