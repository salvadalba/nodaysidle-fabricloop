import { query } from '../../config/database.js'

export interface Material {
    id: string
    sellerId: string
    title: string
    description: string
    materialType: string
    quantity: number
    unit: string
    price: number
    currency: string
    status: string
    images: string[]
    color: string | null
    weaveType: string | null
    originCountry: string | null
    createdAt: Date
    updatedAt: Date
    seller?: {
        companyName: string
        email: string
    }
    sustainabilityMetrics?: {
        carbonFootprint: number
        waterUsage: number
        chemicalComposition: Record<string, unknown>
    }
}

export interface CreateMaterialData {
    sellerId: string
    title: string
    description?: string
    materialType: string
    quantity: number
    unit: string
    price: number
    currency?: string
    images?: string[]
    color?: string
    weaveType?: string
    originCountry?: string
    sustainabilityMetrics?: {
        carbonFootprint?: number
        waterUsage?: number
        chemicalComposition?: Record<string, unknown>
    }
}

export interface UpdateMaterialData {
    title?: string
    description?: string
    quantity?: number
    price?: number
    status?: string
    images?: string[]
    color?: string
    weaveType?: string
    originCountry?: string
}

// Create a new material listing
export async function createMaterial(data: CreateMaterialData): Promise<Material> {
    const result = await query(
        `INSERT INTO materials (
      seller_id, title, description, material_type, quantity, unit, 
      price, currency, images, color, weave_type, origin_country
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
        [
            data.sellerId,
            data.title,
            data.description || null,
            data.materialType,
            data.quantity,
            data.unit,
            data.price,
            data.currency || 'USD',
            JSON.stringify(data.images || []),
            data.color || null,
            data.weaveType || null,
            data.originCountry || null,
        ]
    )

    const material = mapRowToMaterial(result.rows[0])

    // Create sustainability metrics if provided
    if (data.sustainabilityMetrics) {
        await query(
            `INSERT INTO sustainability_metrics (
        material_id, carbon_footprint, water_usage, chemical_composition
      ) VALUES ($1, $2, $3, $4)`,
            [
                material.id,
                data.sustainabilityMetrics.carbonFootprint || 0,
                data.sustainabilityMetrics.waterUsage || 0,
                JSON.stringify(data.sustainabilityMetrics.chemicalComposition || {}),
            ]
        )
    }

    return material
}

// Find material by ID with seller info and sustainability metrics
export async function findMaterialById(id: string): Promise<Material | null> {
    const result = await query(
        `SELECT m.*, 
      u.company_name as seller_company_name, 
      u.email as seller_email,
      sm.carbon_footprint,
      sm.water_usage,
      sm.chemical_composition
    FROM materials m
    LEFT JOIN users u ON m.seller_id = u.id
    LEFT JOIN sustainability_metrics sm ON m.id = sm.material_id
    WHERE m.id = $1 AND m.deleted_at IS NULL`,
        [id]
    )

    if (result.rows.length === 0) return null

    return mapRowToMaterialWithDetails(result.rows[0])
}

// Find materials by seller ID
export async function findMaterialsBySellerId(sellerId: string): Promise<Material[]> {
    const result = await query(
        `SELECT * FROM materials 
    WHERE seller_id = $1 AND deleted_at IS NULL
    ORDER BY created_at DESC`,
        [sellerId]
    )

    return result.rows.map(mapRowToMaterial)
}

// Search materials with filters
export async function searchMaterials(filters: {
    materialType?: string
    minPrice?: number
    maxPrice?: number
    minQuantity?: number
    searchTerm?: string
    page?: number
    limit?: number
}): Promise<{ materials: Material[]; total: number }> {
    const conditions: string[] = ['deleted_at IS NULL', "status = 'active'"]
    const params: (string | number)[] = []
    let paramIndex = 1

    if (filters.materialType) {
        conditions.push(`material_type = $${paramIndex}`)
        params.push(filters.materialType)
        paramIndex++
    }

    if (filters.minPrice !== undefined) {
        conditions.push(`price >= $${paramIndex}`)
        params.push(filters.minPrice)
        paramIndex++
    }

    if (filters.maxPrice !== undefined) {
        conditions.push(`price <= $${paramIndex}`)
        params.push(filters.maxPrice)
        paramIndex++
    }

    if (filters.minQuantity !== undefined) {
        conditions.push(`quantity >= $${paramIndex}`)
        params.push(filters.minQuantity)
        paramIndex++
    }

    if (filters.searchTerm) {
        conditions.push(`(
      to_tsvector('english', title) @@ plainto_tsquery('english', $${paramIndex})
      OR to_tsvector('english', description) @@ plainto_tsquery('english', $${paramIndex})
      OR title ILIKE $${paramIndex + 1}
    )`)
        params.push(filters.searchTerm)
        params.push(`%${filters.searchTerm}%`)
        paramIndex += 2
    }

    const whereClause = conditions.join(' AND ')
    const page = filters.page || 1
    const limit = Math.min(filters.limit || 20, 100)
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await query(
        `SELECT COUNT(*) FROM materials WHERE ${whereClause}`,
        params
    )
    const total = parseInt(countResult.rows[0].count, 10)

    // Get materials with pagination
    const result = await query(
        `SELECT m.*, 
      u.company_name as seller_company_name,
      sm.carbon_footprint
    FROM materials m
    LEFT JOIN users u ON m.seller_id = u.id
    LEFT JOIN sustainability_metrics sm ON m.id = sm.material_id
    WHERE ${whereClause}
    ORDER BY m.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
    )

    return {
        materials: result.rows.map(mapRowToMaterialWithDetails),
        total,
    }
}

