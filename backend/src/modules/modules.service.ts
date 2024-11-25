import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module } from './modules.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ModulesService {
    constructor(@InjectModel(Module.name) private moduleModel: Model<Module>) {}

    async findAll(): Promise<Module[]> {
        return this.moduleModel.find().exec();
      }


      async findOne(moduleId: mongoose.Schema.Types.ObjectId): Promise<Module> {
        const module = await this.moduleModel.findById(moduleId).exec();
        if (!module) {
          throw new NotFoundException(`Module with Object id ${moduleId} not found`);
        }
        return module;
      }





}
