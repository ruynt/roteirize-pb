-- Add Cloudinary image fields to tourist places and partner requests
ALTER TABLE "Place"
  ADD COLUMN "mainImageUrl" TEXT,
  ADD COLUMN "mainImagePublicId" TEXT,
  ADD COLUMN "galleryImageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "galleryImagePublicIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "PartnerRequest"
  ADD COLUMN "mainImageUrl" TEXT,
  ADD COLUMN "mainImagePublicId" TEXT,
  ADD COLUMN "galleryImageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "galleryImagePublicIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
