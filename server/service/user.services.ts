import userModel from "../model/user.model"
import { UserInterface } from "../types";

export const getAllUsers = async (): Promise<UserInterface[]> => {
    const allUsers = await userModel.find();

    return allUsers;
}

//delete user
export const deleteUser  = async (id: any) => {
    await userModel.deleteOne(id)
}

