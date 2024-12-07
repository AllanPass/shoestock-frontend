const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shoestock',
    password: 'postgres',
    port: 5432,
});

async function insertProducts() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Primeira parte dos produtos
        await client.query(`
            INSERT INTO produtos_cadastrados (referencia, marca, descricao, preco, category)
            VALUES 
                ('NK-AM-001', 'Nike', 'Tênis Air Max - Tênis esportivo com tecnologia de amortecimento', 599.99, 'Esporte'),
                ('AD-UB-001', 'Adidas', 'Tênis Ultraboost - Tênis para corrida com tecnologia boost', 699.99, 'Esporte'),
                ('SC-OX-001', 'Social Comfort', 'Sapato Oxford - Sapato social em couro legítimo', 299.99, 'Social'),
                ('HV-SL-001', 'Havaianas', 'Chinelo Slide - Chinelo confortável para uso casual', 89.99, 'Casual'),
                ('WC-TC-001', 'West Coast', 'Tênis Casual Couro - Tênis casual em couro natural', 259.99, 'Casual'),
                ('PG-SM-001', 'Pegada', 'Sapatênis Moderno - Sapatênis versátil para o dia a dia', 179.99, 'Casual'),
                ('CT-BC-001', 'Caterpillar', 'Bota Coturno - Bota estilo militar em couro', 399.99, 'Botas'),
                ('VM-SA-001', 'Via Marte', 'Sandália Anabela - Sandália feminina com salto anabela', 159.99, 'Feminino'),
                ('DC-SP-001', 'DC Shoes', 'Tênis Skate Pro - Tênis específico para skatistas', 249.99, 'Esporte'),
                ('DM-MC-001', 'Democrata', 'Mocassim Casual - Mocassim em couro macio', 189.99, 'Casual')
            ON CONFLICT (referencia) DO NOTHING
        `);

        // Segunda parte dos produtos
        await client.query(`
            INSERT INTO produtos_cadastrados (referencia, marca, descricao, preco, category)
            VALUES 
                ('AS-RP-001', 'Asics', 'Tênis Running Pro - Tênis profissional para corrida', 799.99, 'Esporte'),
                ('SM-LF-001', 'Samello', 'Sapato Loafer - Sapato estilo loafer em couro', 279.99, 'Social'),
                ('NK-BA-001', 'Nike', 'Tênis Basquete Air - Tênis para basquete com amortecimento', 649.99, 'Esporte'),
                ('ML-SR-001', 'Melissa', 'Sandália Rasteira - Sandália feminina casual', 99.99, 'Feminino'),
                ('CV-TC-001', 'Converse', 'Tênis Classic - Tênis clássico em lona', 159.99, 'Casual'),
                ('RC-BC-001', 'Richards', 'Bota Chelsea - Bota chelsea em couro', 359.99, 'Botas'),
                ('VN-SO-001', 'Vans', 'Tênis Slip On - Tênis sem cadarço casual', 129.99, 'Casual'),
                ('CS-SB-001', 'Carlos Santos', 'Sapato Brogue - Sapato social estilo brogue', 399.99, 'Social'),
                ('RB-CF-001', 'Reebok', 'Tênis Crossfit - Tênis para treino intenso', 549.99, 'Esporte'),
                ('RD-CM-001', 'Rider', 'Chinelo Massageador - Chinelo com palmilha massageadora', 79.99, 'Casual')
            ON CONFLICT (referencia) DO NOTHING
        `);

        // Terceira parte dos produtos
        await client.query(`
            INSERT INTO produtos_cadastrados (referencia, marca, descricao, preco, category)
            VALUES 
                ('MR-TC-001', 'Merrell', 'Tênis Caminhada - Tênis para trilha e caminhada', 429.99, 'Esporte'),
                ('OX-MS-001', 'Oxford', 'Sapato Monk Strap - Sapato social com fivela', 459.99, 'Social'),
                ('PM-IL-001', 'Pampili', 'Tênis Infantil Led - Tênis infantil com luzes led', 149.99, 'Infantil'),
                ('SC-SP-001', 'Schutz', 'Sandália Plataforma - Sandália com salto plataforma', 199.99, 'Feminino'),
                ('PN-TF-001', 'Penalty', 'Tênis Futsal - Tênis para futsal indoor', 279.99, 'Esporte'),
                ('FR-MD-001', 'Ferracini', 'Mocassim Drive - Mocassim estilo driver', 229.99, 'Casual'),
                ('UA-TP-001', 'Under Armour', 'Tênis Performance - Tênis para alta performance', 899.99, 'Esporte'),
                ('DM-SD-001', 'Democrata', 'Sapato Derby - Sapato social derby em couro', 329.99, 'Social'),
                ('LC-CP-001', 'Lacoste', 'Tênis Casual Premium - Tênis casual em material premium', 459.99, 'Casual'),
                ('OR-CO-001', 'Ortopé', 'Chinelo Ortopédico - Chinelo com suporte para arco', 159.99, 'Conforto')
            ON CONFLICT (referencia) DO NOTHING
        `);

        // Quarta parte dos produtos
        await client.query(`
            INSERT INTO produtos_cadastrados (referencia, marca, descricao, preco, category)
            VALUES 
                ('MZ-TV-001', 'Mizuno', 'Tênis Volleyball - Tênis específico para vôlei', 499.99, 'Esporte'),
                ('AL-ES-001', 'Alpargatas', 'Sapato Espadrille - Sapato estilo espadrille', 159.99, 'Casual'),
                ('SL-TT-001', 'Salomon', 'Tênis Trail - Tênis para corrida em trilha', 599.99, 'Esporte'),
                ('BR-BT-001', 'Bracol', 'Bota Trabalho - Bota de segurança com bico', 259.99, 'Trabalho'),
                ('ZR-TF-001', 'Zara', 'Tênis Fashion - Tênis moderno e estiloso', 359.99, 'Casual'),
                ('SL-SS-001', 'Santa Lolla', 'Sandália Salto - Sandália com salto alto', 289.99, 'Feminino'),
                ('NB-TL-001', 'New Balance', 'Tênis Lifestyle - Tênis para uso diário', 299.99, 'Casual'),
                ('MM-SV-001', 'Meermin', 'Sapato Venetian - Sapato estilo veneziano', 379.99, 'Social'),
                ('KL-IV-001', 'Klin', 'Tênis Infantil Velcro - Tênis infantil com fechamento em velcro', 129.99, 'Infantil'),
                ('IP-CB-001', 'Ipanema', 'Chinelo Beach - Chinelo para praia', 69.99, 'Casual')
            ON CONFLICT (referencia) DO NOTHING
        `);

        // Quinta parte dos produtos
        await client.query(`
            INSERT INTO produtos_cadastrados (referencia, marca, descricao, preco, category)
            VALUES 
                ('OL-TA-001', 'Olympikus', 'Tênis Academia - Tênis para musculação', 329.99, 'Esporte'),
                ('RV-CN-001', 'Reserva', 'Sapato Casual Nobuck - Sapato em nobuck', 259.99, 'Casual'),
                ('FL-RL-001', 'Fila', 'Tênis Running Light - Tênis leve para corrida', 449.99, 'Esporte'),
                ('TB-BA-001', 'Timberland', 'Bota Aventura - Bota para trilhas e aventuras', 499.99, 'Botas'),
                ('PM-TR-001', 'Puma', 'Tênis Retro - Tênis estilo retrô', 279.99, 'Casual'),
                ('UF-SC-001', 'Usaflex', 'Sandália Comfort - Sandália super confortável', 179.99, 'Conforto'),
                ('WL-TC-001', 'Wilson', 'Tênis Court - Tênis para tênis e padel', 399.99, 'Esporte'),
                ('JM-PL-001', 'Johnston & Murphy', 'Sapato Penny Loafer - Sapato penny loafer clássico', 429.99, 'Social'),
                ('AS-HT-001', 'AllStar', 'Tênis High Top - Tênis cano alto estiloso', 359.99, 'Casual'),
                ('ML-CH-001', 'Moleca', 'Chinelo Home - Chinelo para uso doméstico', 89.99, 'Casual')
            ON CONFLICT (referencia) DO NOTHING
        `);

        await client.query('COMMIT');
        console.log('Todos os produtos foram inseridos com sucesso!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao inserir produtos:', error);
    } finally {
        client.release();
        pool.end();
    }
}

insertProducts();
