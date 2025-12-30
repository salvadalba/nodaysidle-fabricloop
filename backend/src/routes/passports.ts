import { Router } from 'express'
import { param, body, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { unprocessableEntity, notFound } from '../middleware/errorHandler.js'
import {
    getPassportByMaterialId,
    getPassportByNumber,
    createPassport,
    addCertification,
    updateComplianceStatus,
} from '../services/database/passports.js'
import { findMaterialById } from '../services/database/materials.js'

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
 * GET /api/passports/verify/:passportNumber
 * Public endpoint to verify a passport by its number
 */
router.get(
    '/verify/:passportNumber',
    [
        param('passportNumber').trim().notEmpty().withMessage('Passport number is required'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const passport = await getPassportByNumber(req.params.passportNumber)

            if (!passport) {
                throw notFound('Digital Product Passport not found')
            }

            res.json({
                verified: true,
                passport: {
                    passportNumber: passport.passportNumber,
                    material: passport.material,
                    origin: passport.origin,
                    manufactureDate: passport.manufactureDate,
                    supplyChain: passport.supplyChain,
                    certifications: passport.certifications,
                    complianceStatus: passport.complianceStatus,
                    sustainabilityMetrics: passport.sustainabilityMetrics,
                    createdAt: passport.createdAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * GET /api/passports/material/:materialId
 * Get passport for a specific material
 */
router.get(
    '/material/:materialId',
    [
        param('materialId').isUUID().withMessage('Invalid material ID'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const passport = await getPassportByMaterialId(req.params.materialId)

            if (!passport) {
                throw notFound('Digital Product Passport not found for this material')
            }

            res.json({
                passport: {
                    id: passport.id,
                    passportNumber: passport.passportNumber,
                    material: passport.material,
                    origin: passport.origin,
                    manufactureDate: passport.manufactureDate,
                    supplyChain: passport.supplyChain,
                    certifications: passport.certifications,
                    complianceStatus: passport.complianceStatus,
                    sustainabilityMetrics: passport.sustainabilityMetrics,
                    createdAt: passport.createdAt,
                    updatedAt: passport.updatedAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * POST /api/passports
 * Create a new passport for a material
 */
router.post(
    '/',
    authenticate,
    [
        body('materialId').isUUID().withMessage('Valid material ID is required'),
        body('origin').trim().notEmpty().withMessage('Origin country is required'),
        body('manufactureDate').optional().isISO8601().withMessage('Invalid date format'),
        body('certifications').optional().isArray().withMessage('Certifications must be an array'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            // Verify ownership of material
            const material = await findMaterialById(req.body.materialId)

            if (!material) {
                throw notFound('Material not found')
            }

            if (material.sellerId !== req.user!.userId) {
                throw unprocessableEntity('You can only create passports for your own materials')
            }

            // Check if passport already exists
            const existing = await getPassportByMaterialId(req.body.materialId)
            if (existing) {
                throw unprocessableEntity('A passport already exists for this material')
            }

            const passport = await createPassport(req.body.materialId, {
                origin: req.body.origin,
                manufactureDate: req.body.manufactureDate ? new Date(req.body.manufactureDate) : undefined,
                certifications: req.body.certifications,
            })

            res.status(201).json({
                passport: {
                    id: passport.id,
                    passportNumber: passport.passportNumber,
                    createdAt: passport.createdAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * POST /api/passports/:id/certifications
 * Add a certification to a passport
 */
router.post(
    '/:id/certifications',
    authenticate,
    [
        param('id').isUUID().withMessage('Invalid passport ID'),
        body('certification').trim().notEmpty().withMessage('Certification name is required'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const passport = await addCertification(req.params.id, req.body.certification)

            if (!passport) {
                throw notFound('Passport not found')
            }

            res.json({
                passport: {
                    id: passport.id,
                    certifications: passport.certifications,
                    updatedAt: passport.updatedAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

/**
 * PUT /api/passports/:id/compliance
 * Update compliance status
 */
router.put(
    '/:id/compliance',
    authenticate,
    [
        param('id').isUUID().withMessage('Invalid passport ID'),
        body('status').isIn(['pending', 'compliant', 'non_compliant']).withMessage('Invalid compliance status'),
        handleValidationErrors,
    ],
    async (req: any, res: any, next: any) => {
        try {
            const passport = await updateComplianceStatus(req.params.id, req.body.status)

            if (!passport) {
                throw notFound('Passport not found')
            }

            res.json({
                passport: {
                    id: passport.id,
                    complianceStatus: passport.complianceStatus,
                    updatedAt: passport.updatedAt,
                },
            })
        } catch (error) {
            next(error)
        }
    }
)

export default router
