export type SyncStatus = 'pending' | 'synced' | 'failed';

export interface Task {
  id: string;
  serverId?: string;
  name: string;
  checked: boolean;
  syncStatus: SyncStatus;
}
