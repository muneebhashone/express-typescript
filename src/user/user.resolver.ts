import { Arg, Mutation, Resolver, Query, Ctx } from "type-graphql";
import {
  ConfirmUserInput,
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  User,
  UserLogin,
} from "./user.schema";
import { UserService } from "./user.service";
import type CtxType from "../types/context.type";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async registerUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  async confirmUser(@Arg("input") input: ConfirmUserInput) {
    return this.userService.confirmUser(input);
  }

  @Mutation(() => User)
  async loginOrSignUpWithGoogle(
    @Arg("input") input: CreateUserInput,
    @Arg("email") email: string,
    @Ctx() context: CtxType
  ) {
    return this.userService.loginOrSignUpWithGoogle({ email, input }, context);
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("input") input: UpdateUserInput,
    @Ctx() context: CtxType
  ) {
    return this.userService.updateUser(context.req.user._id, input);
  }

  @Query(() => UserLogin, { nullable: true })
  async login(@Arg("input") input: LoginInput, @Ctx() context: CtxType) {
    return this.userService.login(input, context);
  }

  @Query(() => User)
  async getProfile(@Ctx() context: CtxType) {
    return this.userService.findOne(String(context.req.user._id));
  }

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: CtxType) {
    return context.req.user;
  }

  @Query(() => User, { nullable: true })
  async logout(@Ctx() context: CtxType) {
    return this.userService.logout(context);
  }
}
