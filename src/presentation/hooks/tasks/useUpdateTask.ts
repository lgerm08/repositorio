import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskRepository } from './_taskRepository';

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: { name?: string; checked?: boolean } }) =>
      taskRepository.updateTask(id, changes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
