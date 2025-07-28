import prismaClient from '../prismaClient.js';

export const postTaskHandler = async (req, res) => {
    const { identity, problem, action, result, time } = req.body;
    const task = await prismaClient.task.create({
        data: {
            identity,
            problem,
            action,
            result,
            time
        }});
        res.json(task);
};


export const getTaskHandler = async (req, res) => {
    const tasks = await prismaClient.task.findMany();
    res.json(tasks);
};


export const updateTaskHandler = async (req, res) => {
    const { id, identity, problem, action, result, time } = req.body;
    const task = await prismaClient.task.update({
        where: { id },
        data: {
            identity,
            problem,
            action,
            result,
            time
        }
    });
    res.json(task);
};




