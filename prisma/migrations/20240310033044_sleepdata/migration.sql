-- CreateTable
CREATE TABLE "EncryptedSleepData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "keyStr" TEXT NOT NULL,
    "ivStr" TEXT NOT NULL,

    CONSTRAINT "EncryptedSleepData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedSleepData_userId_date_key" ON "EncryptedSleepData"("userId", "date");

-- AddForeignKey
ALTER TABLE "EncryptedSleepData" ADD CONSTRAINT "EncryptedSleepData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
