/*
  Warnings:

  - You are about to drop the column `variableName` on the `FieldCondition` table. All the data in the column will be lost.
  - You are about to drop the column `useStepData` on the `Webhook` table. All the data in the column will be lost.
  - Added the required column `variablePath` to the `FieldCondition` table without a default value. This is not possible if the table is not empty.
  - Made the column `authType` on table `Webhook` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FieldCondition" DROP COLUMN "variableName",
ADD COLUMN     "variablePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Webhook" DROP COLUMN "useStepData",
ADD COLUMN     "selectedFields" JSONB,
ADD COLUMN     "variables" JSONB,
ALTER COLUMN "authType" SET NOT NULL,
ALTER COLUMN "authType" SET DEFAULT 'none';
