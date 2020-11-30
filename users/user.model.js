const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    role: { type: String, required: false },
    clientIp: { type: String, required: false },
    lastName: { type: String, required: true },
    loginTime: { type: Date, required: false },
    logoutTime: { type: Date, required: false },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserList', schema);