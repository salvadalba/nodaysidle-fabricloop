import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { TransactionService } from '../services/database/transactions.js'
import { unprocessableEntity } from '../middleware/errorHandler.js'
import { EmailService } from '../services/email.js'
import { query } from '../config/database.js'

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
            const transaction = await TransactionService.create({
                ...req.body,
                buyer_id: req.user!.userId
            })

            // Send order confirmation emails (async, don't block response)
            try {
                // Fetch material and user details for email
                const materialRes = await query(
                    'SELECT m.title, m.unit, u.email as seller_email, u.company_name as seller_company FROM materials m JOIN users u ON m.seller_id = u.id WHERE m.id = $1',
                    [req.body.material_id]
                )
                const buyerRes = await query(
                    'SELECT email, company_name FROM users WHERE id = $1',
                    [req.user!.userId]
                )

                if (materialRes.rows[0] && buyerRes.rows[0]) {
                    const orderDetails = {
                        orderId: transaction.id,
                        materialTitle: materialRes.rows[0].title,
                        quantity: transaction.quantity,
                        unit: transaction.unit || 'kg',
                        totalAmount: transaction.total_amount,
                        currency: transaction.currency,
                        buyerEmail: buyerRes.rows[0].email,
                        buyerCompany: buyerRes.rows[0].company_name,
                        sellerEmail: materialRes.rows[0].seller_email,
                        sellerCompany: materialRes.rows[0].seller_company
                    }

                    // Fire and forget - don't block response
                    EmailService.sendOrderConfirmationToBuyer(orderDetails)
                    EmailService.sendOrderNotificationToSeller(orderDetails)
                }
            } catch (emailError) {
                console.error('Failed to send order emails:', emailError)
            }

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
                req.user!.userId
            )
            res.json(updated)
        } catch (error) {
            next(error)
        }
    }
)

export { router as transactionsRouter }
