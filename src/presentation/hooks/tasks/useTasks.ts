import { useQuery } from '@tanstack/react-query';
import { taskRepository } from './_taskRepository';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskRepository.getTasks(),
    staleTime: 0,
  });
}
