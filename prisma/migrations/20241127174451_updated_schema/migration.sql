-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "helpText" TEXT,
ADD COLUMN     "visibility" JSONB;

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "endpoint" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "webhookData" JSONB;

-- CreateTable
CREATE TABLE "StepVariable" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "StepVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldCondition" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "variableName" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "FieldCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepCondition" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "variableName" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "StepCondition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmissionField" ADD CONSTRAINT "SubmissionField_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepVariable" ADD CONSTRAINT "StepVariable_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "FormStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldCondition" ADD CONSTRAINT "FieldCondition_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepCondition" ADD CONSTRAINT "StepCondition_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "FormStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
