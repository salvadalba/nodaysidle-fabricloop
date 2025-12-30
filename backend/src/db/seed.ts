import { query, closePool } from '../config/database.js'

// Seed data for demo purposes
async function seed() {
    console.log('🌱 Seeding database...')

    try {
        // Get or create a manufacturer user
        let manResult = await query(
            `SELECT id FROM users WHERE email = 'demo-manufacturer@fabricloop.com'`
        )

        let manufacturerId: string

        if (manResult.rows.length === 0) {
            // Create demo manufacturer
            const insertResult = await query(
                `INSERT INTO users (email, password_hash, company_name, role, phone, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
                [
                    'demo-manufacturer@fabricloop.com',
                    '$2b$10$dummyHashForSeeding12345678901234567890123456', // Not a real hash
                    'Milano Sustainable Textiles',
                    'manufacturer',
                    '+39 02 1234567',
                    true,
                ]
            )
            manufacturerId = insertResult.rows[0].id
            console.log('✅ Created demo manufacturer')
        } else {
            manufacturerId = manResult.rows[0].id
            console.log('ℹ️  Demo manufacturer already exists')
        }

        // Check if materials already exist
        const existingMaterials = await query(
            `SELECT COUNT(*) FROM materials WHERE seller_id = $1`,
            [manufacturerId]
        )

        if (parseInt(existingMaterials.rows[0].count) > 0) {
            console.log('ℹ️  Materials already seeded, skipping...')
            return
        }

        // Create sample materials
        const materials = [
            {
                title: 'Premium Organic Cotton Twill',
                description: 'Luxurious organic cotton twill fabric in a beautiful dusty rose color. GOTS certified, perfect for sustainable fashion collections. Deadstock from SS24 production.',
                materialType: 'Cotton',
                quantity: 580,
                unit: 'm',
                price: 14.50,
                currency: 'USD',
                images: ['/images/materials/organic-cotton.png'],
                color: 'Dusty Rose',
                weaveType: 'Twill',
                originCountry: 'Italy',
                carbonFootprint: 0.85,
                waterUsage: 420,
            },
            {
                title: 'Recycled Wool Blend',
                description: 'Premium recycled wool blend in cream and blush tones. Made from 70% post-consumer recycled wool and 30% recycled cashmere. Soft hand feel, ideal for outerwear.',
                materialType: 'Wool',
                quantity: 320,
                unit: 'm',
                price: 32.00,
                currency: 'USD',
                images: ['/images/materials/recycled-wool.png'],
                color: 'Cream Blush',
                weaveType: 'Plain',
                originCountry: 'Scotland',
                carbonFootprint: 1.2,
                waterUsage: 180,
            },
            {
                title: 'Hemp Linen Blend',
                description: 'Sustainable hemp and linen blend in natural earth tones. Low water footprint, naturally antibacterial. Perfect for summer collections and resort wear.',
                materialType: 'Linen',
                quantity: 890,
                unit: 'm',
                price: 11.25,
                currency: 'USD',
                images: ['/images/materials/hemp-linen.png'],
                color: 'Natural',
                weaveType: 'Plain',
                originCountry: 'Belgium',
                carbonFootprint: 0.45,
                waterUsage: 85,
            },
            {
                title: 'Silk Charmeuse - Deadstock',
                description: 'Exquisite silk charmeuse from luxury house overstock. Elegant drape and lustrous finish. Limited quantity available.',
                materialType: 'Silk',
                quantity: 145,
                unit: 'm',
                price: 68.00,
                currency: 'USD',
                images: [],
                color: 'Champagne',
                weaveType: 'Charmeuse',
                originCountry: 'France',
                carbonFootprint: 2.1,
                waterUsage: 650,
            },
            {
                title: 'Tencel™ Jersey',
                description: 'Soft and sustainable Tencel jersey fabric. Made from eucalyptus fibers using a closed-loop production process. Great for basics and activewear.',
                materialType: 'Tencel',
                quantity: 1200,
                unit: 'm',
                price: 9.75,
                currency: 'USD',
                images: [],
                color: 'Stone Grey',
                weaveType: 'Jersey',
                originCountry: 'Austria',
                carbonFootprint: 0.35,
                waterUsage: 120,
            },
        ]

        for (const material of materials) {
            // Insert material
            const matResult = await query(
                `INSERT INTO materials (
          seller_id, title, description, material_type, quantity, unit,
          price, currency, images, color, weave_type, origin_country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
                [
                    manufacturerId,
                    material.title,
                    material.description,
                    material.materialType,
                    material.quantity,
                    material.unit,
                    material.price,
                    material.currency,
                    JSON.stringify(material.images),
                    material.color,
                    material.weaveType,
                    material.originCountry,
                ]
            )

            // Insert sustainability metrics
            await query(
                `INSERT INTO sustainability_metrics (material_id, carbon_footprint, water_usage, chemical_composition)
        VALUES ($1, $2, $3, $4)`,
                [
                    matResult.rows[0].id,
                    material.carbonFootprint,
                    material.waterUsage,
                    JSON.stringify({ organic: true, certified: 'GOTS' }),
                ]
            )

            console.log(`  ✅ Created: ${material.title}`)
        }

        // Create digital product passports for the materials
        const allMaterials = await query(
            `SELECT id, material_type, origin_country FROM materials WHERE seller_id = $1`,
            [manufacturerId]
        )

        for (const mat of allMaterials.rows) {
            await query(
                `INSERT INTO digital_product_passports (
          material_id, passport_number, origin, manufacture_date, 
          supply_chain, certifications, compliance_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (material_id) DO NOTHING`,
                [
                    mat.id,
                    `DPP-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    mat.origin_country,
                    new Date(),
                    JSON.stringify([
                        { stage: 'Raw Material', location: mat.origin_country, date: '2024-01' },
                        { stage: 'Processing', location: 'Italy', date: '2024-02' },
                        { stage: 'Quality Check', location: 'Italy', date: '2024-03' },
                    ]),
                    JSON.stringify(['GOTS', 'OEKO-TEX Standard 100']),
                    'compliant',
                ]
            )
        }

        console.log('\n✅ Seeding complete!')
        console.log('\n📊 Summary:')
        console.log(`  - 1 Demo Manufacturer`)
        console.log(`  - ${materials.length} Material Listings`)
        console.log(`  - ${materials.length} Sustainability Metrics`)
        console.log(`  - ${materials.length} Digital Product Passports`)

    } catch (error) {
        console.error('❌ Seeding failed:', error)
        throw error
    } finally {
        await closePool()
    }
}

seed()
