const express = require('express');
const auth = require('../middleware/auth.middleware');
const taskController = require('../controllers/task');

const router = express.Router();
router.use(auth);

router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/project/:id', taskController.getTasksByProjectId);
router.get('/user/:id', taskController.getTasksByUserId);
router.get('/user/:userId/project/:projectId', taskController.getTasksByUserIdAndProjectId);

module.exports = router;
