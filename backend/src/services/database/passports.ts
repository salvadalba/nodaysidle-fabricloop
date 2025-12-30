import { query } from '../../config/database.js'

export interface DigitalProductPassport {
    id: string
    materialId: string
    passportNumber: string
    origin: string
    manufactureDate: Date
    supplyChain: SupplyChainStep[]
    certifications: string[]
    complianceStatus: string
    createdAt: Date
    updatedAt: Date
    material?: {
        title: string
        materialType: string
        seller: {
            companyName: string
        }
    }
    sustainabilityMetrics?: {
        carbonFootprint: number
        waterUsage: number
        chemicalComposition: Record<string, unknown>
    }
}

interface SupplyChainStep {
    stage: string
    location: string
    date: string
    verified?: boolean
}

// Get passport by material ID with all related data
export async function getPassportByMaterialId(materialId: string): Promise<DigitalProductPassport | null> {
    const result = await query(
        `SELECT 
      dpp.*,
      m.title as material_title,
      m.material_type,
      u.company_name as seller_company_name,
      sm.carbon_footprint,
      sm.water_usage,
      sm.chemical_composition
    FROM digital_product_passports dpp
    JOIN materials m ON dpp.material_id = m.id
    JOIN users u ON m.seller_id = u.id
    LEFT JOIN sustainability_metrics sm ON m.id = sm.material_id
    WHERE dpp.material_id = $1`,
        [materialId]
    )

    if (result.rows.length === 0) return null

    return mapRowToPassport(result.rows[0])
}

// Get passport by passport number
export async function getPassportByNumber(passportNumber: string): Promise<DigitalProductPassport | null> {
    const result = await query(
        `SELECT 
      dpp.*,
      m.title as material_title,
      m.material_type,
      u.company_name as seller_company_name,
      sm.carbon_footprint,
      sm.water_usage,
      sm.chemical_composition
    FROM digital_product_passports dpp
    JOIN materials m ON dpp.material_id = m.id
    JOIN users u ON m.seller_id = u.id
    LEFT JOIN sustainability_metrics sm ON m.id = sm.material_id
    WHERE dpp.passport_number = $1`,
        [passportNumber]
    )

    if (result.rows.length === 0) return null

    return mapRowToPassport(result.rows[0])
}

// Create a new passport for a material
export async function createPassport(
    materialId: string,
    data: {
        origin: string
        manufactureDate?: Date
        supplyChain?: SupplyChainStep[]
        certifications?: string[]
    }
): Promise<DigitalProductPassport> {
    const passportNumber = generatePassportNumber()

    const result = await query(
        `INSERT INTO digital_product_passports (
      material_id, passport_number, origin, manufacture_date,
      supply_chain, certifications, compliance_status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
        [
            materialId,
            passportNumber,
            data.origin,
            data.manufactureDate || new Date(),
            JSON.stringify(data.supplyChain || []),
            JSON.stringify(data.certifications || []),
            'pending',
        ]
    )

    return mapRowToPassport(result.rows[0])
}

// Update passport supply chain
export async function updateSupplyChain(
    passportId: string,
    supplyChain: SupplyChainStep[]
): Promise<DigitalProductPassport | null> {
    const result = await query(
        `UPDATE digital_product_passports 
    SET supply_chain = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *`,
        [JSON.stringify(supplyChain), passportId]
    )

    if (result.rows.length === 0) return null

    return mapRowToPassport(result.rows[0])
}

// Add certification to passport
export async function addCertification(
    passportId: string,
    certification: string
): Promise<DigitalProductPassport | null> {
    const result = await query(
        `UPDATE digital_product_passports 
    SET certifications = certifications || $1::jsonb, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *`,
        [JSON.stringify([certification]), passportId]
    )

    if (result.rows.length === 0) return null

    return mapRowToPassport(result.rows[0])
}

// Update compliance status
export async function updateComplianceStatus(
    passportId: string,
    status: 'pending' | 'compliant' | 'non_compliant'
): Promise<DigitalProductPassport | null> {
    const result = await query(
        `UPDATE digital_product_passports 
    SET compliance_status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *`,
        [status, passportId]
    )

    if (result.rows.length === 0) return null

    return mapRowToPassport(result.rows[0])
}

// Generate unique passport number
function generatePassportNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `DPP-${timestamp}-${random}`
}

// Map database row to passport object
function mapRowToPassport(row: Record<string, unknown>): DigitalProductPassport {
    const passport: DigitalProductPassport = {
        id: row.id as string,
        materialId: row.material_id as string,
        passportNumber: row.passport_number as string,
        origin: row.origin as string,
        manufactureDate: new Date(row.manufacture_date as string),
        supplyChain: typeof row.supply_chain === 'string'
            ? JSON.parse(row.supply_chain)
            : (row.supply_chain as SupplyChainStep[]) || [],
        certifications: typeof row.certifications === 'string'
            ? JSON.parse(row.certifications)
            : (row.certifications as string[]) || [],
        complianceStatus: row.compliance_status as string,
        createdAt: new Date(row.created_at as string),
        updatedAt: new Date(row.updated_at as string),
    }

    if (row.material_title) {
        passport.material = {
            title: row.material_title as string,
            materialType: row.material_type as string,
            seller: {
                companyName: row.seller_company_name as string,
            },
        }
    }

    if (row.carbon_footprint !== undefined && row.carbon_footprint !== null) {
        passport.sustainabilityMetrics = {
            carbonFootprint: parseFloat(row.carbon_footprint as string),
            waterUsage: parseFloat((row.water_usage as string) || '0'),
            chemicalComposition: typeof row.chemical_composition === 'string'
                ? JSON.parse(row.chemical_composition)
                : (row.chemical_composition as Record<string, unknown>) || {},
        }
    }

    return passport
}
