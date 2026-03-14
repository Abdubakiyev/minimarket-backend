-- CreateTable
CREATE TABLE "Qarzdor" (
    "id" SERIAL NOT NULL,
    "kim" TEXT NOT NULL,
    "umumiyQarz" DOUBLE PRECISION NOT NULL,
    "tolangan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qoliqQarz" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QARZDOR',
    "izoh" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Qarzdor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tolov" (
    "id" SERIAL NOT NULL,
    "miqdor" DOUBLE PRECISION NOT NULL,
    "sana" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "izoh" TEXT,
    "qarzdorId" INTEGER NOT NULL,

    CONSTRAINT "Tolov_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tolov" ADD CONSTRAINT "Tolov_qarzdorId_fkey" FOREIGN KEY ("qarzdorId") REFERENCES "Qarzdor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
