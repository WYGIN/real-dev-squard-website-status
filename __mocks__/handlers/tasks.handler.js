import { tasks, PAGINATED_TASKS, NEXT_PAGINATED_TASKS, MINE_TASKS } from '../db/tasks';
import usersData from '../../__mocks__/db/users';
import { rest } from 'msw';
import { TASK_ASSIGNED, TASK_NOT_FOUND, UNAUTHENTICATED, UNAUTHORIZED, USER_NOT_FOUND, USER_NOT_IDLE } from '@/constants/payload';
const URL = process.env.NEXT_PUBLIC_BASE_URL;

const taskHandlers = [
    rest.get(`${URL}/tasks`, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                message: 'Tasks returned successfully!',
                tasks: tasks,
            })
        );
    }),
    rest.patch(`${URL}/tasks/:taskId`, async (req, res, ctx) => {
        const { taskId } = req.params;
        const { assignee } = await req.json();
        const task = tasks.find(t => t.id === taskId);
        const user = usersData.find(u => u.username === assignee);
        if(!assignee) return res(
            ctx.status(204),
            ctx.delay(5000),
        );
        const currentUserResponse = await fetch(`${URL}/users/self`);
        if(!currentUserResponse.ok) return res(
            ctx.status(403),
            ctx.delay(100),
            ctx.json(UNAUTHENTICATED),
        );
        const currentUser = await currentUserResponse.json();
        if(!(currentUser.roles.super_user || currentUser.roles.app_owner)) return res(
            ctx.status(401),
            ctx.delay(100),
            ctx.json(UNAUTHORIZED),
        );
        if(!task) return res(
            ctx.status(404),
            ctx.delay(100),
            ctx.json(TASK_NOT_FOUND)
        );
        if(!user) return res(
            ctx.status(404),
            ctx.delay(100),
            ctx.json(USER_NOT_FOUND)  
        );
        if(user.status !== 'idle') return res(
            ctx.delay(100),
            ctx.status(404),
            ctx.json(USER_NOT_IDLE)
        );
        return res(
            ctx.json({ ...TASK_ASSIGNED, Id: taskId }),
        );
    }),
    rest.post(`${URL}/tasks`, async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.status(200),
            ctx.json({
                message: 'Task created successfully!',
                task: body,
            })
        );
    }),
];

export const failedGetTasksResponse = {
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
    statusCode: 500,
};

export const failedGetTasks = rest.get(`${URL}/tasks`, (_, res, ctx) => {
    return res(ctx.status(500), ctx.json(failedGetTasksResponse));
});

export const failedAddNewTaskResponse = {
    statusCode: 400,
    error: 'Bad Request',
    message: '"title" is required',
};

export const failedAddNewTaskHandler = rest.post(
    `${URL}/tasks`,
    (_, res, ctx) => {
        return res(ctx.status(400), ctx.json(failedAddNewTaskResponse));
    }
);

export const failedUpdateTaskResponse = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Task not found',
};

export const failedUpdateTaskHandler = rest.patch(
    `${URL}/tasks/:taskId`,
    (_, res, ctx) => {
        return res(ctx.status(404), ctx.json(failedUpdateTaskResponse));
    }
);

export const noTasksFoundResponse = {
    message: 'No Tasks Found',
    tasks: [],
    next: null,
    prev: null,
};

export const noTasksFoundHandler = rest.get(
    `${URL}/tasks`,
    (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(noTasksFoundResponse)
        );
    }
);

export const paginatedTasksHandler = [
    rest.get(`${URL}/tasks?status=AVAILABLE&dev=true`, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                PAGINATED_TASKS
            )
        );
    }),
    rest.patch(`${URL}/${PAGINATED_TASKS.next}`, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                NEXT_PAGINATED_TASKS
            )
        );
    }),
];

export const mineTasksHandler = [
    rest.get(`${URL}/tasks/self`, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                MINE_TASKS
            )
        );
    }),
];

export const failedGetMineTask= rest.get(`${URL}/tasks/self`, (_, res, ctx) => {
    return res(ctx.status(500), ctx.json(failedGetTasksResponse));
});

export const mineTasksNoDataFoundHandler = rest.get(
    `${URL}/tasks/self`,
    (_, res, ctx) => {
        return res(
            ctx.json({
                message: 'No Tasks Found',
                issues: [],
            })
        );
    }
);

export const mineTasksErrorHandler = rest.get(
    `${URL}/tasks/self`,
    (_, res, ctx) => {
        return res(
            ctx.status(500),
            ctx.json({
                message: 'Something went wrong! Please contact admin',
            })
        );
    }
);

export default taskHandlers;