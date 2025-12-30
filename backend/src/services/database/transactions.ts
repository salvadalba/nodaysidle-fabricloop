import { query, transaction } from '../../config/database.js'
import { z } from 'zod'

// Schema for transaction creation
export const createTransactionSchema = z.object({
    material_id: z.string().uuid(),
    buyer_id: z.string().uuid(),
    quantity: z.number().positive(),
    total_amount: z.number().positive(),
    currency: z.string().length(3),
})

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>

export class TransactionService {
    // Create a new transaction (order)
    static async create(data: CreateTransactionDTO) {
        return transaction(async (client) => {
            // 1. Verify material availability
            const materialRes = await client.query(
                'SELECT quantity, seller_id, unit FROM materials WHERE id = $1 FOR UPDATE',
                [data.material_id]
            )

            if (materialRes.rows.length === 0) {
                throw new Error('Material not found')
            }

            const material = materialRes.rows[0]
            if (material.quantity < data.quantity) {
                throw new Error('Insufficient material quantity')
            }

            // 2. Create the transaction record
            const insertRes = await client.query(
                `INSERT INTO transactions 
        (material_id, buyer_id, seller_id, quantity, total_amount, currency, status, unit)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
        RETURNING *`,
                [
                    data.material_id,
                    data.buyer_id,
                    material.seller_id,
                    data.quantity,
                    data.total_amount,
                    data.currency,
                    material.unit || 'kg'
                ]
            )

            // 3. Update material quantity (reservation)
            await client.query(
                'UPDATE materials SET quantity = quantity - $1 WHERE id = $2',
                [data.quantity, data.material_id]
            )

            return insertRes.rows[0]
        })
    }

    // Get transaction by ID
    static async findById(id: string) {
        const res = await query(
            `SELECT t.*, 
              m.title as material_title, 
              m.images as material_images,
              u.company_name as other_party_name
       FROM transactions t
       JOIN materials m ON t.material_id = m.id
       JOIN users u ON (u.id = t.buyer_id OR u.id = t.seller_id)
       WHERE t.id = $1`,
            [id]
        )
        return res.rows[0]
    }

    // Get transactions for a user (as buyer or seller)
    static async getUserTransactions(userId: string, role: 'buyer' | 'seller' | 'all' = 'all') {
        let whereClause = ''
        const params = [userId]

        if (role === 'buyer') {
            whereClause = 'WHERE t.buyer_id = $1'
        } else if (role === 'seller') {
            whereClause = 'WHERE t.seller_id = $1'
        } else {
            whereClause = 'WHERE t.buyer_id = $1 OR t.seller_id = $1'
        }

        const res = await query(
            `SELECT t.*, 
              m.title as material_title, 
              m.images as material_images
       FROM transactions t
       JOIN materials m ON t.material_id = m.id
       ${whereClause}
       ORDER BY t.created_at DESC`,
            params
        )
        return res.rows
    }

    // Update transaction status
    static async updateStatus(id: string, status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled', userId: string) {
        // Only verify that the user is part of the transaction
        const tx = await this.findById(id)
        if (!tx) throw new Error('Transaction not found')

        // In a real app, strict state machine logic would go here (e.g. can't cancel if shipped)

        const res = await query(
            `UPDATE transactions 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 AND (buyer_id = $3 OR seller_id = $3)
       RETURNING *`,
            [status, id, userId]
        )
        return res.rows[0]
    }
}
