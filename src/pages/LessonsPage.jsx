import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lessonsCategories } from '../data/lessons';

const LEVEL_COLOR = {
  'مبتدئ':  { bg: 'rgba(45,106,79,0.2)',   color: '#4ade80' },
  'متوسط':  { bg: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' },
  'متقدم':  { bg: 'rgba(180,60,60,0.15)',  color: '#f87171' },
};

/* ── Quiz Component ── */
function QuizSection({ quiz }) {
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmit]  = useState(false);
  const score = submitted
    ? quiz.filter((q, i) => answers[i] === q.correct).length
    : 0;

  const pick = (qi, oi) => { if (!submitted) setAnswers(p => ({ ...p, [qi]: oi })); };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--color-gold)' }}>
        🧠 اختبر فهمك
      </h3>

      {quiz.map((q, qi) => (
        <div key={qi} className="rounded-xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <p className="arabic-text text-sm font-semibold mb-3" style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const picked   = answers[qi] === oi;
              const isRight  = submitted && oi === q.correct;
              const isWrong  = submitted && picked && oi !== q.correct;
              return (
                <button key={oi} onClick={() => pick(qi, oi)}
                  className="w-full text-right px-4 py-2.5 rounded-lg text-sm transition-all arabic-text"
                  style={{
                    background: isRight ? 'rgba(45,106,79,0.25)'
                              : isWrong ? 'rgba(239,68,68,0.15)'
                              : picked  ? 'rgba(212,175,55,0.15)'
                              : 'var(--color-surface-2)',
                    border: isRight ? '1px solid rgba(45,106,79,0.5)'
                          : isWrong ? '1px solid rgba(239,68,68,0.4)'
                          : picked  ? '1px solid rgba(212,175,55,0.4)'
                          : '1px solid var(--color-border)',
                    color: isRight ? '#4ade80' : isWrong ? '#f87171' : 'var(--color-text)',
                    cursor: submitted ? 'default' : 'pointer',
                  }}>
                  {isRight && '✓ '}{isWrong && '✗ '}{opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmit(true)}
          disabled={Object.keys(answers).length < quiz.length}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background: Object.keys(answers).length === quiz.length
              ? 'linear-gradient(135deg, var(--color-gold), var(--color-accent))'
              : 'var(--color-surface-2)',
            color: Object.keys(answers).length === quiz.length ? '#0d2318' : 'var(--color-text-muted)',
            opacity: Object.keys(answers).length < quiz.length ? 0.6 : 1,
          }}>
          تحقق من الإجابات
        </button>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center p-4 rounded-2xl"
          style={{
            background: score === quiz.length ? 'rgba(45,106,79,0.2)' : 'rgba(212,175,55,0.1)',
            border: `1px solid ${score === quiz.length ? 'rgba(45,106,79,0.4)' : 'rgba(212,175,55,0.3)'}`,
          }}>
          <p className="text-3xl mb-2">{score === quiz.length ? '🏆' : score > quiz.length / 2 ? '👍' : '📚'}</p>
          <p className="font-bold text-lg" style={{ color: score === quiz.length ? '#4ade80' : 'var(--color-gold)' }}>
            {score} / {quiz.length} إجابة صحيحة
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {score === quiz.length ? 'ممتاز! أتقنت هذا الدرس' : 'راجع الدرس مرة أخرى'}
          </p>
          <button onClick={() => { setAnswers({}); setSubmit(false); }}
            className="mt-3 px-4 py-1.5 rounded-lg text-xs"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
            إعادة الاختبار
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ── Lesson Viewer ── */
function LessonViewer({ lesson, onBack }) {
  const lv = LEVEL_COLOR[lesson.level] || LEVEL_COLOR['مبتدئ'];
  const paragraphs = lesson.content.split('\n').filter(l => l.trim());

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }} className="space-y-4">

      {/* Back */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
        style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
        ← العودة
      </button>

      {/* Header */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-2))', border: '1px solid var(--color-border)' }}>
        <div className="absolute inset-0 opacity-5 pattern-overlay" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="font-bold arabic-text text-lg mb-1" style={{ color: 'var(--color-gold)' }}>
              {lesson.title}
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {lesson.categoryIcon} {lesson.categoryTitle}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: lv.bg, color: lv.color }}>
              {lesson.level}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>⏱ {lesson.duration}</span>
          </div>
        </div>
      </div>

      {/* Key points */}
      <div className="rounded-xl p-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>📌 النقاط الرئيسية</h3>
        <div className="flex flex-wrap gap-2">
          {lesson.keyPoints.map((kp, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full arabic-text"
              style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.2)' }}>
              {kp}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl p-5 space-y-3"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        {paragraphs.map((p, i) => (
          <p key={i} className="arabic-text text-sm" style={{
            color: p.startsWith('•') || /^\d+\./.test(p) ? 'var(--color-text)' : 'var(--color-text)',
            lineHeight: 2,
            fontWeight: p.endsWith(':') || p.startsWith('**') ? '600' : '400',
            color: p.includes('ﷺ') || p.includes('تعالى') ? 'var(--color-text)' : 'var(--color-text)',
          }}>
            {p.replace(/\*\*/g, '')}
          </p>
        ))}
      </div>

      {/* Quiz */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <QuizSection quiz={lesson.quiz} />
        </div>
      )}
    </motion.div>
  );
}

/* ── Main Page ── */
export default function LessonsPage() {
  const [selectedCat, setSelectedCat]     = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (selectedLesson) {
    return (
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          <LessonViewer key={selectedLesson.id} lesson={selectedLesson}
            onBack={() => setSelectedLesson(null)} />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold arabic-text" style={{ color: 'var(--color-gold)' }}>
          📚 الدروس الدينية
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {lessonsCategories.reduce((a, c) => a + c.lessons.length, 0)} درس في {lessonsCategories.length} أقسام
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedCat ? (
          /* Categories */
          <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">
            {lessonsCategories.map((cat, i) => (
              <motion.button key={cat.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCat(cat)}
                className="w-full text-right rounded-2xl p-4 transition-all"
                style={{ background: cat.color, border: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: 'rgba(0,0,0,0.1)' }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold arabic-text text-base" style={{ color: 'var(--color-text)' }}>
                      {cat.title}
                    </h3>
                    <p className="text-xs mt-0.5 arabic-text" style={{ color: 'var(--color-text-muted)' }}>
                      {cat.description}
                    </p>
                    <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                      {cat.lessons.length} درس
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          /* Lessons list */
          <motion.div key="lessons" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <button onClick={() => setSelectedCat(null)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              ← الأقسام
            </button>

            <div className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: selectedCat.color, border: '1px solid var(--color-border)' }}>
              <span className="text-3xl">{selectedCat.icon}</span>
              <div>
                <h2 className="font-bold arabic-text" style={{ color: 'var(--color-text)' }}>{selectedCat.title}</h2>
                <p className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>{selectedCat.description}</p>
              </div>
            </div>

            {selectedCat.lessons.map((lesson, i) => {
              const lv = LEVEL_COLOR[lesson.level] || LEVEL_COLOR['مبتدئ'];
              return (
                <motion.button key={lesson.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLesson({ ...lesson, categoryTitle: selectedCat.title, categoryIcon: selectedCat.icon })}
                  className="w-full text-right rounded-2xl p-4 transition-all"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-gold)' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold arabic-text text-sm" style={{ color: 'var(--color-text)' }}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>⏱ {lesson.duration}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: lv.bg, color: lv.color }}>
                          {lesson.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(45,106,79,0.15)', color: '#4ade80' }}>
                        {lesson.quiz?.length || 0} سؤال
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
