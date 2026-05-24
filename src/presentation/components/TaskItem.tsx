import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Task } from '../../core/entities/Task';
import { TaskCheckbox } from './TaskCheckbox';
import { TrashButton } from './TrashButton';
import { useAppTheme } from '../theme/useAppTheme';
import { typography } from '../theme/typography';
import { AppColors } from '../theme/colors';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onTrash: () => void;
  isDone?: boolean;
}

export function TaskItem({ task, onToggle, onTrash, isDone = false }: TaskItemProps) {
  const { colors, isDark } = useAppTheme();
  const swipeRef = useRef<Swipeable>(null);

  const doneTextColor = isDark ? colors.gray500 : colors.gray400;
  const itemBg = isDark ? colors.gray800 : colors.gray100;

  const handleTrash = () => {
    swipeRef.current?.close();
    onTrash();
  };

  const renderRightActions = () => <TrashButton onPress={handleTrash} />;

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <View style={[styles.item, { backgroundColor: itemBg }]}>
        <TaskCheckbox checked={isDone} onPress={onToggle} />
        <Text
          style={[
            styles.name,
            isDone && { textDecorationLine: 'line-through', color: doneTextColor },
            !isDone && { color: isDark ? '#ffffff' : colors.gray950 },
          ]}
          numberOfLines={2}
        >
          {task.name}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 72,
    gap: 12,
    marginBottom: 10,
  },
  name: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
  },
});
