import task, {
    TaskRequestPayload,
    TasksResponseType,
    GetAllTaskParamType,
} from '@/interfaces/task.type';
import { api } from './api';
import { MINE_TASKS_URL, TASKS_URL } from '@/constants/url';
import { ASSIGNED } from '@/constants/task-status';
import {
    THOUSAND_MILLI_SECONDS,
    FOURTEEN_DAYS,
    SECONDS_IN_A_DAY,
} from '@/constants/date';
import { TASK_RESULT_SIZE } from '@/constants/constants';

type TasksCreateMutationResponse = { message: string; task: task };
type AssignTaskPayload = { taskId: string; assignee: string };

export const assignTaskReducerStateBuilder = () => {
    const dateObject: Date = new Date();
    const startedOnEpoch: number =
        dateObject.getTime() / THOUSAND_MILLI_SECONDS;
    const endsOnEpoch: number =
        startedOnEpoch + FOURTEEN_DAYS * SECONDS_IN_A_DAY;
    const build = ({ assignee }: { assignee: string }) => {
        return {
            status: ASSIGNED,
            startedOn: startedOnEpoch,
            endsOn: endsOnEpoch,
            assignee,
        };
    };
    return build;
};

export const tasksApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllTasks: builder.query<TasksResponseType, GetAllTaskParamType>({
            query: ({
                dev,
                status,
                size = TASK_RESULT_SIZE,
                nextPage,
                prevPage,
            }) => {
                const url =
                    nextPage ?? prevPage ?? dev
                        ? `/tasks?status=${status}&dev=true&size=${size}`
                        : '/tasks';
                return { url };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result['tasks'].map(({ id }) => ({
                              type: 'Tasks' as const,
                              id,
                          })),
                          'Tasks',
                      ]
                    : ['Tasks'],

            transformResponse: (response: TasksResponseType) => {
                return {
                    tasks: [...response.tasks].sort(
                        (a: task, b: task) => +a.endsOn - +b.endsOn
                    ),
                    next: response.next,
                    prev: response.prev,
                };
            },
        }),

        getMineTasks: builder.query<TasksResponseType, void>({
            query: () => MINE_TASKS_URL,
            providesTags: ['Mine_Tasks'],
        }),
        addTask: builder.mutation<TasksCreateMutationResponse, Partial<task>>({
            query: (task: task) => ({
                url: TASKS_URL,
                method: 'POST',
                body: task,
            }),
        }),
        updateTask: builder.mutation<void, TaskRequestPayload>({
            // isDevEnabled is the Feature flag for status update based on task status. This flag is temporary and will be removed once the feature becomes stable.
            query: ({ task, id, isDevEnabled }: TaskRequestPayload) => ({
                url: isDevEnabled
                    ? `tasks/${id}?userStatusFlag=true`
                    : `tasks/${id}`,
                method: 'PATCH',
                body: task,
            }),
            invalidatesTags: (_result, _err, { id }) => [
                {
                    type: 'Tasks',
                    id,
                },
            ],
        }),
        assignTask: builder.mutation<AssignTaskPayload, AssignTaskPayload>({
            query: ({ taskId, assignee }: AssignTaskPayload) => ({
                url: `tasks/${taskId}`,
                method: 'PATCH',
                body: assignTaskReducerStateBuilder()({
                    assignee,
                }),
            }),
            invalidatesTags: (_result, _err, { taskId: id, assignee }) => [
                {
                    type: 'Tasks',
                    id,
                },
                {
                    type: 'Users',
                    id: assignee,
                },
            ],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetAllTasksQuery,
    useGetMineTasksQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useAssignTaskMutation,
} = tasksApi;
