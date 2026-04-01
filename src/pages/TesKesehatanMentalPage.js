import { useEffect, useMemo, useRef, useState } from 'react';
import NavBar from '../components/NavBar';

const questions = [
  { text: 'Saya merasa sulit untuk rileks', category: 'Stress' },
  { text: 'Saya merasa mulut saya kering', category: 'Kecemasan' },
  { text: 'Saya tidak dapat mengalami perasaan positif', category: 'Depresi' },
  {
    text: 'Saya mengalami kesulitan bernafas tanpa sebab yang jelas',
    category: 'Kecemasan',
  },
  {
    text: 'Saya merasa sulit untuk melakukan hal-hal yang membutuhkan usaha',
    category: 'Depresi',
  },
  {
    text: 'Saya cenderung bereaksi berlebihan terhadap situasi',
    category: 'Stress',
  },
  {
    text: 'Saya merasa gemetar (tremor) tanpa alasan yang jelas',
    category: 'Kecemasan',
  },
  {
    text: 'Saya merasa sulit untuk melakukan aktivitas sehari-hari',
    category: 'Depresi',
  },
  { text: 'Saya merasa tidak sabar atau mudah marah', category: 'Stress' },
  { text: 'Saya sering merasa gugup atau cemas', category: 'Kecemasan' },
  {
    text: 'Saya merasa sangat sulit untuk menenangkan diri setelah sesuatu mengganggu saya',
    category: 'Stress',
  },
  {
    text: 'Saya merasa sedih dan depresi tanpa alasan yang jelas',
    category: 'Depresi',
  },
  {
    text: 'Saya mengalami kesulitan menelan karena tegang',
    category: 'Kecemasan',
  },
  {
    text: 'Saya kehilangan minat dalam berbagai hal yang biasa saya nikmati',
    category: 'Depresi',
  },
  { text: 'Saya merasa mudah tersinggung', category: 'Stress' },
  {
    text: 'Saya merasakan getaran dalam tubuh saya tanpa sebab yang jelas',
    category: 'Kecemasan',
  },
  { text: 'Saya merasa tidak berharga', category: 'Depresi' },
  {
    text: 'Saya merasa tidak sabar atau tidak tahan dalam situasi tertentu',
    category: 'Stress',
  },
  { text: 'Saya merasa panik tanpa alasan yang jelas', category: 'Kecemasan' },
];

const answerOptions = [
  { label: 'Tidak Pernah', value: 0 },
  { label: 'Kadang-kadang', value: 1 },
  { label: 'Sering', value: 2 },
  { label: 'Sangat Sering', value: 3 },
];

function TesKesehatanMentalPage() {
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
      const scores = { Depresi: 0, Kecemasan: 0, Stress: 0 };
      questions.forEach((q, index) => {
        scores[q.category] += nextAnswers[index] ?? 0;
      });

      const url = new URL('/hasil-test', window.location.origin);
      const params = new URLSearchParams(window.location.search);
      params.set('depresi', String(scores.Depresi));
      params.set('kecemasan', String(scores.Kecemasan));
      params.set('stress', String(scores.Stress));
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
            <h1>Tes Kesehatan Mental</h1>
          </div>
        </div>
      </header>

      <section className="anxiety-test-section">
        <div className="anxiety-test-intro-wrap">
          <p className="anxiety-test-intro">
            Tes ini menggunakan pendekatan DASS-21 (Depression, Anxiety and
            Stress Scales) untuk melakukan penilaian kesehatan mental.
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
                  {currentQuestion + 1}. {questions[currentQuestion].text}
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

export default TesKesehatanMentalPage;
