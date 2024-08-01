import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadFile from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const Register = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (fullname == "" || email == "" || username == "" || password == "") {
    throw new ApiError(400, "Enter All fields");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) throw new ApiError(409, "User already exist");
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");
  const avatarPath = await uploadFile(avatarLocalPath);
  const newUser = await User.create({
    fullname,
    email,
    password,
    username,
    avatar: avatarPath.url,
  });
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { Register };
