import prismaClient from '../prismaClient.js';

export const postTaskHandler = async (req, res) => {
    const { identity, problem, action, result, date, timeSpent, started, completed, archived } = req.body;
    const task = await prismaClient.task.create({
        data: {
            identity,
            problem,
            action,
            result,
            date,
            timeSpent: timeSpent || 0,
            started: started || false,
            completed: completed || false,
            archived: archived || false
        }});
        res.json(task);
};


export const getTaskHandler = async (req, res) => {
    const tasks = await prismaClient.task.findMany({
        orderBy: {
            date: 'desc'
        }
    });
    res.json(tasks);
};


export const updateTaskHandler = async (req, res) => {
    const { id, identity, problem, action, result, date, timeSpent, started, completed, archived } = req.body;
    const task = await prismaClient.task.update({
        where: { id },
        data: {
            identity,
            problem,
            action,
            result,
            date,
            timeSpent,
            started,
            completed,
            archived
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

// Timer controller for start/stop functionality
export const toggleTimerHandler = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'start' or 'stop'
    
    try {
        const task = await prismaClient.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        let updatedTask;
        
        if (action === 'start') {
            // Start the timer
            updatedTask = await prismaClient.task.update({
                where: { id: parseInt(id) },
                data: {
                    started: true
                }
            });
        } else if (action === 'stop') {
            // Stop the timer and add time spent
            const currentTime = new Date();
            const startTime = task.started ? new Date(task.date) : currentTime;
            const timeSpentHours = (currentTime - startTime) / (1000 * 60 * 60); // Convert to hours
            
            updatedTask = await prismaClient.task.update({
                where: { id: parseInt(id) },
                data: {
                    started: false,
                    timeSpent: task.timeSpent + timeSpentHours
                }
            });
        } else {
            return res.status(400).json({ error: 'Invalid action. Use "start" or "stop"' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Timer toggle error:', error);
        res.status(500).json({ error: 'Failed to toggle timer' });
    }
};




