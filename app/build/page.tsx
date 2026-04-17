'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const ARCHETYPES = [
  {
    id: 'summoner',
    name: 'Summoner',
    desc: 'Power through entities, shikigami, or cursed spirits',
    examples: 'Geto, Megumi, Yuta',
  },
  {
    id: 'elemental',
    name: 'Elemental',
    desc: 'Manipulates a substance or natural force',
    examples: 'Choso, Uraume, Gojo',
  },
  {
    id: 'ruleset',
    name: 'Ruleset',
    desc: 'Imposes laws or conditions on reality',
    examples: 'Kirara, Naobito, Naoya',
  },
  {
    id: 'toggle',
    name: 'Toggle',
    desc: 'Binary on/off with significant consequences',
    examples: 'Todo, Inversion user',
  },
  {
    id: 'process',
    name: 'Process',
    desc: 'CT mirrors a real-world action or concept',
    examples: 'Sukuna, Higuruma',
  },
  {
    id: 'support',
    name: 'Support',
    desc: 'Primarily affects others, not the user',
    examples: 'Ui Ui, Yuki',
  },
  {
    id: 'traditionalist',
    name: 'Traditionalist',
    desc: 'Weapon or tool based, refined over generations',
    examples: 'Nobara, Megumi',
  },
  {
    id: 'reverse_engineered',
    name: 'Reverse Engineered',
    desc: 'Domain came first, CT built backward from it',
    examples: 'Hakari, Higuruma',
  },
]

const QUIZ_QUESTIONS = [
  {
    id: 'combat',
    question: 'How do you approach a fight?',
    options: [
      { label: 'I control distance and wait for mistakes', value: 'reactive' },
      { label: 'I set pace and pressure constantly', value: 'pressure' },
      { label: 'I adapt to whatever they give me', value: 'adaptive' },
      { label: 'I avoid direct confrontation entirely', value: 'evasive' },
    ],
  },
  {
    id: 'identity',
    question: 'What defines you most?',
    options: [
      { label: 'Patience and timing', value: 'patience' },
      { label: 'Raw intensity', value: 'intensity' },
      { label: 'Precision and technique', value: 'precision' },
      { label: 'Unpredictability', value: 'chaos' },
    ],
  },
  {
    id: 'element',
    question: 'What element resonates with you?',
    options: [
      { label: 'Fire / Heat', value: 'fire' },
      { label: 'Shadow / Void', value: 'shadow' },
      { label: 'Blood / Fluid', value: 'blood' },
      { label: 'Lightning / Speed', value: 'lightning' },
    ],
  },
  {
    id: 'weakness',
    question: 'What is your biggest flaw in a fight?',
    options: [
      { label: 'Slow to initiate', value: 'initiative' },
      { label: 'Reckless under pressure', value: 'reckless' },
      { label: 'Overthink in the moment', value: 'overthink' },
      { label: 'Stamina drops off', value: 'stamina' },
    ],
  },
]

function BuildPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<'select' | 'quiz' | 'manual'>('select')
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null)
  const [form, setForm] = useState({
    archetype: '',
    element: '',
    personality: '',
    weakness: '',
    name: '',
  })

  useEffect(() => {
    if (searchParams.get('mode') === 'random') {
      handleRandom()
    }
  }, [])

  function handleRandom() {
    const random = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)]
    const elements = ['fire', 'shadow', 'blood', 'lightning', 'ice', 'gravity', 'time', 'sound']
    const personalities = ['patient', 'aggressive', 'calculating', 'chaotic', 'honorable', 'ruthless']
    const weaknesses = ['close range', 'large cursed energy cost', 'requires line of sight', 'activation condition', 'cooldown period']
    router.push(`/result?archetype=${random.id}&element=${elements[Math.floor(Math.random() * elements.length)]}&personality=${personalities[Math.floor(Math.random() * personalities.length)]}&weakness=${weaknesses[Math.floor(Math.random() * weaknesses.length)]}&name=Unknown Sorcerer`)
  }

  function handleQuizAnswer(questionId: string, value: string) {
    const updated = { ...quizAnswers, [questionId]: value }
    setQuizAnswers(updated)
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      const params = new URLSearchParams({
        archetype: updated.combat === 'reactive' ? 'ruleset' : updated.combat === 'pressure' ? 'elemental' : updated.combat === 'adaptive' ? 'process' : 'toggle',
        element: updated.element || 'shadow',
        personality: updated.identity || 'adaptive',
        weakness: updated.weakness || 'initiative',
        name: 'Quiz Result',
        fromQuiz: 'true',
      })
      router.push(`/result?${params.toString()}`)
    }
  }

  function handleManualSubmit() {
    if (!form.archetype || !form.element || !form.personality || !form.weakness) return
    const params = new URLSearchParams(form)
    router.push(`/result?${params.toString()}`)
  }

  if (mode === 'select') {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full space-y-8">
          <div>
            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase mb-2">Step 1</p>
            <h2 className="text-2xl font-bold">How do you want to forge?</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setMode('quiz')}
              className="w-full text-left border border-neutral-700 p-5 hover:border-white transition-colors group"
            >
              <p className="font-semibold text-white group-hover:text-white">Take the Quiz</p>
              <p className="text-neutral-500 text-sm mt-1">Answer questions, we figure out your CT</p>
            </button>
            <button
              onClick={() => setMode('manual')}
              className="w-full text-left border border-neutral-700 p-5 hover:border-white transition-colors group"
            >
              <p className="font-semibold text-white">Build Manually</p>
              <p className="text-neutral-500 text-sm mt-1">Pick your archetype, element, and traits yourself</p>
            </button>
            <button
              onClick={handleRandom}
              className="w-full text-left border border-neutral-700 p-5 hover:border-white transition-colors group"
            >
              <p className="font-semibold text-white">Randomize</p>
              <p className="text-neutral-500 text-sm mt-1">Let fate decide</p>
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (mode === 'quiz') {
    const q = QUIZ_QUESTIONS[quizStep]
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full space-y-8">
          <div className="flex items-center gap-3">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 transition-colors ${i <= quizStep ? 'bg-white' : 'bg-neutral-800'}`}
              />
            ))}
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase mb-3">{quizStep + 1} / {QUIZ_QUESTIONS.length}</p>
            <h2 className="text-2xl font-bold">{q.question}</h2>
          </div>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleQuizAnswer(q.id, opt.value)}
                className="w-full text-left border border-neutral-700 px-5 py-4 text-sm hover:border-white hover:text-white text-neutral-300 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (mode === 'manual') {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full space-y-8">
          <div>
            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase mb-2">Manual Build</p>
            <h2 className="text-2xl font-bold">Define your technique</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs tracking-widest text-neutral-500 uppercase block mb-2">Your name / sorcerer name</label>
              <input
                type="text"
                placeholder="e.g. Micha, The Ashen Sorcerer..."
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-neutral-500 uppercase block mb-2">CT Archetype</label>
              <div className="grid grid-cols-2 gap-2">
                {ARCHETYPES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setForm({ ...form, archetype: a.id })}
                    className={`text-left p-3 border text-xs transition-colors ${form.archetype === a.id ? 'border-white text-white' : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                  >
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-neutral-600 mt-0.5 text-xs">{a.examples}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest text-neutral-500 uppercase block mb-2">Element / Theme</label>
              <input
                type="text"
                placeholder="e.g. fire, shadow, blood, gravity, sound..."
                value={form.element}
                onChange={e => setForm({ ...form, element: e.target.value })}
                className="w-full bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-neutral-500 uppercase block mb-2">Core personality trait</label>
              <input
                type="text"
                placeholder="e.g. patient, aggressive, calculating..."
                value={form.personality}
                onChange={e => setForm({ ...form, personality: e.target.value })}
                className="w-full bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-neutral-500 uppercase block mb-2">Main weakness / flaw</label>
              <input
                type="text"
                placeholder="e.g. slow to initiate, high CE cost, range limited..."
                value={form.weakness}
                onChange={e => setForm({ ...form, weakness: e.target.value })}
                className="w-full bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 text-sm"
              />
            </div>

            <button
              onClick={handleManualSubmit}
              disabled={!form.archetype || !form.element || !form.personality || !form.weakness}
              className="w-full border border-white text-white py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
            >
              Forge Technique
            </button>
          </div>
        </div>
      </main>
    )
  }
}

export default function BuildPage() {
  return (
    <Suspense>
      <BuildPageInner />
    </Suspense>
  )
}