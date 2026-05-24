import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/types';
import { useTasks } from '../../hooks/tasks/useTasks';
import { useCreateTask } from '../../hooks/tasks/useCreateTask';
import { useUpdateTask } from '../../hooks/tasks/useUpdateTask';
import { useDeleteTask } from '../../hooks/tasks/useDeleteTask';
import { useAppTheme } from '../../theme/useAppTheme';
import { AppColors } from '../../theme/colors';
import { Task } from '../../../core/entities/Task';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

const SYNC_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  synced: '#10B981',
  failed: '#EF4444',
};

export function HomeScreen({ navigation }: Props) {
  const { colors, typography } = useAppTheme();
  const [newTaskName, setNewTaskName] = useState('');
  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);

  const { data: tasks = [], isLoading, refetch, isRefetching } = useTasks();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const handleCreate = () => {
    const trimmed = newTaskName.trim();
    if (!trimmed) return;
    setNewTaskName('');
    createTask(trimmed);
  };

  const handleToggle = (task: Task) => {
    updateTask({ id: task.id, changes: { checked: !task.checked } });
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Excluir tarefa', `Deseja excluir "${task.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskRow}>
      <TouchableOpacity onPress={() => handleToggle(item)} style={styles.checkbox}>
        <Ionicons
          name={item.checked ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.checked ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.taskInfo}>
        <Text style={[styles.taskName, item.checked && styles.taskNameChecked]} numberOfLines={2}>
          {item.name}
        </Text>
        <View
          style={[styles.syncDot, { backgroundColor: SYNC_COLORS[item.syncStatus] ?? '#ccc' }]}
        />
      </View>

      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa..."
          placeholderTextColor={colors.textSecondary}
          value={newTaskName}
          onChangeText={setNewTaskName}
          onSubmitEditing={handleCreate}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleCreate}
          disabled={isCreating || !newTaskName.trim()}
        >
          {isCreating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="add" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(t) => t.id}
          renderItem={renderTask}
          contentContainerStyle={tasks.length === 0 && styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.border} />
              <Text style={styles.emptyText}>Nenhuma tarefa ainda</Text>
              <Text style={styles.emptySubtext}>Adicione sua primeira tarefa acima</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors: AppColors, typography: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inputRow: {
      flexDirection: 'row',
      padding: 16,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      fontSize: typography.size.md,
      color: colors.text,
      backgroundColor: colors.background,
    },
    addBtn: {
      width: 44,
      height: 44,
      backgroundColor: colors.primary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loader: { marginTop: 48 },
    taskRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    checkbox: { marginRight: 12 },
    taskInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    taskName: {
      flex: 1,
      fontSize: typography.size.md,
      color: colors.text,
    },
    taskNameChecked: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
    syncDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    deleteBtn: { padding: 4 },
    emptyContainer: { flex: 1 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    emptyText: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.semiBold,
      color: colors.textSecondary,
    },
    emptySubtext: { fontSize: typography.size.sm, color: colors.textSecondary },
    profileBtn: {
      position: 'absolute',
      top: 22,
      right: 16,
    },
  });
}
