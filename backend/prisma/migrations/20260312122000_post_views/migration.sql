-- Add a persisted view counter that receives periodic Redis flushes.
ALTER TABLE "Post"
ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;
