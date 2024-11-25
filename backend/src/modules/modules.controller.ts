
import { ModulesService } from './modules.service';
import * as mongoose from 'mongoose';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Module } from './modules.schema';


@Controller('modules')

export class ModulesController {
constructor(private readonly modulesService: ModulesService) {}


@Get()
  async findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  
  }


  @Get(':ObjectId')
  async findOne(@Param('ObjectId') ObjectId: mongoose.Schema.Types.ObjectId): Promise<Module> {
    return this.modulesService.findOne(ObjectId);
  }





}

