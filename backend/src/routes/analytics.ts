import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { query } from '../config/database.js'

const router = express.Router()

router.get('/dashboard', authenticate, async (req: any, res: any, next: any) => {
    try {
        const userId = req.user!.userId

        // 1. Total Revenue (as seller)
        const revenueRes = await query(
            `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM transactions 
       WHERE seller_id = $1 AND status != 'cancelled'`,
            [userId]
        )

        // 2. Active Listings
        const listingsRes = await query(
            `SELECT COUNT(*) as count 
       FROM materials 
       WHERE seller_id = $1 AND status = 'available'`,
            [userId]
        )

        // 3. Pending Orders (Incoming)
        const ordersRes = await query(
            `SELECT COUNT(*) as count 
       FROM transactions 
       WHERE seller_id = $1 AND status = 'pending'`,
            [userId]
        )

        // 4. Monthly Impact (CO2 saved - mock logic based on sales volume for now)
        // In real life, calculate based on material sustainability metrics * quantity sold
        const impactRes = await query(
            `SELECT COALESCE(SUM(quantity), 0) as kg_sold 
       FROM transactions 
       WHERE seller_id = $1`,
            [userId]
        )

        res.json({
            revenue: parseFloat(revenueRes.rows[0].total),
            activeListings: parseInt(listingsRes.rows[0].count),
            pendingOrders: parseInt(ordersRes.rows[0].count),
            co2Saved: parseFloat(impactRes.rows[0].kg_sold) * 12.5 // Mock factor: 12.5kg CO2 per kg fabric reused
        })
    } catch (error) {
        next(error)
    }
})

export { router as analyticsRouter }
