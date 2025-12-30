import { Router } from 'express'
import { param, body, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { unprocessableEntity, notFound } from '../middleware/errorHandler.js'
import {
    getConversations,
    getMessagesBetweenUsers,
    sendMessage,
    getUnreadCount,
} from '../services/database/messages.js'
import { query } from '../config/database.js'

const router = Router()

/**
 * Validation middleware
 */
function handleValidationErrors(req: any, _res: any, next: any) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw unprocessableEntity(errors.array()[0].msg)
    }
    next()
}

/**
 * GET /api/messages
 * Get all conversations for current user
 */
router.get('/', authenticate, async (req: any, res: any, next: any) => {
    try {
        const conversations = await getConversations(req.user!.userId)
        const unreadTotal = await getUnreadCount(req.user!.userId)

        res.json({
            conversations,
            unreadTotal,
        })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /api/messages/:partnerId
 * Get message history with a specific user
 */
router.get(
    '/:partnerId',
    authenticate,
    [
        param('partnerId').isUUID().withMessage('Invalid partner ID'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const messages = await getMessagesBetweenUsers(
                req.user!.userId,
                req.params.partnerId
            )

            // Get partner info
            const partnerResult = await query(
                `SELECT company_name, email FROM users WHERE id = $1`,
                [req.params.partnerId]
            )

            if (partnerResult.rows.length === 0) {
                throw notFound('User not found')
            }

            res.json({
                partner: {
                    id: req.params.partnerId,
                    companyName: partnerResult.rows[0].company_name,
                    email: partnerResult.rows[0].email,
                },
                messages: messages.map((m) => ({
                    id: m.id,
                    content: m.content,
                    isOwn: m.senderId === req.user!.userId,
                    material: m.material,
                    createdAt: m.createdAt,
                })),
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * POST /api/messages
 * Send a new message
 */
router.post(
    '/',
    authenticate,
    [
        body('recipientId').isUUID().withMessage('Valid recipient ID is required'),
        body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters'),
        body('materialId').optional().isUUID().withMessage('Invalid material ID'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            // Verify recipient exists
            const recipientResult = await query(
                `SELECT id FROM users WHERE id = $1`,
                [req.body.recipientId]
            )

            if (recipientResult.rows.length === 0) {
                throw notFound('Recipient not found')
            }

            // Can't message yourself
            if (req.body.recipientId === req.user!.userId) {
                throw unprocessableEntity('Cannot send message to yourself')
            }

            const message = await sendMessage(
                req.user!.userId,
                req.body.recipientId,
                req.body.content,
                req.body.materialId
            )

            res.status(201).json({
                message: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * GET /api/messages/unread/count
 * Get unread message count
 */
router.get('/unread/count', authenticate, async (req: any, res: any, next: any) => {
    try {
        const count = await getUnreadCount(req.user!.userId)

        res.json({
            unreadCount: count,
        })
    } catch (error) {
        next(error)
    }
})

export default router
