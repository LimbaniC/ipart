import prismaClient from '../prismaClient.js';

export const postTaskHandler = async (req, res) => {
    const { identity, problem, action, result, repetitions, date, timeSpent, started, completed, archived } = req.body;
    
    try {
        // Create individual entities first
        const sIdentity = await prismaClient.identity.create({
            data: { description: identity }
        });

        const sProblem = await prismaClient.problem.create({
            data: { description: problem }
        });
        
        const sAction = await prismaClient.action.create({
            data: { description: action }
        });

        const sResult = await prismaClient.result.create({
            data: { description: result }
        });

        // Create the task with references to the individual entities
        const task = await prismaClient.task.create({
            data: {
                identity,
                problem,
                action,
                result,
                repetitions: repetitions || 1,
                date: date || new Date().toISOString().slice(0, 10),
                timeSpent: timeSpent || 0,
                started: started || false,
                completed: completed || false,
                archived: archived || false,
                // Link to individual entities
                identityId: sIdentity.id,
                problemId: sProblem.id,
                actionId: sAction.id,
                resultId: sResult.id
            }
        });

        // Return the task with all its related entities
        const taskWithComponents = await prismaClient.task.findUnique({
            where: { id: task.id },
            include: {
                identityRef: true,
                problemRef: true,
                actionRef: true,
                resultRef: true
            }
        });

        res.json(taskWithComponents);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task and components' });
    }
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
    const { id, identity, problem, action, result, repetitions, date, timeSpent, started, completed, archived } = req.body;
    const task = await prismaClient.task.update({
        where: { id },
        data: {
            identity,
            problem,
            action,
            result,
            repetitions,
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
                    started: true,
                    startedAt: new Date()
                }
            });
        } else if (action === 'stop') {
            if (!task.started || !task.startedAt) {
                return res.status(400).json({ error: 'Timer not started' });
            }
            // Stop the timer and add time spent
            const currentTime = new Date();
            const timeSpentHours = (currentTime - new Date(task.startedAt)) / (1000 * 60 * 60); // Convert to hours
            
            updatedTask = await prismaClient.task.update({
                where: { id: parseInt(id) },
                data: {
                    started: false,
                    startedAt: null,
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

export const searchHandler = async (req, res) => {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
        return res.json({ tasks: [], identities: [], problems: [], actions: [], results: [] });
    }

    try {
        const searchTerm = query.trim();

        // Search in all models
        const [tasks, identities, problems, actions, results] = await Promise.all([
            // Search tasks
            prismaClient.task.findMany({
                where: {
                    OR: [
                        { identity: { contains: searchTerm, mode: 'insensitive' } },
                        { problem: { contains: searchTerm, mode: 'insensitive' } },
                        { action: { contains: searchTerm, mode: 'insensitive' } },
                        { result: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                take: 10
            }),
            
            // Search identities
            prismaClient.identity.findMany({
                where: {
                    description: { contains: searchTerm, mode: 'insensitive' }
                },
                take: 10
            }),
            
            // Search problems
            prismaClient.problem.findMany({
                where: {
                    description: { contains: searchTerm, mode: 'insensitive' }
                },
                take: 10
            }),
            
            // Search actions
            prismaClient.action.findMany({
                where: {
                    description: { contains: searchTerm, mode: 'insensitive' }
                },
                take: 10
            }),
            
            // Search results
            prismaClient.result.findMany({
                where: {
                    description: { contains: searchTerm, mode: 'insensitive' }
                },
                take: 10
            })
        ]);

        res.json({
            tasks,
            identities,
            problems,
            actions,
            results
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};




