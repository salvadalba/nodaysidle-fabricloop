-- ============================================
-- Sustainability Metrics Table
-- ============================================
-- Stores environmental impact data for each material

CREATE TABLE IF NOT EXISTS sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL UNIQUE REFERENCES materials(id) ON DELETE CASCADE,
    carbon_footprint DECIMAL(10, 2),  -- kg CO2e per unit
    water_usage DECIMAL(10, 2),        -- liters per unit
    chemical_composition JSONB,        -- detailed chemical breakdown
    production_method VARCHAR(100),    -- e.g., 'organic', 'conventional', 'recycled'
    certifications JSONB DEFAULT '[]'::jsonb,
    biodegradable_percentage DECIMAL(5, 2),
    recycled_content_percentage DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for filtering and reporting
CREATE INDEX idx_sustainability_metrics_material_id ON sustainability_metrics(material_id);
CREATE INDEX idx_sustainability_metrics_carbon_footprint ON sustainability_metrics(carbon_footprint);
CREATE INDEX idx_sustainability_metrics_production_method ON sustainability_metrics(production_method);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_sustainability_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sustainability_metrics_updated_at
    BEFORE UPDATE ON sustainability_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_sustainability_metrics_updated_at();
