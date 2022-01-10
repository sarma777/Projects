import { getConnection } from 'typeorm';
import { User } from '../entity/user';

export async function getUserRepository(repository: any) {
let getUserRepository = getConnection().getRepository(repository);
return getUserRepository;
}

export async function getUser(Email: string): Promise<User | undefined> {
let getUserRepository = getConnection().getRepository(User);
return getUserRepository.findOne({Email});
}