/*
  Warnings:

  - You are about to drop the column `formId` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `endpoint` on the `Form` table. All the data in the column will be lost.
  - Added the required column `stepId` to the `Field` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_formId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionField" DROP CONSTRAINT "SubmissionField_fieldId_fkey";

-- AlterTable: Modify the "Field" table
ALTER TABLE "Field"
    DROP COLUMN "formId",
    ADD COLUMN "options" JSONB,
    ADD COLUMN "stepId" TEXT NOT NULL;

-- AlterTable: Modify the "Form" table
ALTER TABLE "Form"
    DROP COLUMN "endpoint";

-- CreateTable: Create the "FormStep" table
CREATE TABLE "FormStep" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "FormStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Create the "Webhook" table
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "headers" JSONB,
    "authType" TEXT,
    "authValue" TEXT,
    "useStepData" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Create the "FieldMapping" table
CREATE TABLE "FieldMapping" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "sourceFieldId" TEXT NOT NULL,
    "targetFieldId" TEXT NOT NULL,
    "transform" TEXT,

    CONSTRAINT "FieldMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Add a unique index to the "Webhook" table
CREATE UNIQUE INDEX "Webhook_stepId_key" ON "Webhook"("stepId");

-- AddForeignKey: Add foreign keys to "FormStep"
ALTER TABLE "FormStep"
    ADD CONSTRAINT "FormStep_formId_fkey"
    FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Add foreign keys to "Field"
ALTER TABLE "Field"
    ADD CONSTRAINT "Field_stepId_fkey"
    FOREIGN KEY ("stepId") REFERENCES "FormStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Add foreign keys to "Webhook"
ALTER TABLE "Webhook"
    ADD CONSTRAINT "Webhook_stepId_fkey"
    FOREIGN KEY ("stepId") REFERENCES "FormStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Add foreign keys to "FieldMapping"
ALTER TABLE "FieldMapping"
    ADD CONSTRAINT "FieldMapping_stepId_fkey"
    FOREIGN KEY ("stepId") REFERENCES "FormStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FieldMapping"
    ADD CONSTRAINT "FieldMapping_sourceFieldId_fkey"
    FOREIGN KEY ("sourceFieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FieldMapping"
    ADD CONSTRAINT "FieldMapping_targetFieldId_fkey"
    FOREIGN KEY ("targetFieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
