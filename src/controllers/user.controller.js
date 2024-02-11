import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { upoloadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log(email);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "fullname is required");
  }
  const existedUser = User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath || !coverImageLocalPath) {
    throw new ApiError(400, "avatar and cover image are required");
  }
  const avtar = await upoloadOnCloudinary(avatarLocalPath);
  const coverImage = await upoloadOnCloudinary(coverImageLocalPath);

  if (!avatar || !coverImage) {
    throw new ApiError(400, "failed to upload image");
  }
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avtar.url,
    coverImage: coverImage.url,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "failed to create user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user created successfully"));
});

export { registerUser };
