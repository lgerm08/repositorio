import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskRepository } from './_taskRepository';

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => taskRepository.createTask(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
