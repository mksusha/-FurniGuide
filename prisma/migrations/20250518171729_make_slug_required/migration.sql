/*
  Warnings:

  - Made the column `slug` on table `Author` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "slug" SET NOT NULL;
