document.addEventListener("DOMContentLoaded", function() {
    fetchDadosDengue();
});

function fetchDadosDengue() {
    const apiUrl = "/proxy";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const latestData = data[0];
            const numCasosEst = latestData.casos_est;
            const numCasos = latestData.casos;
            document.getElementById('num-casos-est').textContent = numCasosEst;
            document.getElementById('num-casos').textContent = numCasos;
        })
        .catch(error => console.error('Erro ao buscar dados da API:', error));
}