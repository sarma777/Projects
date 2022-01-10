import { users } from "../types/user";
import { User } from '../entity/user';
import { getConnection } from 'typeorm';


// For checking a email
export async function checkUserEmail (Email: string): Promise<User | undefined> {
  let getUserRepository = getConnection().getRepository(User);
  return getUserRepository.findOne({Email});
}
// For reregistering deleted user
export async function reRegisterDeletedUser (Email: string, userDetails: users): Promise<User | undefined> {
let getUserRepository = getConnection().getRepository(User);
let updateUser = await getUserRepository.findOne({Email});
updateUser!.First_name = userDetails.First_name;
updateUser!.Last_name = userDetails.Last_name;
updateUser!.Phone = userDetails.Phone;
updateUser!.Password = userDetails.Password!;
updateUser!.isArchived = 0;
return getUserRepository.save(updateUser!);
}
// For inserting new user
export async function registerUser (userDetails: users): Promise<User | undefined> {
let getUserRepository = getConnection().getRepository(User);
 return getUserRepository.save(userDetails);
}
// For updating the information
export async function updatingUser (userData: users, Email: string): Promise<User | undefined> {
  
  let getUserRepository = getConnection().getRepository(User);
  let updateUser = await getUserRepository.findOne({Email, isArchived: 0});
  updateUser!.First_name = userData.First_name;
  updateUser!.Last_name = userData.Last_name;
  updateUser!.Phone = userData.Phone;
  updateUser!.Password = userData.Password!;
  return getUserRepository.save(updateUser!);
}
// For deleting user
export async function deletingUser (Email: string): Promise<User | undefined> {
  let getUserRepository = getConnection().getRepository(User);
  let updateUser = await getUserRepository.findOne({Email});
  updateUser!.isArchived = 1;
  return getUserRepository.save(updateUser!);
}
