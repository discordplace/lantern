import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
  id: {
    type: String,
    required: true
  }
}, {
  versionKey: false
});

export type UserType = mongoose.InferSchemaType<typeof User>;

export default mongoose.model('Users', User);