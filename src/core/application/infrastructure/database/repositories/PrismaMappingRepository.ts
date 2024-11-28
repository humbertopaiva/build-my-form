/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/infrastructure/database/repositories/PrismaMappingRepository.ts
// import { PrismaClient } from "@prisma/client";
import { IMappingRepository } from "@/core/domain/repositories/IMappingRepository";
import { FieldMapping } from "@/core/domain/entities/FieldMapping";

export class PrismaMappingRepository implements IMappingRepository {
  constructor(private prisma: any) {}

  async create(mapping: Omit<FieldMapping, "id">): Promise<FieldMapping> {
    return this.prisma.fieldMapping.create({
      data: mapping,
    });
  }

  async createMany(
    mappings: Omit<FieldMapping, "id">[]
  ): Promise<FieldMapping[]> {
    const created = await this.prisma.fieldMapping.createMany({
      data: mappings,
    });

    return this.prisma.fieldMapping.findMany({
      where: {
        stepId: mappings[0].stepId,
      },
    });
  }

  async update(
    id: string,
    mapping: Partial<FieldMapping>
  ): Promise<FieldMapping> {
    return this.prisma.fieldMapping.update({
      where: { id },
      data: mapping,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.fieldMapping.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.fieldMapping.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findByStepId(stepId: string): Promise<FieldMapping[]> {
    return this.prisma.fieldMapping.findMany({
      where: { stepId },
    });
  }
}
