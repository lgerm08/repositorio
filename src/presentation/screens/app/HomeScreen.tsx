import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { useSession } from '../../hooks/auth/useSession';
import { useTasks } from '../../hooks/tasks/useTasks';
import { useCreateTask } from '../../hooks/tasks/useCreateTask';
import { useUpdateTask } from '../../hooks/tasks/useUpdateTask';
import { useDeleteTask } from '../../hooks/tasks/useDeleteTask';
import { TaskItem } from '../../components/TaskItem';
import { AddTaskButton } from '../../components/AddTaskButton';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { BottomModal } from '../../components/BottomModal';
import { useAppTheme } from '../../theme/useAppTheme';
import { typography } from '../../theme/typography';
import { AppColors } from '../../theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user } = useSession();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { data: tasks = [], isLoading, refetch, isRefetching } = useTasks();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const pendingTasks = tasks.filter((t) => !t.checked);
  const doneTasks = tasks.filter((t) => t.checked);

  const textColor = isDark ? '#ffffff' : colors.gray950;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: textColor }]}>
            {`Olá, ${user?.name?.split(' ')[0] ?? ''} 👋`}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
            <InitialsAvatar name={user?.name} size={40} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>A fazer</Text>

        {pendingTasks.length === 0 ? (
          <Text style={styles.empty}>Nenhuma tarefa pendente</Text>
        ) : (
          pendingTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => updateTask({ id: task.id, changes: { checked: true } })}
              onTrash={() => setDeleteTarget(task.id)}
              isDone={false}
            />
          ))
        )}

        {doneTasks.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: textColor, marginTop: 8 }]}>Feito</Text>
            {doneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => updateTask({ id: task.id, changes: { checked: false } })}
                onTrash={() => setDeleteTarget(task.id)}
                isDone
              />
            ))}
          </>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.fab}>
        <AddTaskButton onPress={() => setShowAddModal(true)} />
      </View>

      <BottomModal
        type="form"
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(name) => createTask(name)}
      />

      <BottomModal
        type="confirmation"
        visible={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTask(deleteTarget);
        }}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingHorizontal: 20, paddingTop: 8 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 24,
    },
    greeting: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 18,
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 14,
      marginBottom: 12,
    },
    empty: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      color: colors.gray400,
      marginBottom: 16,
    },
    bottomPad: { height: 80 },
    fab: {
      position: 'absolute',
      bottom: 64,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
  });
}
