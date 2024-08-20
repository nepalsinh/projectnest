const connectDB = require('./db');
const express = require('express');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const taskRouter = require('./routes/task');
const inviteRouter = require('./routes/invite');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(cors({
    origin: true,
}))

app.use(express.json());
app.use((req, res, next) => {
    console.log(`Request ${req.method} - ${req.url}`);
    next();
});
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/invites', inviteRouter);


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port : ${process.env.PORT}`);
        })
    })
