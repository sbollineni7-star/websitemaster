import { useCallback, useEffect, useRef, useState } from 'react'

const MUSIC_ENABLED_STORAGE_KEY = 'sriBollineniMindfulnessMusicEnabledV2'
const MUSIC_VOLUME = 0.05
const CHORD_DURATION_MS = 16000
const BELL_DURATION_MS = 7000

const CHORDS = [
  [130.81, 196, 261.63, 329.63],
  [110, 164.81, 220, 261.63],
  [87.31, 130.81, 174.61, 261.63],
  [98, 146.83, 196, 261.63],
]

const BELL_NOTES = [523.25, 587.33, 659.25, 783.99]

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

type MusicGraph = {
  context: AudioContext
  masterGain: GainNode
  oscillators: OscillatorNode[]
  lfo: OscillatorNode
  chordTimer: number
  bellTimer: number
}

function shouldEnableMusicByDefault() {
  return window.localStorage.getItem(MUSIC_ENABLED_STORAGE_KEY) !== 'false'
}

function fadeGain(gainNode: GainNode, targetVolume: number, duration: number) {
  const now = gainNode.context.currentTime

  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(gainNode.gain.value, now)
  gainNode.gain.linearRampToValueAtTime(targetVolume, now + duration)
}

function playSoftBell(context: AudioContext, destination: AudioNode, echoDestination: AudioNode, frequency: number) {
  const now = context.currentTime
  const bellGain = context.createGain()
  const fundamentalGain = context.createGain()
  const harmonicGain = context.createGain()
  const fundamental = context.createOscillator()
  const harmonic = context.createOscillator()

  fundamental.type = 'sine'
  fundamental.frequency.value = frequency
  harmonic.type = 'sine'
  harmonic.frequency.value = frequency * 2.01

  fundamentalGain.gain.value = 0.55
  harmonicGain.gain.value = 0.18
  bellGain.gain.setValueAtTime(0.0001, now)
  bellGain.gain.exponentialRampToValueAtTime(0.07, now + 0.08)
  bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8)

  fundamental.connect(fundamentalGain)
  harmonic.connect(harmonicGain)
  fundamentalGain.connect(bellGain)
  harmonicGain.connect(bellGain)
  bellGain.connect(destination)
  bellGain.connect(echoDestination)

  fundamental.start(now)
  harmonic.start(now + 0.015)
  fundamental.stop(now + 5)
  harmonic.stop(now + 5)

  window.setTimeout(() => {
    fundamental.disconnect()
    harmonic.disconnect()
    fundamentalGain.disconnect()
    harmonicGain.disconnect()
    bellGain.disconnect()
  }, 5200)
}

