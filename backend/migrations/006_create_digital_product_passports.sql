-- ============================================
-- Digital Product Passports Table
-- ============================================
-- Stores digital product passport data for materials

CREATE TABLE IF NOT EXISTS digital_product_passports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL UNIQUE REFERENCES materials(id) ON DELETE CASCADE,
    passport_number VARCHAR(100) UNIQUE NOT NULL,
    origin VARCHAR(255),                   -- Country of origin
    manufacture_date DATE,
    batch_number VARCHAR(100),
    supply_chain JSONB DEFAULT '[]'::jsonb,  -- Array of supply chain steps
    certifications JSONB DEFAULT '[]'::jsonb,
    quality_grades JSONB DEFAULT '{}'::jsonb,
    testing_results JSONB DEFAULT '{}'::jsonb,
    compliance_status VARCHAR(50) DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'compliant', 'non_compliant')),
    issued_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_digital_product_passports_material_id ON digital_product_passports(material_id);
CREATE INDEX idx_digital_product_passports_passport_number ON digital_product_passports(passport_number);
CREATE INDEX idx_digital_product_passports_origin ON digital_product_passports(origin);
CREATE INDEX idx_digital_product_passports_compliance_status ON digital_product_passports(compliance_status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_digital_product_passports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_digital_product_passports_updated_at
    BEFORE UPDATE ON digital_product_passports
    FOR EACH ROW
    EXECUTE FUNCTION update_digital_product_passports_updated_at();
