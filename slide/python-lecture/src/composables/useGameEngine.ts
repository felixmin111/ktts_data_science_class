import type { AnswerRecord, GameDefinition, GameQuestion } from '@/models/game.model'
import { buildRound, scoreAnswer } from '@/functions/game.function'

export type GamePhase = 'intro' | 'playing' | 'feedback' | 'finished'

/** Timer, streak and scoring logic shared by every quiz game. */
export function useGameEngine(game: MaybeRefOrGetter<GameDefinition>) {
  const scoreStore = useScoreStore()

  const phase = ref<GamePhase>('intro')
  const questions = ref<GameQuestion[]>([])
  const index = ref(0)
  const score = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const answers = ref<AnswerRecord[]>([])
  const secondsLeft = ref(0)
  const isNewBest = ref(false)

  const definition = computed(() => toValue(game))
  const current = computed(() => questions.value[index.value])
  const lastAnswer = computed(() => answers.value.at(-1))
  const correctCount = computed(() => answers.value.filter((answer) => answer.correct).length)
  const timePercent = computed(() =>
    Math.max(0, (secondsLeft.value / definition.value.secondsPerQuestion) * 100)
  )

  const { pause, resume } = useIntervalFn(
    () => {
      secondsLeft.value = Math.max(0, secondsLeft.value - 0.1)
      if (secondsLeft.value <= 0) answer(null)
    },
    100,
    { immediate: false }
  )

  function startQuestion() {
    secondsLeft.value = definition.value.secondsPerQuestion
    phase.value = 'playing'
    resume()
  }

  function start() {
    questions.value = buildRound(definition.value.bank, definition.value.questionsPerRound)
    index.value = 0
    score.value = 0
    streak.value = 0
    bestStreak.value = 0
    answers.value = []
    isNewBest.value = false
    startQuestion()
  }

  function answer(chosen: number | null) {
    if (phase.value !== 'playing' || !current.value) return
    pause()
    const correct = chosen === current.value.answer
    streak.value = correct ? streak.value + 1 : 0
    bestStreak.value = Math.max(bestStreak.value, streak.value)
    const points = scoreAnswer(correct, secondsLeft.value, streak.value)
    score.value += points
    answers.value.push({ questionIndex: index.value, chosen, correct, points })
    phase.value = 'feedback'
  }

  function next() {
    if (index.value + 1 >= questions.value.length) {
      phase.value = 'finished'
      isNewBest.value = scoreStore.record(definition.value.id, {
        score: score.value,
        correct: correctCount.value,
        total: questions.value.length,
        playedAt: new Date().toISOString()
      })
      return
    }
    index.value += 1
    startQuestion()
  }

  function quit() {
    pause()
    phase.value = 'intro'
  }

  onScopeDispose(pause)

  return {
    phase,
    questions,
    index,
    current,
    score,
    streak,
    bestStreak,
    answers,
    lastAnswer,
    correctCount,
    secondsLeft,
    timePercent,
    isNewBest,
    start,
    answer,
    next,
    quit
  }
}