function createMusicGraph() {
  const AudioContextConstructor =
    window.AudioContext || (window as AudioContextWindow).webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  const context = new AudioContextConstructor()
  const masterGain = context.createGain()
  const padGain = context.createGain()
  const filter = context.createBiquadFilter()
  const delay = context.createDelay()
  const feedback = context.createGain()
  const delayGain = context.createGain()
  const lfo = context.createOscillator()
  const lfoGain = context.createGain()
  const oscillators = CHORDS[0].map((frequency, index) => {
    const oscillator = context.createOscillator()
    const noteGain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    oscillator.detune.value = index * 1.8
    noteGain.gain.value = [0.28, 0.18, 0.13, 0.08][index]
    oscillator.connect(noteGain)
    noteGain.connect(padGain)
    oscillator.start()

    return oscillator
  })

  padGain.gain.value = 0.72
  padGain.connect(filter)

  filter.type = 'lowpass'
  filter.frequency.value = 520
  filter.Q.value = 0.45
  filter.connect(masterGain)

  delay.delayTime.value = 0.42
  feedback.gain.value = 0.18
  delayGain.gain.value = 0.2
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(delayGain)
  delayGain.connect(masterGain)

  lfo.frequency.value = 0.018
  lfoGain.gain.value = 0.004
  lfo.connect(lfoGain)
  lfoGain.connect(masterGain.gain)
  lfo.start()

  masterGain.gain.value = 0
  masterGain.connect(context.destination)

  let chordIndex = 0
  const chordTimer = window.setInterval(() => {
    chordIndex = (chordIndex + 1) % CHORDS.length
    const nextChord = CHORDS[chordIndex]

    oscillators.forEach((oscillator, index) => {
      oscillator.frequency.setTargetAtTime(nextChord[index], context.currentTime, 6)
    })
  }, CHORD_DURATION_MS)

  let bellIndex = 0
  const bellTimer = window.setInterval(() => {
    const note = BELL_NOTES[bellIndex % BELL_NOTES.length]
    bellIndex += 1
    playSoftBell(context, masterGain, delay, note)
  }, BELL_DURATION_MS)

  return {
    context,
    masterGain,
    oscillators,
    lfo,
    chordTimer,
    bellTimer,
  }
}

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const graphRef = useRef<MusicGraph | null>(null)

  const stopMusicGraph = useCallback(() => {
    const graph = graphRef.current

    if (!graph) {
      return
    }

    window.clearInterval(graph.chordTimer)
    window.clearInterval(graph.bellTimer)
    graph.oscillators.forEach((oscillator) => {
      oscillator.stop()
      oscillator.disconnect()
    })
    graph.lfo.stop()
    graph.lfo.disconnect()
    void graph.context.close()
    graphRef.current = null
  }, [])

  const getMusicGraph = useCallback(() => {
    if (graphRef.current && graphRef.current.context.state !== 'closed') {
      return graphRef.current
    }

    const graph = createMusicGraph()
    graphRef.current = graph
    return graph
  }, [])

  const playMusic = useCallback(
    async (shouldSavePreference = true) => {
      const graph = getMusicGraph()

      if (!graph) {
        return false
      }

      try {
        await graph.context.resume()
        fadeGain(graph.masterGain, MUSIC_VOLUME, 2.8)
        setIsPlaying(true)

        if (shouldSavePreference) {
          window.localStorage.setItem(MUSIC_ENABLED_STORAGE_KEY, 'true')
        }

        return true
      } catch {
        setIsPlaying(false)
        return false
      }
    },
    [getMusicGraph],
  )

  const pauseMusic = useCallback(() => {
    const graph = graphRef.current

    if (!graph) {
      return
    }

    fadeGain(graph.masterGain, 0, 0.8)
    window.setTimeout(() => {
      if (graphRef.current === graph) {
        void graph.context.suspend()
      }
    }, 850)
    setIsPlaying(false)
    window.localStorage.setItem(MUSIC_ENABLED_STORAGE_KEY, 'false')
  }, [])

  useEffect(() => {
    if (!shouldEnableMusicByDefault()) {
      return undefined
    }

    let isListeningForGesture = true

    const tryPlayMusic = () => {
      void playMusic(false).then((didStart) => {
        if (!didStart || !isListeningForGesture) {
          return
        }

        document.removeEventListener('pointerdown', tryPlayMusic, true)
        document.removeEventListener('keydown', tryPlayMusic, true)
        isListeningForGesture = false
      })
    }

    tryPlayMusic()
    document.addEventListener('pointerdown', tryPlayMusic, true)
    document.addEventListener('keydown', tryPlayMusic, true)

    return () => {
      isListeningForGesture = false
      document.removeEventListener('pointerdown', tryPlayMusic, true)
      document.removeEventListener('keydown', tryPlayMusic, true)
    }
  }, [playMusic])

  useEffect(() => {
    return () => {
      stopMusicGraph()
    }
  }, [stopMusicGraph])

  const handleToggleMusic = () => {
    if (isPlaying) {
      pauseMusic()
      return
    }

    void playMusic()
  }

  return (
    <button
      type="button"
      className={`music-toggle ${isPlaying ? 'active' : ''}`}
      onClick={handleToggleMusic}
      aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
      aria-pressed={isPlaying}
      title={isPlaying ? 'Turn music off' : 'Turn music on'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="music-toggle-icon">
        <path
          fill="currentColor"
          d="M9 18.5A2.5 2.5 0 1 1 6.5 16H8V6.3c0-.46.31-.86.75-.97l8-2A1 1 0 0 1 18 4.3V15a2.5 2.5 0 1 1-1-2V8.58l-7 1.75v8.17Zm1-10.23 7-1.75V5.58l-7 1.75v.94Z"
        />
      </svg>
    </button>
  )
}
