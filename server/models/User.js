const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, lowercase: true, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'freelancer'], default: 'freelancer' },
    isFirstLogin: { type: Boolean, default: true },
    avatar: { type: String },
    sessionToken: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
