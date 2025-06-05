import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true},
    phoneNumber: { type: String, unique: true},
    password: { type: String, required: true, minlength: 8},
    roles: [{ type: String, required: true, enum: ['manager', 'sales','accountant','inventory']}],
    avatar: { type: String, default: ''}
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;