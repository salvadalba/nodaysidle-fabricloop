import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { TransactionService } from '../services/database/transactions.js'
import { unprocessableEntity } from '../middleware/errorHandler.js'

const router = express.Router()

function parseValidationErrors(req: any, _res: any, next: any) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw unprocessableEntity(errors.array()[0].msg)
    }
    next()
}

// Get all transactions for the current user
router.get('/', authenticate, async (req: any, res: any, next: any) => {
    try {
        const role = req.query.role as 'buyer' | 'seller' | 'all'
        const transactions = await TransactionService.getUserTransactions(req.user!.userId, role)
        res.json(transactions)
    } catch (error) {
        next(error)
    }
})

// Create a new transaction (Buy material)
router.post(
    '/',
    authenticate,
    [
        body('material_id').isUUID(),
        body('quantity').isFloat({ min: 0 }),
        parseValidationErrors
    ],
    async (req: any, res: any, next: any) => {
        try {
            // In a real flow, we'd fetch price from DB to avoid client manipulation.
            // For now, we assume the client sends the total (or we could calculate it here).
            // Let's rely on the service to just take the payload for this MVP step.

            const transaction = await TransactionService.create({
                ...req.body,
                buyer_id: req.user!.id
            })
            res.status(201).json(transaction)
        } catch (error) {
            next(error)
        }
    }
)

// Update transaction status
router.put(
    '/:id/status',
    authenticate,
    [
        param('id').isUUID(),
        body('status').isIn(['confirmed', 'shipped', 'delivered', 'cancelled']),
        parseValidationErrors
    ],
    async (req: any, res: any, next: any) => {
        try {
            const updated = await TransactionService.updateStatus(
                req.params.id,
                req.body.status,
                req.user!.id
            )
            res.json(updated)
        } catch (error) {
            next(error)
        }
    }
)

export { router as transactionsRouter }
