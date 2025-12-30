import { Router } from 'express'
import { body, query as queryValidator, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { unprocessableEntity, notFound, forbidden } from '../middleware/errorHandler.js'
import {
    createMaterial,
    findMaterialById,
    findMaterialsBySellerId,
    searchMaterials,
    updateMaterial,
    deleteMaterial,
} from '../services/database/materials.js'

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
 * POST /api/materials
 * Create a new material listing
 */
router.post(
    '/',
    authenticate,
    [
        body('title').trim().isLength({ min: 2, max: 255 }).withMessage('Title must be between 2 and 255 characters'),
        body('materialType').trim().notEmpty().withMessage('Material type is required'),
        body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
        body('unit').isIn(['m', 'kg', 'yards', 'lbs']).withMessage('Unit must be m, kg, yards, or lbs'),
        body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
        body('description').optional().trim(),
        body('currency').optional().isIn(['USD', 'EUR', 'GBP']).withMessage('Currency must be USD, EUR, or GBP'),
        body('images').optional().isArray().withMessage('Images must be an array'),
        body('color').optional().trim(),
        body('weaveType').optional().trim(),
        body('originCountry').optional().trim(),
        body('sustainabilityMetrics').optional().isObject(),
        body('sustainabilityMetrics.carbonFootprint').optional().isFloat({ min: 0 }),
        body('sustainabilityMetrics.waterUsage').optional().isFloat({ min: 0 }),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const material = await createMaterial({
                sellerId: req.user!.userId,
                title: req.body.title,
                description: req.body.description,
                materialType: req.body.materialType,
                quantity: req.body.quantity,
                unit: req.body.unit,
                price: req.body.price,
                currency: req.body.currency,
                images: req.body.images,
                color: req.body.color,
                weaveType: req.body.weaveType,
                originCountry: req.body.originCountry,
                sustainabilityMetrics: req.body.sustainabilityMetrics,
            })

            res.status(201).json({
                material: {
                    id: material.id,
                    title: material.title,
                    status: material.status,
                    createdAt: material.createdAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * GET /api/materials
 * Search materials with filters and pagination
 */
router.get(
    '/',
    [
        queryValidator('materialType').optional().trim(),
        queryValidator('minPrice').optional().isFloat({ min: 0 }),
        queryValidator('maxPrice').optional().isFloat({ min: 0 }),
        queryValidator('minQuantity').optional().isFloat({ min: 0 }),
        queryValidator('search').optional().trim(),
        queryValidator('page').optional().isInt({ min: 1 }),
        queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const { materials, total } = await searchMaterials({
                materialType: req.query.materialType,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
                minQuantity: req.query.minQuantity ? parseFloat(req.query.minQuantity) : undefined,
                searchTerm: req.query.search,
                page: req.query.page ? parseInt(req.query.page, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit, 10) : 20,
            })

            res.json({
                materials: materials.map((m) => ({
                    id: m.id,
                    title: m.title,
                    materialType: m.materialType,
                    quantity: m.quantity,
                    unit: m.unit,
                    price: m.price,
                    currency: m.currency,
                    thumbnail: m.images?.[0] || null,
                    seller: m.seller,
                    carbonFootprint: m.sustainabilityMetrics?.carbonFootprint,
                    createdAt: m.createdAt,
                })),
                total,
                page: req.query.page ? parseInt(req.query.page, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit, 10) : 20,
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * GET /api/materials/my
 * Get current user's material listings
 */
router.get('/my', authenticate, async (req: any, res: any, next: any) => {
    try {
        const materials = await findMaterialsBySellerId(req.user!.userId)

        res.json({
            materials: materials.map((m) => ({
                id: m.id,
                title: m.title,
                materialType: m.materialType,
                quantity: m.quantity,
                unit: m.unit,
                price: m.price,
                currency: m.currency,
                status: m.status,
                thumbnail: m.images?.[0] || null,
                createdAt: m.createdAt,
            })),
        })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /api/materials/:id
 * Get material details by ID
 */
router.get('/:id', async (req: any, res: any, next: any) => {
    try {
        const material = await findMaterialById(req.params.id)

        if (!material) {
            throw notFound('Material not found')
        }

        res.json({
            material: {
                id: material.id,
                title: material.title,
                description: material.description,
                materialType: material.materialType,
                quantity: material.quantity,
                unit: material.unit,
                price: material.price,
                currency: material.currency,
                status: material.status,
                images: material.images,
                color: material.color,
                weaveType: material.weaveType,
                originCountry: material.originCountry,
                seller: material.seller,
                sustainabilityMetrics: material.sustainabilityMetrics,
                createdAt: material.createdAt,
                updatedAt: material.updatedAt,
            },
        })
    } catch (error) {
        next(error)
    }
})

/**
 * PUT /api/materials/:id
 * Update a material listing
 */
router.put(
    '/:id',
    authenticate,
    [
        body('title').optional().trim().isLength({ min: 2, max: 255 }),
        body('description').optional().trim(),
        body('quantity').optional().isFloat({ min: 0.01 }),
        body('price').optional().isFloat({ min: 0.01 }),
        body('status').optional().isIn(['active', 'sold', 'pending']),
        body('images').optional().isArray(),
        body('color').optional().trim(),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const material = await updateMaterial(req.params.id, req.user!.userId, {
                title: req.body.title,
                description: req.body.description,
                quantity: req.body.quantity,
                price: req.body.price,
                status: req.body.status,
                images: req.body.images,
                color: req.body.color,
            })

            if (!material) {
                throw notFound('Material not found')
            }

            res.json({
                material: {
                    id: material.id,
                    updatedAt: material.updatedAt,
                },
            })
        } catch (error: any) {
            if (error.message === 'FORBIDDEN') {
                return next(forbidden('You can only update your own listings'))
            }
            next(error)
        }
    }
)

/**
 * DELETE /api/materials/:id
 * Delete a material listing
 */
router.delete('/:id', authenticate, async (req: any, res: any, next: any) => {
    try {
        const deleted = await deleteMaterial(req.params.id, req.user!.userId)

        if (!deleted) {
            throw notFound('Material not found')
        }

        res.json({
            message: 'Material deleted successfully',
        })
    } catch (error: any) {
        if (error.message === 'FORBIDDEN') {
            return next(forbidden('You can only delete your own listings'))
        }
        next(error)
    }
})

export default router
