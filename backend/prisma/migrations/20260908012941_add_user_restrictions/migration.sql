-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "account_status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "preferred_currency" TEXT NOT NULL DEFAULT 'USD',
    "transfer_restricted" BOOLEAN NOT NULL DEFAULT false,
    "withdrawal_restricted" BOOLEAN NOT NULL DEFAULT false,
    "deposit_restricted" BOOLEAN NOT NULL DEFAULT false,
    "restriction_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_login" DATETIME
);
INSERT INTO "new_users" ("account_number", "account_status", "created_at", "email", "first_name", "id", "last_login", "last_name", "password", "phone", "preferred_currency", "role", "updated_at") SELECT "account_number", "account_status", "created_at", "email", "first_name", "id", "last_login", "last_name", "password", "phone", "preferred_currency", "role", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_account_number_key" ON "users"("account_number");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_account_number_idx" ON "users"("account_number");
CREATE INDEX "users_role_idx" ON "users"("role");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
