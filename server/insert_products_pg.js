const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shoestock',
    password: 'postgres',
    port: 5432,
});

const products = [
    ['Tênis Air Max', 'Tênis esportivo com tecnologia de amortecimento', 599.99, 30, '40', 'Nike', 'Esporte', 'NK-AM-001'],
    ['Tênis Ultraboost', 'Tênis para corrida com tecnologia boost', 699.99, 25, '42', 'Adidas', 'Esporte', 'AD-UB-001'],
    ['Sapato Oxford', 'Sapato social em couro legítimo', 299.99, 20, '41', 'Social Comfort', 'Social', 'SC-OX-001'],
    ['Chinelo Slide', 'Chinelo confortável para uso casual', 89.99, 50, '38', 'Havaianas', 'Casual', 'HV-SL-001'],
    ['Tênis Casual Couro', 'Tênis casual em couro natural', 259.99, 35, '39', 'West Coast', 'Casual', 'WC-TC-001'],
    ['Sapatênis Moderno', 'Sapatênis versátil para o dia a dia', 179.99, 40, '43', 'Pegada', 'Casual', 'PG-SM-001'],
    ['Bota Coturno', 'Bota estilo militar em couro', 399.99, 15, '40', 'Caterpillar', 'Botas', 'CT-BC-001'],
    ['Sandália Anabela', 'Sandália feminina com salto anabela', 159.99, 30, '37', 'Via Marte', 'Feminino', 'VM-SA-001'],
    ['Tênis Skate Pro', 'Tênis específico para skatistas', 249.99, 25, '41', 'DC Shoes', 'Esporte', 'DC-SP-001'],
    ['Mocassim Casual', 'Mocassim em couro macio', 189.99, 20, '42', 'Democrata', 'Casual', 'DM-MC-001'],
    ['Tênis Running Pro', 'Tênis profissional para corrida', 799.99, 15, '40', 'Asics', 'Esporte', 'AS-RP-001'],
    ['Sapato Loafer', 'Sapato estilo loafer em couro', 279.99, 25, '41', 'Samello', 'Social', 'SM-LF-001'],
    ['Tênis Basquete Air', 'Tênis para basquete com amortecimento', 649.99, 20, '44', 'Nike', 'Esporte', 'NK-BA-001'],
    ['Sandália Rasteira', 'Sandália feminina casual', 99.99, 45, '36', 'Melissa', 'Feminino', 'ML-SR-001'],
    ['Tênis Classic', 'Tênis clássico em lona', 159.99, 50, '39', 'Converse', 'Casual', 'CV-TC-001'],
    ['Bota Chelsea', 'Bota chelsea em couro', 359.99, 20, '42', 'Richards', 'Botas', 'RC-BC-001'],
    ['Tênis Slip On', 'Tênis sem cadarço casual', 129.99, 40, '38', 'Vans', 'Casual', 'VN-SO-001'],
    ['Sapato Brogue', 'Sapato social estilo brogue', 399.99, 15, '41', 'Carlos Santos', 'Social', 'CS-SB-001'],
    ['Tênis Crossfit', 'Tênis para treino intenso', 549.99, 25, '43', 'Reebok', 'Esporte', 'RB-CF-001'],
    ['Chinelo Massageador', 'Chinelo com palmilha massageadora', 79.99, 60, '39', 'Rider', 'Casual', 'RD-CM-001'],
    ['Tênis Caminhada', 'Tênis para trilha e caminhada', 429.99, 20, '42', 'Merrell', 'Esporte', 'MR-TC-001'],
    ['Sapato Monk Strap', 'Sapato social com fivela', 459.99, 15, '40', 'Oxford', 'Social', 'OX-MS-001'],
    ['Tênis Infantil Led', 'Tênis infantil com luzes led', 149.99, 35, '30', 'Pampili', 'Infantil', 'PM-IL-001'],
    ['Sandália Plataforma', 'Sandália com salto plataforma', 199.99, 25, '37', 'Schutz', 'Feminino', 'SC-SP-001'],
    ['Tênis Futsal', 'Tênis para futsal indoor', 279.99, 30, '41', 'Penalty', 'Esporte', 'PN-TF-001'],
    ['Mocassim Drive', 'Mocassim estilo driver', 229.99, 20, '42', 'Ferracini', 'Casual', 'FR-MD-001'],
    ['Tênis Performance', 'Tênis para alta performance', 899.99, 15, '43', 'Under Armour', 'Esporte', 'UA-TP-001'],
    ['Sapato Derby', 'Sapato social derby em couro', 329.99, 20, '41', 'Democrata', 'Social', 'DM-SD-001'],
    ['Tênis Casual Premium', 'Tênis casual em material premium', 459.99, 25, '40', 'Lacoste', 'Casual', 'LC-CP-001'],
    ['Chinelo Ortopédico', 'Chinelo com suporte para arco', 159.99, 30, '38', 'Ortopé', 'Conforto', 'OR-CO-001'],
    ['Tênis Volleyball', 'Tênis específico para vôlei', 499.99, 20, '42', 'Mizuno', 'Esporte', 'MZ-TV-001'],
    ['Sapato Espadrille', 'Sapato estilo espadrille', 159.99, 35, '39', 'Alpargatas', 'Casual', 'AL-ES-001'],
    ['Tênis Trail', 'Tênis para corrida em trilha', 599.99, 15, '41', 'Salomon', 'Esporte', 'SL-TT-001'],
    ['Bota Trabalho', 'Bota de segurança com bico', 259.99, 25, '42', 'Bracol', 'Trabalho', 'BR-BT-001'],
    ['Tênis Fashion', 'Tênis moderno e estiloso', 359.99, 30, '39', 'Zara', 'Casual', 'ZR-TF-001'],
    ['Sandália Salto', 'Sandália com salto alto', 289.99, 20, '37', 'Santa Lolla', 'Feminino', 'SL-SS-001'],
    ['Tênis Lifestyle', 'Tênis para uso diário', 299.99, 35, '41', 'New Balance', 'Casual', 'NB-TL-001'],
    ['Sapato Venetian', 'Sapato estilo veneziano', 379.99, 15, '42', 'Meermin', 'Social', 'MM-SV-001'],
    ['Tênis Infantil Velcro', 'Tênis infantil com fechamento em velcro', 129.99, 40, '28', 'Klin', 'Infantil', 'KL-IV-001'],
    ['Chinelo Beach', 'Chinelo para praia', 69.99, 60, '40', 'Ipanema', 'Casual', 'IP-CB-001'],
    ['Tênis Academia', 'Tênis para musculação', 329.99, 25, '43', 'Olympikus', 'Esporte', 'OL-TA-001'],
    ['Sapato Casual Nobuck', 'Sapato em nobuck', 259.99, 20, '41', 'Reserva', 'Casual', 'RV-CN-001'],
    ['Tênis Running Light', 'Tênis leve para corrida', 449.99, 30, '40', 'Fila', 'Esporte', 'FL-RL-001'],
    ['Bota Aventura', 'Bota para trilhas e aventuras', 499.99, 15, '42', 'Timberland', 'Botas', 'TB-BA-001'],
    ['Tênis Retro', 'Tênis estilo retrô', 279.99, 35, '39', 'Puma', 'Casual', 'PM-TR-001'],
    ['Sandália Comfort', 'Sandália super confortável', 179.99, 40, '38', 'Usaflex', 'Conforto', 'UF-SC-001'],
    ['Tênis Court', 'Tênis para tênis e padel', 399.99, 20, '41', 'Wilson', 'Esporte', 'WL-TC-001'],
    ['Sapato Penny Loafer', 'Sapato penny loafer clássico', 429.99, 15, '42', 'Johnston & Murphy', 'Social', 'JM-PL-001'],
    ['Tênis High Top', 'Tênis cano alto estiloso', 359.99, 25, '40', 'AllStar', 'Casual', 'AS-HT-001'],
    ['Chinelo Home', 'Chinelo para uso doméstico', 89.99, 50, '39', 'Moleca', 'Casual', 'ML-CH-001'],
    ['Tênis Soccer', 'Chuteira para campo', 299.99, 30, '41', 'Umbro', 'Esporte', 'UM-TS-001'],
    ['Sapato Mule', 'Sapato estilo mule feminino', 199.99, 35, '37', 'Arezzo', 'Feminino', 'AZ-SM-001']
];

async function insertProducts() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const insertQuery = `
            INSERT INTO produtos_cadastrados 
            (name, description, price, stock, size, brand, category, reference_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (reference_code) DO NOTHING
        `;

        for (const product of products) {
            await client.query(insertQuery, product);
            console.log(`Produto inserido: ${product[0]}`);
        }

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
