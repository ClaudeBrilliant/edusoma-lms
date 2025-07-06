import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, User } from '@prisma/client';
import {
  CourseWithInstructor,
  CourseWithCounts,
  CourseWithModules,
  CourseWithEnrollments,
  CourseSearchResult,
} from './interfaces';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCourseDto: CreateCourseDto,
    instructor: User,
  ): Promise<CourseWithInstructor> {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        instructorId: instructor.id,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
      },
    });
  }

  async findAll(): Promise<CourseWithCounts[]> {
    return this.prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<CourseWithModules> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        modules: {
          include: {
            materials: true,
            _count: {
              select: {
                materials: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    user: User,
  ): Promise<CourseWithInstructor> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructor: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Only instructor or admin can update the course
    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own courses');
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
      },
    });
  }

  async remove(id: string, user: User): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructor: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Only instructor or admin can delete the course
    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.prisma.course.delete({
      where: { id },
    });
  }

  async findInstructorCourses(instructorId: string): Promise<CourseWithCounts[]> {
    return this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findEnrolledCourses(userId: string): Promise<CourseWithEnrollments[]> {
    return this.prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            userId,
          },
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        enrollments: {
          where: { userId },
          include: {
            progress: true,
          },
        },
        _count: {
          select: {
            modules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async searchCourses(query: string): Promise<CourseSearchResult[]> {
    // Search by title, description, category name, or difficulty name
    return this.prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
          { difficulty: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCoursesByCategory(categoryId: string): Promise<CourseSearchResult[]> {
    return this.prisma.course.findMany({
      where: { categoryId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCoursesByDifficulty(difficultyId: string): Promise<CourseSearchResult[]> {
    return this.prisma.course.findMany({
      where: { difficultyId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        difficulty: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPublicCourses(category?: string, difficulty?: string) {
    return this.prisma.course.findMany({
      where: {
        ...(category ? { categoryId: category } : {}),
        ...(difficulty ? { difficultyId: difficulty } : {}),
      },
      include: {
        instructor: {
          select: { id: true, name: true },
        },
        category: true,
        difficulty: true,
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
