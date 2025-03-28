/*
  Warnings:

  - You are about to drop the column `date` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `event` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Booking_eventId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_serviceId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Event_managerId_fkey` ON `event`;

-- DropIndex
DROP INDEX `Feedback_eventId_fkey` ON `feedback`;

-- DropIndex
DROP INDEX `Feedback_userId_fkey` ON `feedback`;

-- DropIndex
DROP INDEX `Payment_bookingId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `Service_categoryId_fkey` ON `service`;

-- DropIndex
DROP INDEX `Service_providerId_fkey` ON `service`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `date`,
    DROP COLUMN `duration`,
    ADD COLUMN `end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
