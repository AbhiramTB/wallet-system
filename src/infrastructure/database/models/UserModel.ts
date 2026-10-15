import mongoose, { type HydratedDocument, type Model } from "mongoose";

export interface UserPersistence {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserPersistence>;

const userSchema = new mongoose.Schema<UserPersistence>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true },
);

const existingUserModel = mongoose.models.User as Model<UserPersistence> | undefined;

export const UserModel: Model<UserPersistence> =
  existingUserModel ?? mongoose.model<UserPersistence>("User", userSchema);
