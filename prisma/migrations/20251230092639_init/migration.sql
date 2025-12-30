-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "displayName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "country" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "autoplay" BOOLEAN NOT NULL DEFAULT true,
    "videoQuality" TEXT NOT NULL DEFAULT 'auto',
    "subtitlesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "subtitlesLanguage" TEXT NOT NULL DEFAULT 'en',
    "maturityRating" TEXT NOT NULL DEFAULT 'PG-13',
    "dataSaverMode" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 3600,
    "privacyShowProfile" BOOLEAN NOT NULL DEFAULT true,
    "privacyShowActivity" BOOLEAN NOT NULL DEFAULT false,
    "privacyAllowMessages" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "planType" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "billingCycle" TEXT DEFAULT 'monthly',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "isAutoRenew" BOOLEAN NOT NULL DEFAULT true,
    "isTrial" BOOLEAN NOT NULL DEFAULT false,
    "maxDevices" INTEGER NOT NULL DEFAULT 1,
    "maxProfiles" INTEGER NOT NULL DEFAULT 1,
    "canDownload" BOOLEAN NOT NULL DEFAULT false,
    "videoQuality" TEXT NOT NULL DEFAULT 'sd',
    "adsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "externalSubscriptionId" TEXT,
    "paymentMethod" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_statuses" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "reason" TEXT,
    "reasonDetail" TEXT,
    "actionedBy" TEXT,
    "actionedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "canLogin" BOOLEAN NOT NULL DEFAULT true,
    "canStream" BOOLEAN NOT NULL DEFAULT true,
    "canComment" BOOLEAN NOT NULL DEFAULT true,
    "canUpload" BOOLEAN NOT NULL DEFAULT false,
    "canMessage" BOOLEAN NOT NULL DEFAULT true,
    "canPurchase" BOOLEAN NOT NULL DEFAULT true,
    "requiresKyc" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isModerator" BOOLEAN NOT NULL DEFAULT false,
    "isContentCreator" BOOLEAN NOT NULL DEFAULT false,
    "isPremiumSupporter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_authUserId_key" ON "user_profiles"("authUserId");

-- CreateIndex
CREATE INDEX "user_profiles_authUserId_idx" ON "user_profiles"("authUserId");

-- CreateIndex
CREATE INDEX "user_profiles_isDeleted_idx" ON "user_profiles"("isDeleted");

-- CreateIndex
CREATE INDEX "user_profiles_createdAt_idx" ON "user_profiles"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userProfileId_key" ON "user_settings"("userProfileId");

-- CreateIndex
CREATE INDEX "user_settings_userProfileId_idx" ON "user_settings"("userProfileId");

-- CreateIndex
CREATE INDEX "user_settings_isDeleted_idx" ON "user_settings"("isDeleted");

-- CreateIndex
CREATE INDEX "subscriptions_userProfileId_idx" ON "subscriptions"("userProfileId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_planType_idx" ON "subscriptions"("planType");

-- CreateIndex
CREATE INDEX "subscriptions_endDate_idx" ON "subscriptions"("endDate");

-- CreateIndex
CREATE INDEX "subscriptions_isDeleted_idx" ON "subscriptions"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "user_statuses_userProfileId_key" ON "user_statuses"("userProfileId");

-- CreateIndex
CREATE INDEX "user_statuses_userProfileId_idx" ON "user_statuses"("userProfileId");

-- CreateIndex
CREATE INDEX "user_statuses_status_idx" ON "user_statuses"("status");

-- CreateIndex
CREATE INDEX "user_statuses_isDeleted_idx" ON "user_statuses"("isDeleted");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statuses" ADD CONSTRAINT "user_statuses_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
