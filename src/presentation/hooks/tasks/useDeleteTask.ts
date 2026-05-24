import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskRepository } from './_taskRepository';

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskRepository.deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
