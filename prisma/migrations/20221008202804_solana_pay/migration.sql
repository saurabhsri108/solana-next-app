-- DropIndex
DROP INDEX `Order_userId_status_key` ON `Order`;

-- CreateIndex
CREATE INDEX `Order_userId_status_idx` ON `Order`(`userId`, `status`);
