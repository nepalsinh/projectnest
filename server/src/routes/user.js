const express = require('express');
const protect = require('../middleware/auth.middleware');
const userController = require('../controllers/user');
const router = express.Router();

router.use(protect);

router.get('/', userController.searchUsers);
router.get('/:username', userController.getUserByUsername);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;