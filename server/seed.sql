-- Inserção de 300 produtos aleatórios
DO $$
DECLARE
    brands text[] := ARRAY['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Vans', 'Converse', 'Under Armour', 'Fila', 'Mizuno', 'Oakley', 'Skechers', 'Timberland', 'Lacoste'];
    categories text[] := ARRAY['Esporte', 'Casual', 'Social', 'Running', 'Training', 'Skatista', 'Basketball', 'Futebol', 'Tennis', 'Caminhada'];
    sizes text[] := ARRAY['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
    i integer;
    brand text;
    category text;
    size text;
    name text;
    description text;
    price decimal;
    stock integer;
    ref_code text;
BEGIN
    FOR i IN 1..300 LOOP
        -- Seleciona valores aleatórios dos arrays
        brand := brands[1 + floor(random() * array_length(brands, 1))];
        category := categories[1 + floor(random() * array_length(categories, 1))];
        size := sizes[1 + floor(random() * array_length(sizes, 1))];
        
        -- Gera nome e descrição
        name := brand || ' ' || 
                CASE category 
                    WHEN 'Esporte' THEN 'Pro ' || size
                    WHEN 'Casual' THEN 'Style ' || size
                    WHEN 'Social' THEN 'Classic ' || size
                    WHEN 'Running' THEN 'Runner ' || size
                    WHEN 'Training' THEN 'Train ' || size
                    WHEN 'Skatista' THEN 'Skate ' || size
                    WHEN 'Basketball' THEN 'Court ' || size
                    WHEN 'Futebol' THEN 'Soccer ' || size
                    WHEN 'Tennis' THEN 'Match ' || size
                    WHEN 'Caminhada' THEN 'Walk ' || size
                END;
                
        description := 'Calçado ' || category || ' da marca ' || brand || 
                      ' com tecnologia avançada de conforto e durabilidade. ' ||
                      'Ideal para ' || 
                      CASE category 
                          WHEN 'Esporte' THEN 'práticas esportivas'
                          WHEN 'Casual' THEN 'uso diário'
                          WHEN 'Social' THEN 'ocasiões formais'
                          WHEN 'Running' THEN 'corridas'
                          WHEN 'Training' THEN 'treinos'
                          WHEN 'Skatista' THEN 'skatistas'
                          WHEN 'Basketball' THEN 'basquete'
                          WHEN 'Futebol' THEN 'futebol'
                          WHEN 'Tennis' THEN 'tênis'
                          WHEN 'Caminhada' THEN 'caminhadas'
                      END;
        
        -- Gera preço aleatório entre 99.90 e 999.90
        price := 99.90 + random() * 900;
        
        -- Gera estoque aleatório entre 1 e 100
        stock := 1 + floor(random() * 100);
        
        -- Gera código de referência único
        ref_code := 'REF-' || 
                   chr(65 + floor(random() * 26)) || 
                   chr(65 + floor(random() * 26)) || 
                   to_char(floor(random() * 10000), 'FM0000');
        
        -- Insere o produto
        INSERT INTO produtos_cadastrados (
            name, 
            description, 
            price, 
            stock, 
            size, 
            brand, 
            category,
            reference_code
        ) VALUES (
            name,
            description,
            ROUND(price::numeric, 2),
            stock,
            size,
            brand,
            category,
            ref_code
        );
    END LOOP;
END $$;
