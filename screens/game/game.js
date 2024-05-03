const perguntas = [
    { pergunta: "Qual é o agente transmissor da dengue?", alternativas: ["Aedes aegypti", "Anopheles", "Culex", "Rhipicephalus"], resposta: "Aedes aegypti" },
    { pergunta: "Qual o período de incubação do vírus da dengue no organismo humano?", alternativas: ["1 dia", "3 dias", "5 dias", "7 dias"], resposta: "5 dias" },
    { pergunta: "Quais são os sintomas mais comuns da dengue?", alternativas: ["Febre alta, dor de cabeça e dor muscular", "Tosse e coriza", "Dor abdominal e diarreia", "Manchas vermelhas na pele"], resposta: "Febre alta, dor de cabeça e dor muscular" },
    { pergunta: "Qual é a principal medida de prevenção contra a dengue?", alternativas: ["Uso de repelentes", "Vacinação", "Eliminação de criadouros do mosquito", "Uso de mosquiteiros"], resposta: "Eliminação de criadouros do mosquito" }
];

let perguntaAtual = 0;
let respostasCorretas = 0;

const perguntaElement = document.getElementById("pergunta");
const alternativasElement = document.getElementById("alternativas");
const proximoButton = document.getElementById("proximo");
const resultadoElement = document.getElementById("resultado");
const iniciarButton = document.getElementById("iniciar");

function iniciarJogo() {
    iniciarButton.style.display = "none";
    perguntaElement.style.display = "block";
    alternativasElement.style.display = "block";
    proximoButton.style.display = "block";

    exibirPergunta();
}

function exibirPergunta() {
    const pergunta = perguntas[perguntaAtual];
    perguntaElement.innerText = pergunta.pergunta;

    alternativasElement.innerHTML = "";
    pergunta.alternativas.forEach((alternativa, index) => {
        const alternativaButton = document.createElement("button");
        alternativaButton.innerText = alternativa;
        alternativaButton.addEventListener("click", () => verificarResposta(alternativa));
        alternativasElement.appendChild(alternativaButton);
    });
}

function verificarResposta(respostaSelecionada) {
    const pergunta = perguntas[perguntaAtual];
    if (respostaSelecionada === pergunta.resposta) {
        respostasCorretas++;
        resultadoElement.innerText = "Resposta correta!";
    } else {
        resultadoElement.innerText = "Resposta incorreta!";
    }

    perguntaAtual++;
    if (perguntaAtual < perguntas.length) {
        exibirPergunta();
    } else {
        finalizarJogo();
    }
}

function finalizarJogo() {
    perguntaElement.innerText = "Fim do jogo!";
    alternativasElement.innerHTML = "";
    proximoButton.style.display = "none";

    if (respostasCorretas >= 3) {
        resultadoElement.innerText = "Parabéns! Você acertou " + respostasCorretas + " perguntas.";
    } else {
        resultadoElement.innerText = "Você não acertou o número mínimo de perguntas para ganhar.";
    }
}

// Adiciona evento de clique ao botão de iniciar jogo
iniciarButton.addEventListener("click", iniciarJogo);
