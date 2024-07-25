const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: [{
    food_target: String,
    display_name: String,
    reason: String
  }],
  queries: [
    {
      query_type: String,
      query:String,
      has_flag: Boolean,
      results: [{allergen: String, ingredients: [String]}],
      date: Date
    }
  ]
});

// Save the hashed password before saving the model to the database
UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;