const express = require('express');
const auth = require('../middleware/auth.middleware');
const projectController = require('../controllers/project');

const router = express.Router();

router.use(auth);
router.get('/user/:id', projectController.getProjectsByuserId);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete(':id', projectController.deleteProject);
router.post('/:id/addmember', projectController.addMember);
router.post('/:id/removemember', projectController.removeMemeber);
router.post('/:id/makemanager', projectController.makeManager);
router.post('/:id/removemanager', projectController.removedManager);

module.exports = router;