const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  reporter: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
