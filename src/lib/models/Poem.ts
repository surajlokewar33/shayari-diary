import mongoose, { Schema, models, model } from 'mongoose';

export const CATEGORIES = [
  'Urdu Shayari',
  'Hindi Poems',
  'Marathi',
  'Ghazal',
  'Nazm',
  'Sher',
  'Video',
  'Others',
] as const;

const CommentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const PoemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    body: { type: String, required: true },
    language: {
      type: String,
      enum: ['English', 'Hindi', 'Urdu', 'Marathi'],
      default: 'Hindi',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    tags: { type: [String], default: [] },
    author: { type: String, default: 'Anonymous' },
    audioUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    ambience: {
      type: String,
      enum: ['petals', 'rain', 'stars', 'fireflies', 'smoke', 'none'],
      default: 'petals',
    },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    scheduledAt: { type: Date, default: null },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

PoemSchema.index(
  { title: 'text', body: 'text', tags: 'text' },
  { language_override: 'lang_override_unused' }
);

export type PoemDoc = mongoose.InferSchemaType<typeof PoemSchema> & { _id: mongoose.Types.ObjectId };

const PoemModel: mongoose.Model<any> = models.Poem || model('Poem', PoemSchema);
export default PoemModel;