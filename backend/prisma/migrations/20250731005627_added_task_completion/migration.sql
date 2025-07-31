-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "identity" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
