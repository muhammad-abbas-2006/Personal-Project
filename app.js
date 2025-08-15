    let questions = [];
    let currentIndex = 0;
    let score = 0;
    let timeLeft = 10 * 60; // 10 minutes
    let timerInterval;

    function startTimer() {
      const timerElement = document.createElement('div');
      timerElement.id = 'timer';
      document.getElementById('app').prepend(timerElement);

      timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
          clearInterval(timerInterval);
          endQuiz();
        }
      }, 1000);
    }

    function loadQuestion() {
      const q = questions[currentIndex];
      const options = [...q.incorrectAnswers, q.correctAnswer];
      options.sort(() => Math.random() - 0.5);

      document.getElementById('app').innerHTML = `
        <div id="quiz-screen">
          <div id="timer">${formatTime(timeLeft)}</div>
          <h2 id="question">Q${currentIndex + 1}: ${q.question.text}</h2>
          <div id="options">
            ${options.map(opt => `<div class="option">${opt}</div>`).join('')}
          </div>
          <button id="next-btn" style="display:none;">Next</button>
        </div>
      `;

      const optionDivs = document.querySelectorAll('.option');
      optionDivs.forEach(option => {
        option.addEventListener('click', () => selectOption(option, q.correctAnswer));
      });

      document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex++;
        if (currentIndex < questions.length) {
          loadQuestion();
        } else {
          endQuiz();
        }
      });
    }

    function selectOption(selected, correct) {
      const all = document.querySelectorAll('.option');
      all.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt.textContent === correct) {
          opt.classList.add('correct');
        } else if (opt === selected) {
          opt.classList.add('incorrect');
        }
      });

      if (selected.textContent === correct) {
        score++;
      }

      document.getElementById('next-btn').style.display = 'inline-block';
    }

    function endQuiz() {
      clearInterval(timerInterval);
      document.getElementById('app').innerHTML = `
        <div id="quiz-screen">
          <h2>Quiz Finished!</h2>
          <p>Your Score: ${score} / ${questions.length}</p>
          <button onclick="location.reload()">Try Again</button>
        </div>
      `;
    }

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    // Fetch and Start
    fetch('https://the-trivia-api.com/v2/questions?limit=10')
      .then(res => res.json())
      .then(data => {
        questions = data;
        loadQuestion();
        startTimer();
      });
