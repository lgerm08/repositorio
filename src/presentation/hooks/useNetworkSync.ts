import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { taskRepository } from './tasks/_taskRepository';

export function useNetworkSync() {
  const qc = useQueryClient();
  const wasOffline = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = !!(state.isConnected && state.isInternetReachable !== false);
      if (isConnected && wasOffline.current) {
        taskRepository.syncPending().then(() => {
          qc.invalidateQueries({ queryKey: ['tasks'] });
        });
      }
      wasOffline.current = !isConnected;
    });

    return () => unsubscribe();
  }, [qc]);
}
