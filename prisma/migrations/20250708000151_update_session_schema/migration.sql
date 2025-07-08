/*
  Warnings:

  - You are about to drop the column `comprehensionScore` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `wordsRead` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `analysisType` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ai_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_analyses_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ai_analyses" ("analysis", "createdAt", "id", "sessionId") SELECT "analysis", "createdAt", "id", "sessionId" FROM "ai_analyses";
DROP TABLE "ai_analyses";
ALTER TABLE "new_ai_analyses" RENAME TO "ai_analyses";
CREATE TABLE "new_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "path" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_notes" ("content", "createdAt", "id", "metadata", "path", "updatedAt", "userId") SELECT "content", "createdAt", "id", "metadata", "path", "updatedAt", "userId" FROM "notes";
DROP TABLE "notes";
ALTER TABLE "new_notes" RENAME TO "notes";
CREATE UNIQUE INDEX "notes_userId_path_key" ON "notes"("userId", "path");
CREATE TABLE "new_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '새로운 읽기 세션',
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "readingSpeed" REAL NOT NULL DEFAULT 0,
    "comprehension" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "mcpNotePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sessions" ("createdAt", "duration", "id", "mcpNotePath", "updatedAt", "userId") SELECT "createdAt", "duration", "id", "mcpNotePath", "updatedAt", "userId" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
CREATE TABLE "new_training_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "exercises" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "training_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "training_plans_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_training_plans" ("createdAt", "description", "endDate", "exercises", "id", "isActive", "name", "startDate", "updatedAt", "userId") SELECT "createdAt", "description", "endDate", "exercises", "id", "isActive", "name", "startDate", "updatedAt", "userId" FROM "training_plans";
DROP TABLE "training_plans";
ALTER TABLE "new_training_plans" RENAME TO "training_plans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
