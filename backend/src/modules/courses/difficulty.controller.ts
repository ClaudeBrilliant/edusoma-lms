import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@Controller('difficulties')
export class DifficultyController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async findAll() {
    const difficulties = await this.prisma.difficultyLevel.findMany({
      select: { id: true, name: true }
    });
    if (!difficulties.length) {
      return {
        success: true,
        data: [],
        message: 'No difficulty levels found. Please seed the database.'
      };
    }
    return {
      success: true,
      data: difficulties
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() body: { name: string }) {
    return this.prisma.difficultyLevel.create({ data: { name: body.name } });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.prisma.difficultyLevel.update({ where: { id }, data: { name: body.name } });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.prisma.difficultyLevel.delete({ where: { id } });
  }
} 