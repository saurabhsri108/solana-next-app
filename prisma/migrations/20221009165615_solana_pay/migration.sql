-- DropIndex
DROP INDEX `Order_userId_status_transactionReferenceBase64_idx` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `transactionReferenceBase64` MEDIUMTEXT NULL;

-- CreateIndex
CREATE INDEX `Order_userId_status_idx` ON `Order`(`userId`, `status`);
