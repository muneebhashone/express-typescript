import { omit } from "lodash";
import { nanoid } from "nanoid";
import Ctx from "../types/context.type";
import {
  CreateUserInput,
  ConfirmUserInput,
  LoginInput,
  UpdateUserInput,
} from "./user.schema";
import { UserModel } from "./user.schema";
import { signJwt } from "../utils/jwt.utils";
import { CookieOptions } from "express";
import { comparePassword } from "../utils/authUtils";

const cookieOptions: CookieOptions = {
  domain: "localhost", // <- Change to your client domain
  secure: false, // <- Should be true if !development
  sameSite: "strict",
  httpOnly: true,
  path: "/",
};

export class UserService {
  constructor(private userModel = UserModel) {}

  async findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    return this.userModel.findById(id);
  }

  async createUser(input: CreateUserInput) {
    return this.userModel.create(input);
  }

  async confirmUser({ email, confirmToken }: ConfirmUserInput) {
    // find our user
    const user = await this.userModel.findOne({ email });
    // Check if the user exists
    // Check if the confirmation tokens === confirmToken
    if (!user || confirmToken !== user.confirmToken) {
      throw new Error("Email or confirm token are incorrect");
    }

    // change active to true
    user.active = true;

    // save the user
    await user.save();

    // return user
    return user;
  }

  async login({ email, password }: LoginInput, context: Ctx) {
    // Find our user
    const user = await this.userModel
      .findOne({ email })
      .select("-__v -confirmToken");

    // Check that user exists
    // Compare input password with the user's hashed password
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    // Check that the user is active
    // if (!user.active) {
    //   throw new Error('Please confirm your email address');
    // }
    // Create a JWT
    const jwt = signJwt(omit(user.toJSON(), ["password", "active"]));

    // Set the JWT in a cookie
    context.res.cookie("token", jwt, cookieOptions);

    // return the user
    return { ...user.toJSON(), token: jwt };
  }

  async loginOrSignUpWithGoogle(
    { email, input }: { email: string; input: CreateUserInput },
    context: Ctx
  ) {
    const user = await this.userModel
      .findOne({ email })
      .select("-__v -confirmToken");

    if (!user) {
      const newUser = await this.createUser({
        ...input,
      });

      const jwt = signJwt(omit(newUser.toJSON(), ["password", "active"]));

      context.res.cookie("token", jwt, cookieOptions);

      return { ...newUser.toJSON(), token: jwt };
    }

    const jwt = signJwt(omit(user.toJSON(), ["password", "active"]));

    context.res.cookie("token", jwt, cookieOptions);

    // return the user
    return { ...user.toJSON(), token: jwt };
  }

  async updateUser(userId: string, input: UpdateUserInput) {
    return this.userModel.findOneAndUpdate({ _id: userId }, input, {
      new: true,
    });
  }

  async logout(context) {
    context.res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
    return null;
  }
}
