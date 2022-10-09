-- DropIndex
DROP INDEX `Order_userId_status_idx` ON `Order`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `paymentMethod` ENUM('SOL', 'USDC') NOT NULL DEFAULT 'SOL';

-- CreateIndex
CREATE INDEX `Order_userId_status_transactionReferenceBase64_idx` ON `Order`(`userId`, `status`, `transactionReferenceBase64`);
