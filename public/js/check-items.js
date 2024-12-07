async function checkTotalItems() {
    try {
        const token = window.auth.getToken();
        const response = await fetch('http://localhost:3001/api/produtos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Total de itens:', data.length);
        return data.length;
    } catch (error) {
        console.error('Erro ao verificar total de itens:', error);
        throw error;
    }
}
