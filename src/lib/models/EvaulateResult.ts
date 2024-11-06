import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EvaluateResult = new Schema({
  id: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  hasError: {
    type: Boolean,
    required: true
  },
  executedCode: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export type EvaluateResultType = mongoose.InferSchemaType<typeof EvaluateResult>;

export default mongoose.model('EvaluateResults', EvaluateResult);