/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: newuser@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: StrongPass123
 *         role:
 *           type: string
 *           example: user
 *
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: updateduser@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: NewStrongPass123
 *         role:
 *           type: string
 *           example: admin
 */
