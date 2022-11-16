import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  prop,
  getModelForClass,
  modelOptions,
  index,
  pre,
} from "@typegoose/typegoose";
import { IsIn, IsEmail, IsOptional, IsAlphanumeric } from "class-validator";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

@ObjectType()
@pre<User>("save", async function (next) {
  // Check if the password has been modified
  if (!this.isModified("password")) return next();

  // Hash password with strength of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
})
@modelOptions({ schemaOptions: { timestamps: true } })
@index({ email: 1 })
export class User {
  @Field() //<- GraphQL
  _id: string; //<- TypeScript

  @Field()
  @prop({ required: true, unique: true })
  email: string;

  @Field()
  @prop({ required: true, unique: true })
  username: string;

  @Field({ nullable: true })
  @prop()
  avatar: string;

  @Field({ nullable: true })
  @prop({ required: true, default: () => "email" })
  accountType: string;

  @Field()
  @prop({ required: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @prop()
  password: string;

  @prop({ default: () => false })
  active: boolean;

  @prop({ default: () => nanoid(32) })
  confirmToken: string;
}

@ObjectType()
export class UserLogin extends User {
  @Field()
  token: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @IsAlphanumeric()
  @Field()
  username: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  password: string;

  @IsIn(["email", "facebook", "google", "phone"])
  @Field()
  accountType: string;

  @Field({ nullable: true })
  confirmPassword: string;
}

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @Field()
  firstName: string;

  @IsOptional()
  @Field({ nullable: true })
  lastName: string;

  @IsOptional()
  @IsEmail()
  @Field()
  email: string;

  @IsOptional()
  @IsAlphanumeric()
  @Field()
  username: string;

  @IsOptional()
  @Field({ nullable: true })
  avatar: string;

  @IsOptional()
  @IsIn(["email", "facebook", "google", "phone"])
  @Field()
  accountType: string;
}

@InputType()
export class ConfirmUserInput {
  @Field()
  email: string;

  @Field()
  confirmToken: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

export const UserModel = getModelForClass(User);
