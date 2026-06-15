-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('VIEW', 'DETAIL_OPENED', 'SELECT', 'UNSELECT', 'CHECKIN', 'CHECKIN_REMOVED', 'ITINERARY_SAVED');

-- CreateTable
CREATE TABLE "UserPlaceInteraction" (
    "id" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "anonymousId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "placeId" TEXT,

    CONSTRAINT "UserPlaceInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPlaceInteraction_userId_createdAt_idx" ON "UserPlaceInteraction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserPlaceInteraction_anonymousId_createdAt_idx" ON "UserPlaceInteraction"("anonymousId", "createdAt");

-- CreateIndex
CREATE INDEX "UserPlaceInteraction_placeId_createdAt_idx" ON "UserPlaceInteraction"("placeId", "createdAt");

-- CreateIndex
CREATE INDEX "UserPlaceInteraction_type_createdAt_idx" ON "UserPlaceInteraction"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "UserPlaceInteraction" ADD CONSTRAINT "UserPlaceInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlaceInteraction" ADD CONSTRAINT "UserPlaceInteraction_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
