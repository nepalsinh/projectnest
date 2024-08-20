const express = require('express');
const auth = require('../middleware/auth.middleware');
const inviteController = require('../controllers/invite');

const router = express.Router();
router.use(auth);

router.get('/user/:userId', inviteController.getInvitesByUserId);
router.get('/project/:projectId', inviteController.getInvitesByProjectId);
router.post('/:id/accept', inviteController.acceptInvite);
router.post('/:id/reject', inviteController.rejectInvite);

module.exports = router;
