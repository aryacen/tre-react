import { useEffect, useMemo, useRef, useState } from 'react';
import NavBar from '../components/NavBar';

const questions = [
  'Saya merasa gugup, cemas, atau tegang',
  'Saya merasa tidak dapat mengendalikan kekhawatiran saya',
  'Saya khawatir terlalu banyak tentang berbagai hal',
  'Saya merasa sulit untuk rileks',
  'Saya sangat gelisah sehingga sulit untuk duduk diam',
  'Saya mudah marah atau terganggu',
  'Saya merasa takut bahwa sesuatu yang buruk akan terjadi',
  'Saya mengalami kesulitan tidur karena kecemasan',
  'Saya merasa jantung saya berdebar lebih cepat tanpa alasan jelas',
  'Saya sering mengalami sakit kepala atau ketegangan otot akibat stres',
  'Saya merasa sulit untuk fokus karena pikiran saya dipenuhi kekhawatiran',
  'Saya merasa sesak napas atau seperti ada tekanan di dada saya',
  'Saya sering merasa lelah atau kehilangan energi akibat stres',
  'Saya menghindari situasi sosial karena takut merasa cemas',
  'Saya mengalami serangan panik tiba-tiba tanpa penyebab yang jelas',
  'Saya merasa bahwa saya terlalu khawatir tentang hal-hal kecil',
  'Saya sering menggigit kuku, mengetuk-ngetukkan kaki, atau gelisah secara fisik',
  'Saya merasa sulit untuk membuat keputusan karena takut salah',
  'Saya sering merasa mual atau tidak nyaman di perut akibat kecemasan',
  'Saya merasa bahwa saya tidak bisa mengendalikan perasaan cemas saya',
];

const answerOptions = [
  { label: 'Tidak Pernah', value: 0 },
  { label: 'Beberapa hari', value: 1 },
  { label: 'Lebih dari setengah waktu', value: 2 },
  { label: 'Hampir setiap hari', value: 3 },
];

function getInterpretation(score) {
  if (score <= 4) {
    return 'Minimal Anxiety';
  }
  if (score <= 9) {
    return 'Mild Anxiety';
  }
  if (score <= 14) {
    return 'Moderate Anxiety';
  }
  return 'Severe Anxiety';
}

function TesKecemasanBerlebihPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [isCalculating, setIsCalculating] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const progress = useMemo(
    () => Math.round((currentQuestion / questions.length) * 100),
    [currentQuestion]
  );

  const handleFinish = (nextAnswers) => {
    setIsCalculating(true);
    timeoutRef.current = setTimeout(() => {
      const score = nextAnswers.reduce((total, value) => total + (value ?? 0), 0);
      const interpretation = getInterpretation(score);
      const url = new URL('/hasil-test', window.location.origin);
      const params = new URLSearchParams(window.location.search);
      params.set('kecemasan', interpretation);
      url.search = params.toString();
      window.location.assign(url.toString());
    }, 2000);
  };

  const handleAnswer = (value) => {
    if (isCalculating) {
      return;
    }

    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = value;
    setAnswers(nextAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    handleFinish(nextAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] == null || isCalculating) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    handleFinish(answers);
  };

  return (
    <div className="simple-page anxiety-test-page">
      <header
        className="tre-about-hero testimonial-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/tes.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-about-hero-inner">
          <div className="tre-about-hero-copy">
            <h1>Tes Kecemasan</h1>
          </div>
        </div>
      </header>

      <section className="anxiety-test-section">
        <div className="anxiety-test-intro-wrap">
          <p className="anxiety-test-intro">
            Tes ini menggunakan pendekatan GAD-7 (Generalized Anxiety
            Disorder-7) untuk melakukan penilaian tingkat kecemasan.
          </p>
        </div>

        <div className="anxiety-test-container">
          {isCalculating ? (
            <div className="anxiety-test-loading" role="status" aria-live="polite">
              <div className="anxiety-test-spinner" />
              <p>Menghitung hasil...</p>
            </div>
          ) : (
            <>
              <div className="anxiety-test-progress-bar">
                <div style={{ width: `${progress}%` }} />
              </div>

              <div className="anxiety-test-question">
                <p>
                  {currentQuestion + 1}. {questions[currentQuestion]}
                </p>
              </div>

              <div className="anxiety-test-answers">
                {answerOptions.map((option) => (
                  <button
                    className={`anxiety-test-answer${
                      answers[currentQuestion] === option.value ? ' is-selected' : ''
                    }`}
                    key={option.label}
                    type="button"
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="anxiety-test-actions">
                <button
                  className="anxiety-test-back"
                  type="button"
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  aria-label="Pertanyaan sebelumnya"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M15 6l-6 6 6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className="anxiety-test-next"
                  type="button"
                  onClick={handleNext}
                  disabled={answers[currentQuestion] == null}
                  aria-label="Pertanyaan berikutnya"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M9 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default TesKecemasanBerlebihPage;
