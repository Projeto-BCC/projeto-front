document.addEventListener("DOMContentLoaded", function() {
    // Variáveis para as barras de vida e nomes
    let vidaPlayer = 30; // Vida inicial do jogador
    let vidaZika = 100; // Vida inicial do Zika
    const nomePlayer = "Player"; // Nome do jogador
    const nomeZika = "Zika"; // Nome do Zika
    let perguntasRespondidas = 0; // Contador de perguntas respondidas
    let perguntas = []; // Array de perguntas
    let perguntasAleatorias = []; // Array de perguntas em ordem aleatória

    // Função para atualizar as barras de vida
    function atualizarBarrasVida() {
        document.querySelector(".vida-atual-player").style.width = (vidaPlayer * 100 / 30) + "%";
        document.querySelector(".vida-player-valor").textContent = vidaPlayer;
        document.querySelector(".vida-atual-zika").style.width = (vidaZika * 100 / 100) + "%";
        document.querySelector(".vida-zika-valor").textContent = vidaZika;
    }

    // Função para exibir a mensagem de vitória
    function exibirMensagemVitoria(vencedor) {
        document.getElementById("mensagem-vitoria").textContent = `${vencedor} venceu o jogo!`;
        document.getElementById("mensagem-vitoria").style.display = "block";
        document.getElementById("btn-iniciar").textContent = "Reiniciar";
    }

    // Função para verificar a resposta do jogador
    function verificarResposta(respostaJogador, pergunta) {
        const respostaCorreta = pergunta.querySelector(".alternativa").getAttribute("data-resposta");
        if (respostaJogador.toLowerCase() === respostaCorreta) {
            // Resposta correta: o Zika toma 10 de dano
            vidaZika -= 10;
        } else {
            // Resposta incorreta: o jogador toma 10 de dano
            vidaPlayer -= 10;
        }
        atualizarBarrasVida();

        // Verificar se todas as perguntas foram respondidas
        perguntasRespondidas++;
        if (perguntasRespondidas === perguntasAleatorias.length) {
            // Todas as perguntas foram respondidas
            if (vidaPlayer <= 0) {
                exibirMensagemVitoria(nomeZika);
            } else {
                exibirMensagemVitoria(nomePlayer);
            }
        }
    }

    // Função para embaralhar as perguntas
    function embaralharPerguntas() {
        perguntasAleatorias = perguntas.slice(); // Copia o array de perguntas
        for (let i = perguntasAleatorias.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [perguntasAleatorias[i], perguntasAleatorias[j]] = [perguntasAleatorias[j], perguntasAleatorias[i]];
        }
    }

    // Função para exibir a próxima pergunta
    function exibirProximaPergunta() {
        const perguntasAtivas = document.querySelectorAll(".pergunta.ativa");
        perguntasAtivas.forEach((pergunta, index) => {
            pergunta.classList.remove("ativa");
        });

        const proximaPergunta = perguntasAtivas[0].nextElementSibling;
        if (proximaPergunta) {
            proximaPergunta.classList.add("ativa");
        } else {
            console.error("Não há próxima pergunta.");
        }
    }

    // Função para iniciar ou reiniciar o jogo
    function iniciarOuReiniciarJogo() {
        if (document.getElementById("btn-iniciar").textContent === "Iniciar Jogo") {
            iniciarJogo();
        } else {
            reiniciarJogo();
        }
    }

    // Função para iniciar o jogo
    function iniciarJogo() {
        vidaPlayer = 30;
        vidaZika = 100;
        perguntasRespondidas = 0;
        atualizarBarrasVida();
        embaralharPerguntas();
        const primeiraPergunta = document.querySelector('.pergunta');
        primeiraPergunta.classList.add('ativa');
        document.getElementById('btn-iniciar').textContent = 'Reiniciar Jogo';
    }

    // Função para reiniciar o jogo
    function reiniciarJogo() {
        vidaPlayer = 30;
        vidaZika = 100;
        perguntasRespondidas = 0;
        atualizarBarrasVida();
        embaralharPerguntas();
        document.getElementById('mensagem-vitoria').style.display = 'none';
        const primeiraPergunta = document.querySelector('.pergunta');
        primeiraPergunta.classList.add('ativa');
    }

    // Adicionar evento de clique para iniciar ou reiniciar o jogo
    document.getElementById("btn-iniciar").addEventListener("click", iniciarOuReiniciarJogo);

    // Adicionar evento de clique para as alternativas das perguntas
    const alternativas = document.querySelectorAll(".alternativa");
    alternativas.forEach(alternativa => {
        alternativa.addEventListener("click", function() {
            verificarResposta(this.getAttribute("data-resposta"), this.parentElement);
            setTimeout(exibirProximaPergunta, 5000);
        });
    });
});
