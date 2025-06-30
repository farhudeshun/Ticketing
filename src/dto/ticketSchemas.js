/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTicketDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - priority
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           example: "Issue with login"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: "Cannot log into the account with correct credentials"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *
 *     AssignToSupportDto:
 *       type: object
 *       required:
 *         - supportId
 *       properties:
 *         supportId:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *
 *     AdminUpdateTicketDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated issue title"
 *         description:
 *           type: string
 *           example: "Updated detailed description"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         status:
 *           type: string
 *           enum: [open, in-progress, closed]
 *           example: in-progress
 *         supportId:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *
 *     UpdateUserRoleDto:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           example: support
 *
 *     UpdateTicketStatusDto:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [open, in-progress, closed]
 *           example: in-progress
 *
 *     Ticket:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         title:
 *           type: string
 *           example: "Issue with login"
 *         description:
 *           type: string
 *           example: "Cannot log into the account with correct credentials"
 *         status:
 *           type: string
 *           enum: [open, in-progress, closed]
 *           example: open
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         user:
 *           type: string
 *           example: "60d0fe4f5311236168a109cb"
 *         support:
 *           type: string
 *           example: "60d0fe4f5311236168a109cc"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-30T09:00:00Z"
 *
 *     RegisterUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: StrongPassword123
 */
