import bcrypt from 'bcryptjs';
import db from '../_helpers/db';
import { Model } from 'sequelize';


interface UserAttributes {
    id?: number;
    email: string;
    passwordHash: string;
    username?: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
}

interface UserParams extends Partial<UserAttributes> {
    password?: string;
}

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(): Promise<Model<UserAttributes>[]> {
    return await db.User.findAll();
}

async function getById(id: number): Promise<Model<UserAttributes>> {
    return await getUser(id);
}

async function create(params: UserParams): Promise<void> {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);

    // hash password
    if (params.password) {
        user.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await user.save();
}

async function update(id: number, params: UserParams): Promise<void> {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && (user.get('username') as string) !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id: number): Promise<void> {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id: number): Promise<Model<UserAttributes>> {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}