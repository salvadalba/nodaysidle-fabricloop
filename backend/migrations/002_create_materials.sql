-- ============================================
-- Materials Table
-- ============================================
-- Stores material listings (deadstock fabric)

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    material_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('m', 'kg', 'yards', 'lbs')),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'deleted')),
    images JSONB DEFAULT '[]'::jsonb,
    color VARCHAR(100),
    weave_type VARCHAR(100),
    origin_country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for search and filtering
CREATE INDEX idx_materials_seller_id ON materials(seller_id);
CREATE INDEX idx_materials_material_type ON materials(material_type);
CREATE INDEX idx_materials_price ON materials(price);
CREATE INDEX idx_materials_created_at ON materials(created_at);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_materials_search ON materials(material_type, price, created_at);

-- Full-text search index
CREATE INDEX idx_materials_title_fts ON materials USING gin(to_tsvector('english', title));
CREATE INDEX idx_materials_description_fts ON materials USING gin(to_tsvector('english', description));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_materials_updated_at();
