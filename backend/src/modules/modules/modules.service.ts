import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { User, Role, Module } from '@prisma/client';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    courseId: string,
    dto: CreateModuleDto,
    user: User,
  ): Promise<Module> {
    // Only instructor of the course or admin can add modules
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You can only add modules to your own courses',
      );
    }
    // Set order if not provided
    let order = dto.order;
    if (order === undefined) {
      const count = await this.prisma.module.count({ where: { courseId } });
      order = count + 1;
    }
    return this.prisma.module.create({
      data: {
        ...dto,
        description: dto.description ?? '',
        order,
        courseId,
      },
    });
  }

  async findByCourse(courseId: string): Promise<Module[]> {
    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async update(
    moduleId: string,
    dto: UpdateModuleDto,
    user: User,
  ): Promise<Module> {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');
    if (module.course.instructorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own modules');
    }
    return this.prisma.module.update({
      where: { id: moduleId },
      data: {
        ...dto,
        description: dto.description ?? module.description,
      },
    });
  }

  async remove(moduleId: string, user: User): Promise<void> {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');
    if (module.course.instructorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own modules');
    }
    await this.prisma.module.delete({ where: { id: moduleId } });
  }

  async getMaterialsForModule(moduleId: string) {
    return this.prisma.material.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
  }

  async getModuleById(id: string) {
    return this.prisma.module.findUnique({ where: { id } });
  }
}
