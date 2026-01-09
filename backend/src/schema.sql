CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  api_key VARCHAR(100) UNIQUE,
  api_secret VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL,
  receipt VARCHAR(100),
  notes JSONB,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) REFERENCES orders(id),
  merchant_id UUID REFERENCES merchants(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(10),
  method VARCHAR(20),
  status VARCHAR(20),
  vpa VARCHAR(100),
  card_network VARCHAR(20),
  card_last4 VARCHAR(4),
  error_code VARCHAR(50),
  error_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
