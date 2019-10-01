import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail";
import { createAndSetConfirmationLink } from "../utils/createAndSetConfirmationLink";

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello(): string {
        return "hello user";
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        const users = await User.find();

        return users;
    }

    @Mutation(() => User)
    async register(@Arg("input")
    {
        firstName,
        lastName,
        email,
        password
    }: RegisterInput): Promise<User> {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        }).save();

        const confirmationLink = await createAndSetConfirmationLink(user.id);
        await sendConfirmationEmail(email, confirmationLink);

        return user;
    }
}
