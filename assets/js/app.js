let grafico;

async function getExchangeRate(targetCurrency) {
    try {
        const response = await fetch('https://mindicador.cl/api/');
        const data = await response.json();

        const selectedIndicator = data[targetCurrency === 'USD' ? 'dolar' : 'euro'];
        const exchangeRate = selectedIndicator.valor;

        return exchangeRate;
    } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error);
        return -1;
    }
}

function convertCurrency() {
    const monto = parseFloat(document.getElementById('monto').value);
    const targetCurrency = document.getElementById('moneda').value;

    if (isNaN(monto) || monto <= 0) {
        alert('Ingrese un monto válido');
        return;
    }

    getExchangeRate(targetCurrency)
    .then(rate => {
        if (rate === -1) {
            document.getElementById('resultado').textContent = 'Error al obtener tipo de cambio';
        } else {
            const resultado = monto / rate;
            document.getElementById('resultado').textContent = `El equivalente en ${targetCurrency} es: ${resultado.toFixed(2)}`;
            crearGrafico(targetCurrency);
        }
    });
}

async function cargarDatosSerie(targetCurrency) {
    try {
        const url = `https://mindicador.cl/api/${targetCurrency === 'USD' ? 'dolar' : 'euro'}`;
        const res = await fetch(url);
        const datosDias = await res.json();
        return datosDias.serie.slice(0, 10).reverse(); 
    } catch (error) {
        alert('Error al cargar datos para el gráfico: ' + error.message);
    }
}

// CREAR GRÁFICO //

async function crearGrafico(targetCurrency) {
    const datos = await cargarDatosSerie(targetCurrency);
    if (!datos) return;

    const labels = datos.map((inf) => new Date(inf.fecha).toLocaleDateString());
    const data = datos.map((inf) => inf.valor);

    const canvasGrafico = document.getElementById('myChart');
    if (grafico) {
        grafico.destroy(); 
    }

    grafico = new Chart(canvasGrafico, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor de ${targetCurrency} últimos 10 días`,
                data: data,
                borderColor: '#E08D79',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: '#0A151F' 
                    },
                    grid: {
                        color: '#0A151F'
                    }
                },
                y: {
                    ticks: {
                        color: '#0A151F' 
                    },
                    grid: {
                        color: '#0A151F' 
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#0A151F' 
                    }
                }
            }
        }
    });
}


const convertirButton = document.getElementById('convertir');
convertirButton.addEventListener('click', convertCurrency);