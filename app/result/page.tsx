'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface CTResult {
  ctName: string
  lapse: { name: string; description: string }
  extension1: { name: string; description: string }
  extension2: { name: string; description: string }
  reversal: { name: string; description: string }
  maximum: { name: string; description: string }
  domain: { name: string; environment: string; sureHit: string; weakness: string }
  grade: string
  flavour: string
}

function ResultPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<CTResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const archetype = searchParams.get('archetype') || ''
  const element = searchParams.get('element') || ''
  const personality = searchParams.get('personality') || ''
  const weakness = searchParams.get('weakness') || ''
  const name = searchParams.get('name') || 'Unknown Sorcerer'

  useEffect(() => {
    generateCT()
  }, [])

  async function generateCT() {
    setLoading(true)
    setError(null)
    try {
      const prompt = `You are a Jujutsu Kaisen lore expert. Generate a unique Cursed Technique for a sorcerer with these traits:
- Name: ${name}
- CT Archetype: ${archetype}
- Element/Theme: ${element}
- Personality: ${personality}  
- Main weakness: ${weakness}

The CT should feel authentic to JJK — grounded in a clear internal logic, reflecting the sorcerer's identity and flaws.

Respond ONLY with a JSON object, no markdown, no backticks, no preamble. Exactly this shape:
{
  "ctName": "name of the cursed technique",
  "lapse": { "name": "technique name", "description": "2-3 sentence description" },
  "extension1": { "name": "technique name", "description": "2-3 sentence description" },
  "extension2": { "name": "technique name", "description": "2-3 sentence description" },
  "reversal": { "name": "technique name", "description": "2-3 sentence description of reversed/positive energy version" },
  "maximum": { "name": "technique name", "description": "2-3 sentence description of maximum output technique" },
  "domain": { "name": "domain expansion name", "environment": "1 sentence visual description", "sureHit": "1 sentence sure-hit effect", "weakness": "1 sentence counterable weakness" },
  "grade": "Special Grade / Grade 1 / Semi-Grade 1 / Grade 2",
  "flavour": "one line flavour text that feels like something the sorcerer would say or think"
}`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await response.json()
      const text = data.content?.map((i: { type: string; text?: string }) => i.text || '').join('')
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed: CTResult = JSON.parse(clean)
      setResult(parsed)
    } catch (err) {
      setError('Failed to generate technique. Check your API key or try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-sm tracking-widest uppercase">Forging technique...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={generateCT} className="border border-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (!result) return null

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-12">

        <div className="space-y-2">
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">{name} · {result.grade}</p>
          <h1 className="text-4xl font-black tracking-tight">{result.ctName}</h1>
          <p className="text-neutral-400 italic text-sm">"{result.flavour}"</p>
        </div>

        <div className="h-px bg-neutral-800" />

        <Section label="Lapse" technique={result.lapse} />
        <Section label="Extension I" technique={result.extension1} />
        <Section label="Extension II" technique={result.extension2} />
        <Section label="Reversal" technique={result.reversal} accent />
        <Section label="Maximum" technique={result.maximum} accent />

        <div className="h-px bg-neutral-800" />

        <div className="space-y-4">
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Domain Expansion</p>
          <h3 className="text-xl font-bold">{result.domain.name}</h3>
          <div className="space-y-3">
            <InfoRow label="Environment" value={result.domain.environment} />
            <InfoRow label="Sure-Hit" value={result.domain.sureHit} />
            <InfoRow label="Weakness" value={result.domain.weakness} />
          </div>
        </div>

        <div className="h-px bg-neutral-800" />

        <div className="flex gap-3">
          <button
            onClick={generateCT}
            className="flex-1 border border-neutral-700 py-4 text-sm tracking-widest uppercase text-neutral-400 hover:border-white hover:text-white transition-colors"
          >
            Regenerate
          </button>
          <button
            onClick={() => router.push('/build')}
            className="flex-1 border border-white py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
          >
            Build New
          </button>
        </div>
      </div>
    </main>
  )
}

function Section({ label, technique, accent }: { label: string; technique: { name: string; description: string }; accent?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <p className={`text-xs tracking-[0.3em] uppercase ${accent ? 'text-neutral-300' : 'text-neutral-500'}`}>{label}</p>
        <div className="h-px flex-1 bg-neutral-800" />
      </div>
      <h3 className="text-lg font-bold">{technique.name}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{technique.description}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <p className="text-xs tracking-widest text-neutral-600 uppercase w-24 shrink-0 pt-0.5">{label}</p>
      <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultPageInner />
    </Suspense>
  )
}