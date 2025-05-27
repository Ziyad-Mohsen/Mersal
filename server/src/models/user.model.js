import mongoose from "mongoose";

const profilePicSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: profilePicSchema,
      default: {
        url: "",
        publicId: "",
      },
    },
    posts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Post",
      default: [],
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("postsCount").get(function () {
  return this.posts?.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.following?.length;
});

userSchema.virtual("followersCount").get(function () {
  return this.followers?.length;
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret._id;
    ret.id = doc._id.toString();

    return ret;
  },
});
userSchema.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret._id;
    ret.id = doc._id.toString();

    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
