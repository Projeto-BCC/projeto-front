document.addEventListener("DOMContentLoaded", function () {
    const gameState = {
        playerLife: 30,
        zikaLife: 100,
        questionsAnswered: 0,
        isGameStarted: false,
    };

    let nomePlayer = "Player";
    let nomeZika = "Zika";
    let perguntas = [];
    let perguntasAleatorias = [];

    const homeScreen = document.getElementById('home-screen');
    const startGameButton = document.getElementById('start-game');

    // Função para ocultar a tela inicial
    function hideHomeScreen() {
        homeScreen.style.display = "none";
    }

    // Função para mostrar a tela inicial (apenas na primeira vez ou quando a página é carregada)
    function showHomeScreen() {
        homeScreen.style.display = "flex";
    }

    const gameStartedBefore = localStorage.getItem('gameStarted');
    if (!gameStartedBefore) {
        showHomeScreen();
        localStorage.setItem('gameStarted', 'true');
    }

    // Adiciona evento de clique ao botão "Começar" para ocultar a tela inicial e iniciar o jogo
    startGameButton.addEventListener('click', () => {
        hideHomeScreen();
        iniciarJogo(); // Chame sua função iniciarJogo
    });

    // Função para atualizar as barras de vida
    function atualizarBarrasVida() {
        document.querySelector(".player-hp-fill").style.width = (gameState.playerLife * 100 / 30) + "%";
        document.querySelector(".player-hp").textContent = gameState.playerLife + "/30";
        document.querySelector(".zika-hp-fill").style.width = (gameState.zikaLife * 100 / 100) + "%";
        document.querySelector(".zika-hp").textContent = gameState.zikaLife + "/100";
    }

    // Função para exibir a mensagem de vitória
    function exibirMensagemVitoria(vencedor) {
        document.getElementById("mensagem-vitoria").textContent = `${vencedor} venceu o jogo!`;
        document.getElementById("mensagem-vitoria").style.display = "block";
        document.getElementById("btn-iniciar").textContent = "Reiniciar";
    }

    const perguntasElements = document.querySelectorAll(".pergunta");

    // Função para embaralhar as perguntas
    function embaralharPerguntas() {
        perguntas = document.querySelectorAll(".pergunta");
        perguntasAleatorias = Array.from(perguntas);
        for (let i = perguntasAleatorias.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [perguntasAleatorias[i], perguntasAleatorias[j]] = [perguntasAleatorias[j], perguntasAleatorias[i]];
        }
    }

    // Função para exibir a próxima pergunta
    function exibirProximaPergunta() {
        const perguntasAtivas = document.querySelectorAll(".pergunta.ativa");
        perguntasAtivas.forEach(pergunta => {
            pergunta.classList.remove("ativa");
        });

        if (gameState.questionsAnswered < perguntasAleatorias.length) {
            let proximaPergunta = perguntasAleatorias[gameState.questionsAnswered];
            proximaPergunta.classList.add("ativa");
        }
    }

    // Função para iniciar ou reiniciar o jogo
    document.getElementById("btn-iniciar").addEventListener("click", () => {
        if (!gameState.isGameStarted) {
            iniciarJogo();
        } else {
            reiniciarJogo();
        }
    });

    // Função para iniciar o jogo
    function iniciarJogo() {
        gameState.isGameStarted = true;
        embaralharPerguntas();
        exibirProximaPergunta();
        document.getElementById("btn-iniciar").textContent = "Reiniciar Jogo";
        atualizarBarrasVida();
    }

    function reiniciarJogo() {
        gameState.playerLife = 30;
        gameState.zikaLife = 100;
        atualizarBarrasVida();

        gameState.questionsAnswered = 0;
        gameState.isGameStarted = true;

        document.getElementById("mensagem-vitoria").style.display = "none";
        document.getElementById("btn-iniciar").textContent = "Reiniciar Jogo";

        perguntasElements.forEach(pergunta => {
            pergunta.classList.remove("ativa");
            pergunta.respondida = false;
            pergunta.querySelectorAll(".alternativa").forEach(alternativa => {
                alternativa.classList.remove("correct", "incorrect");
            });
        });

        embaralharPerguntas();
        perguntasAleatorias[0].classList.add("ativa");
    }

    // Função para verificar a resposta do jogador
    function verificarResposta(respostaJogador, pergunta) {
        if (pergunta.respondida) return;
        pergunta.respondida = true;

        const respostaCorreta = pergunta.querySelector("[data-resposta-certa='true']").getAttribute("data-resposta");
        if (respostaJogador.toLowerCase() === respostaCorreta) {
            gameState.zikaLife -= 10;
            const zikaSprite = document.querySelector('.zika-sprite');
            const zikaHpBar = document.querySelector('.zika-hp-fill');
            flash(zikaSprite, zikaHpBar, false);
            const respostaCorretaElement = pergunta.querySelector("[data-resposta-certa='true']");
            respostaCorretaElement.classList.add('correct');
        } else {
            gameState.playerLife -= 10;
            const playerSprite = document.querySelector('.player-sprite');
            const playerHpBar = document.querySelector('.player-hp-fill');
            flash(playerSprite, playerHpBar, true);
            const respostaErradaElement = pergunta.querySelector(`[data-resposta="${respostaJogador}"]`);
            respostaErradaElement.classList.add('incorrect');
            const respostaCorretaElement = pergunta.querySelector("[data-resposta-certa='true']");
            respostaCorretaElement.classList.add('correct');
        }
        atualizarBarrasVida();

        if (gameState.playerLife <= 0) {
            exibirMensagemVitoria(nomeZika);
        } else if (gameState.zikaLife <= 0) {
            exibirMensagemVitoria(nomePlayer);
        } else {
            gameState.questionsAnswered++;
            if (gameState.questionsAnswered < perguntasAleatorias.length) {
                setTimeout(exibirProximaPergunta, 3000);
            }
        }
    }

    let playerFlashInProgress = false;
    let zikaFlashInProgress = false;

    function flash(sprite, hpBar, isPlayer) {
        if (isPlayer && playerFlashInProgress) return;
        if (!isPlayer && zikaFlashInProgress) return;

        if (isPlayer) playerFlashInProgress = true;
        else zikaFlashInProgress = true;

        let flashCount = 0;
        const flashInterval = setInterval(() => {
            if (flashCount < 10) {
                sprite.style.opacity = sprite.style.opacity === '1' ? '0.5' : '1';
                hpBar.style.background = hpBar.style.background === '' ? 'linear-gradient(to right, white 100%, white 100%)' : '';
                flashCount++;
            } else {
                clearInterval(flashInterval);
                sprite.style.opacity = '1';
                hpBar.style.background = '';
                if (isPlayer) playerFlashInProgress = false;
                else zikaFlashInProgress = false;
            }
        }, 150);
    }

    const alternativas = document.querySelectorAll(".alternativa");
    alternativas.forEach(alternativa => {
        alternativa.addEventListener("click", function () {
            const pergunta = this.parentElement;
            if (pergunta.respondida) return;
            verificarResposta(this.getAttribute("data-resposta"), pergunta);
        });
    });

    // Verificar se a tela inicial já foi exibida
    if (!localStorage.getItem('telaInicialVista')) {
        document.getElementById("tela-inicial").style.display = 'flex';
        document.getElementById("btn-iniciar-jogo").addEventListener("click", function () {
            document.getElementById("tela-inicial").style.display = 'none';
            localStorage.setItem('telaInicialVista', 'true');
            iniciarJogo();
        });
    } else {
        iniciarJogo();
    }
});