// Update a material
export async function updateMaterial(
    id: string,
    sellerId: string,
    data: UpdateMaterialData
): Promise<Material | null> {
    // Verify ownership
    const existing = await query(
        `SELECT seller_id FROM materials WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    )

    if (existing.rows.length === 0) return null
    if (existing.rows[0].seller_id !== sellerId) {
        throw new Error('FORBIDDEN')
    }

    const updates: string[] = []
    const params: (string | number | string[])[] = []
    let paramIndex = 1

    if (data.title !== undefined) {
        updates.push(`title = $${paramIndex}`)
        params.push(data.title)
        paramIndex++
    }
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex}`)
        params.push(data.description)
        paramIndex++
    }
    if (data.quantity !== undefined) {
        updates.push(`quantity = $${paramIndex}`)
        params.push(data.quantity)
        paramIndex++
    }
    if (data.price !== undefined) {
        updates.push(`price = $${paramIndex}`)
        params.push(data.price)
        paramIndex++
    }
    if (data.status !== undefined) {
        updates.push(`status = $${paramIndex}`)
        params.push(data.status)
        paramIndex++
    }
    if (data.images !== undefined) {
        updates.push(`images = $${paramIndex}`)
        params.push(JSON.stringify(data.images))
        paramIndex++
    }
    if (data.color !== undefined) {
        updates.push(`color = $${paramIndex}`)
        params.push(data.color)
        paramIndex++
    }

    if (updates.length === 0) return findMaterialById(id)

    params.push(id)
    const result = await query(
        `UPDATE materials SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
    )

    return mapRowToMaterial(result.rows[0])
}

// Soft delete a material
export async function deleteMaterial(id: string, sellerId: string): Promise<boolean> {
    // Verify ownership
    const existing = await query(
        `SELECT seller_id FROM materials WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    )

    if (existing.rows.length === 0) return false
    if (existing.rows[0].seller_id !== sellerId) {
        throw new Error('FORBIDDEN')
    }

    await query(
        `UPDATE materials SET deleted_at = CURRENT_TIMESTAMP, status = 'deleted' WHERE id = $1`,
        [id]
    )

    return true
}

// Helper to map database row to Material
function mapRowToMaterial(row: Record<string, unknown>): Material {
    return {
        id: row.id as string,
        sellerId: row.seller_id as string,
        title: row.title as string,
        description: row.description as string,
        materialType: row.material_type as string,
        quantity: parseFloat(row.quantity as string),
        unit: row.unit as string,
        price: parseFloat(row.price as string),
        currency: row.currency as string,
        status: row.status as string,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images as string[]) || [],
        color: row.color as string | null,
        weaveType: row.weave_type as string | null,
        originCountry: row.origin_country as string | null,
        createdAt: new Date(row.created_at as string),
        updatedAt: new Date(row.updated_at as string),
    }
}

function mapRowToMaterialWithDetails(row: Record<string, unknown>): Material {
    const material = mapRowToMaterial(row)

    if (row.seller_company_name) {
        material.seller = {
            companyName: row.seller_company_name as string,
            email: row.seller_email as string,
        }
    }

    if (row.carbon_footprint !== undefined && row.carbon_footprint !== null) {
        material.sustainabilityMetrics = {
            carbonFootprint: parseFloat(row.carbon_footprint as string),
            waterUsage: parseFloat((row.water_usage as string) || '0'),
            chemicalComposition: typeof row.chemical_composition === 'string'
                ? JSON.parse(row.chemical_composition)
                : (row.chemical_composition as Record<string, unknown>) || {},
        }
    }

    return material
}
