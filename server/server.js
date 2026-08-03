require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const activityRoutes = require('./routes/activities');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

const seedAdmin = async () => {
    try {
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.findOne({ username: 'admin' });
        }
        
        if (!adminUser) {
            await User.create({
                name: 'Admin',
                username: 'admin',
                email: 'admin@jigcks.com',
                password: 'admin123',
                role: 'admin',
                isFirstLogin: false,
                avatar: '#6C5CE7'
            });
            console.log('Admin account created! Username: admin | Password: admin123');
        } else {
            adminUser.username = 'admin';
            adminUser.password = 'admin123';
            adminUser.isFirstLogin = false;
            await adminUser.save();
            console.log('Admin account verified! Username: admin | Password: admin123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    seedAdmin();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
