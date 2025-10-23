CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL
);

INSERT INTO
    `users` (
        `id`,
        `email`,
        `password_hash`,
        `createdAt`,
        `updatedAt`
    )
VALUES (
        2,
        'matiasborsatto123@hotmail.com',
        '$2b$10$8b7CYR4/Kt/2Zr1EA708cOzcVrEpkzRvW4JIcIBBrT30TnB2Cj9gC',
        '2025-10-20 00:07:23',
        '2025-10-20 00:07:23'
    ),
    (
        3,
        'matiasborsatto1@gmail.com',
        '$2b$10$IaplbxODgoZpgwTtOEvjIOibg15/0iNn6BffwmqFcnmTKWsP8qpgu',
        '2025-10-21 20:18:53',
        '2025-10-21 20:18:53'
    );