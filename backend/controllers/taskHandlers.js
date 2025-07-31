import prismaClient from '../prismaClient.js';

export const postTaskHandler = async (req, res) => {
    const { identity, problem, action, result, time, completed } = req.body;
    const task = await prismaClient.task.create({
        data: {
            identity,
            problem,
            action,
            result,
            time,
            completed: completed || false
        }});
        res.json(task);
};


export const getTaskHandler = async (req, res) => {
    const tasks = await prismaClient.task.findMany({
        orderBy: {
            time: 'desc'
        }
    });
    res.json(tasks);
};


export const updateTaskHandler = async (req, res) => {
    const { id, identity, problem, action, result, time, completed } = req.body;
    const task = await prismaClient.task.update({
        where: { id },
        data: {
            identity,
            problem,
            action,
            result,
            time,
            completed
        }
    });
    res.json(task);
};

export const deleteTaskHandler = async (req, res) => {
    const { id } = req.params;
    try {
        await prismaClient.task.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Task not found' });
    }
};




