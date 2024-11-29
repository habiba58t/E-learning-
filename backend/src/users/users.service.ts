import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './users.schema';
import { createDto } from './dto/createuser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) {}

  async findOneByUsername(username: string): Promise<UserDocument | null> {
    console.log(`Searching for user with username: ${username}`);
    return this.userModel.findOne({ username }).exec();
  }
  

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec(); // Fixed method name to camelCase
  }

  async create(userData: createDto): Promise<UserDocument> {
    // Check if the email or username already exists
    const existingUser = await this.userModel.findOne({
        $or: [{ email: userData.email }, { username: userData.username }],
    }).exec();

    if (existingUser) {
        throw new ConflictException('Email or Username already exists');
    }

    const newUser = new this.userModel(userData);
    return await newUser.save();
}


  async findAll(): Promise<Users[]> {
    return this.userModel.find().exec();
  }
}
