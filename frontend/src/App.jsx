
import { useEffect, useState } from 'react'
import './App.css'

const moods = [
  { name: 'Happy', emoji: '🌸', color: '#F6B7C8' },
  { name: 'Calm', emoji: '🌿', color: '#B8D8C0' },
  { name: 'Grateful', emoji: '💜', color: '#D9C5EB' },
  { name: 'Productive', emoji: '🌻', color: '#F6D998' },
  { name: 'Tired', emoji: '☁️', color: '#CED6E3' },
  { name: 'Stressed', emoji: '🌧️', color: '#B7C4D9' },
  { name: 'Sad', emoji: '💧', color: '#A9BFD8' },
]

const happinessFactors = [
  { name: 'Family', emoji: '🏡' },
  { name: 'Friends', emoji: '💕' },
  { name: 'Nature', emoji: '🌿' },
  { name: 'Hobbies', emoji: '🎨' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Other', emoji: '✨' },
]

function makeDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function readSavedMoods() {
  try {
    const stored = localStorage.getItem('myLittleJournalMoods')
    const data = stored ? JSON.parse(stored) : {}

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return {}
    }

    // Preserve records from our original October 2026 prototype.
    for (let day = 1; day <= 31; day++) {
      const oldKey = String(day)
      const newKey = `2026-10-${String(day).padStart(2, '0')}`

      if (Object.hasOwn(data, oldKey)) {
        if (!Object.hasOwn(data, newKey)) {
          data[newKey] = data[oldKey]
        }
        delete data[oldKey]
      }
    }

    return data
  } catch {
    return {}
  }
}

function readSavedFactors() {
  try {
    const stored = localStorage.getItem('myLittleJournalFactors')
    const data = stored ? JSON.parse(stored) : {}

    return data && typeof data === 'object' && !Array.isArray(data)
      ? data
      : {}
  } catch {
    return {}
  }
}

function App() {
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedFactors, setSelectedFactors] = useState([])

  const [savedMoods, setSavedMoods] = useState(readSavedMoods)
  const [savedFactors, setSavedFactors] = useState(readSavedFactors)

  const [gratitude, setGratitude] = useState('')

  const [todaysMemory, setTodaysMemory] = useState('')

  
const [savedGratitude, setSavedGratitude] = useState(() => {
  try {
    const stored = localStorage.getItem('myLittleJournalGratitude')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
})


const [savedMemories, setSavedMemories] = useState(() => {
  try {
    const stored = localStorage.getItem('myLittleJournalMemories')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
})




  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate()

  const days = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  )

  function getDateKey(day) {
    return makeDateKey(
      new Date(currentYear, currentMonth, day)
    )
  }

  function changeMonth(amount) {
    setViewDate((previous) =>
      new Date(
        previous.getFullYear(),
        previous.getMonth() + amount,
        1
      )
    )

    setSelectedDay(null)
    setShowEntryForm(false)
  }

  function toggleFactor(factorName) {
    setSelectedFactors((previous) =>
      previous.includes(factorName)
        ? previous.filter((name) => name !== factorName)
        : [...previous, factorName]
    )
  }

  function openTodayEntry() {
    const today = new Date()
    const dateKey = makeDateKey(today)

    setViewDate(today)
    setSelectedDay(today.getDate())

    setSelectedMood(savedMoods[dateKey] ?? null)

    const factors = savedFactors[dateKey]
    setSelectedFactors(
      Array.isArray(factors) ? [...factors] : []
    )
    setGratitude(savedGratitude[dateKey] ?? '')

    setTodaysMemory(savedMemories[dateKey] ?? '')

    setShowEntryForm(true)
  }

  function saveTodayEntry() {
    if (!selectedMood) return

    const today = new Date()
    const dateKey = makeDateKey(today)

    setSavedMoods((previous) => ({
      ...previous,
      [dateKey]: selectedMood,
    }))

    setSavedFactors((previous) => ({
      ...previous,
      [dateKey]: [...selectedFactors],
    }))

    
    setSavedGratitude((previous) => ({
      ...previous,
      [dateKey]: gratitude,
    }))


    setSavedMemories((previous) => ({
      ...previous,
      [dateKey]: todaysMemory,
    }))



    setShowEntryForm(false)
    setViewDate(today)
    setSelectedDay(today.getDate())
  }

  // Save moods after every change.
  useEffect(() => {
    localStorage.setItem(
      'myLittleJournalMoods',
      JSON.stringify(savedMoods)
    )
  }, [savedMoods])

  // Save happiness factors after every change.
  useEffect(() => {
    localStorage.setItem(
      'myLittleJournalFactors',
      JSON.stringify(savedFactors)
    )
  }, [savedFactors])

  
useEffect(() => {
  localStorage.setItem(
    'myLittleJournalGratitude',
    JSON.stringify(savedGratitude)
  )
}, [savedGratitude])


useEffect(() => {
  localStorage.setItem(
    'myLittleJournalMemories',
    JSON.stringify(savedMemories)
  )
}, [savedMemories])



  const selectedDateKey =
    selectedDay !== null ? getDateKey(selectedDay) : null

  const recordedMood = selectedDateKey
    ? savedMoods[selectedDateKey]
    : null

  const recordedMoodDetails = moods.find(
    (mood) => mood.name === recordedMood
  )

  const recordedFactors = selectedDateKey
    ? savedFactors[selectedDateKey]
    : []

  const recordedGratitude = selectedDateKey
  ? savedGratitude[selectedDateKey]
  : ''

  const recordedMemory = selectedDateKey
  ? savedMemories[selectedDateKey]
  : ''

  return (
    <main className="journal-app">
      <header>
        <p>✿ My Little Journal ✿</p>
        <h1>A Garden of Memories 🌷</h1>
        <p>A little space for your thoughts and feelings.</p>
      </header>

      <section className="garden">
        <h2>🌿 My Mood Garden</h2>

        {/* Month navigation */}
        <div className="month-navigation">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            ❮
          </button>

          <span>
            {viewDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            ❯
          </button>
        </div>

        {/* Mood Garden */}
        <div className="garden-days">
          {days.map((day) => {
            const dateKey = getDateKey(day)
            const moodName = savedMoods[dateKey]

            const moodDetails = moods.find(
              (mood) => mood.name === moodName
            )

            return (
              <button
                type="button"
                className={`garden-day ${
                  selectedDay === day ? 'selected' : ''
                }`}
                key={dateKey}
                onClick={() => setSelectedDay(day)}
                aria-label={`${dateKey}, ${
                  moodName ?? 'No mood recorded'
                }`}
                aria-pressed={selectedDay === day}
                style={{
                  backgroundColor: moodDetails?.color,
                }}
              >
                {moodDetails?.emoji ?? '🌱'}
                <span>{day}</span>
              </button>
            )
          })}
        </div>

        {/* Selected day's memory */}
        {selectedDay !== null && (
          <div className="selected-day-message">
            <p>
              🌷{' '}
              {new Date(
                currentYear,
                currentMonth,
                selectedDay
              ).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            {recordedMoodDetails ? (
              <>
                <p>
                  Your mood: {recordedMoodDetails.emoji}{' '}
                  {recordedMoodDetails.name}
                </p>

                {Array.isArray(recordedFactors) &&
                  recordedFactors.length > 0 && (
                    <div>
                      <p>💗 What made you happy:</p>
                      <p>
                        {recordedFactors
                          .map((factorName) => {
                            const factor = happinessFactors.find(
                              (item) => item.name === factorName
                            )

                            return factor
                              ? `${factor.emoji} ${factor.name}`
                              : factorName
                          })
                          .join(' · ')}
                      </p>
                      

                    </div>
                  )}
                  {recordedGratitude && (
                  <div className="memory-gratitude">
                    <p>💌 What I was grateful for:</p>
                    <p>{recordedGratitude}</p>
                  </div>
                )}

                
{recordedMemory && (
  <div className="memory-details">
    <p>📖 Today's Memory:</p>
    <p>{recordedMemory}</p>
  </div>
)}

                                  
              </>
            ) : (
              <p>🌱 No mood recorded for this day yet.</p>
            )}
          </div>
        )}

      


        {/* Open today's check-in */}
        <button
          type="button"
          onClick={openTodayEntry}
        >
          🌸 Add Today's Entry
        </button>

        {/* Daily Check-in Form */}
        {showEntryForm && (
          <div className="entry-form">
            <h3>🌷 How are you feeling today?</h3>
            <p>Choose the mood that best describes your day.</p>

            <div className="mood-options">
              {moods.map((mood) => (
                <button
                  type="button"
                  key={mood.name}
                  className={
                    selectedMood === mood.name
                      ? 'mood-selected'
                      : ''
                  }
                  aria-pressed={selectedMood === mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                >
                  {mood.emoji} {mood.name}
                </button>
              ))}
            </div>

            {/* Happiness factors */}
            <div className="happiness-section">
              <h3>🌸 What made me happy today?</h3>
              <p>Choose as many as you like.</p>

              <div className="happiness-options">
                {happinessFactors.map((factor) => (
                  <button
                    type="button"
                    key={factor.name}
                    className={
                      selectedFactors.includes(factor.name)
                        ? 'factor-selected'
                        : ''
                    }
                    aria-pressed={selectedFactors.includes(
                      factor.name
                    )}
                    onClick={() => toggleFactor(factor.name)}
                  >
                    {factor.emoji} {factor.name}
                  </button>
                ))}
              </div>
          </div>
              <div className="gratitude-section">
  <h3>💌 What am I grateful for today?</h3>
  <p>Even the smallest things count.</p>

  <textarea
    value={gratitude}
    onChange={(event) => setGratitude(event.target.value)}
    placeholder="Today, I'm grateful for..."
    rows={4}
    maxLength={2000}
  />
</div>


<div className="memory-section">
  <h3>📖 Today's Memory</h3>
  <p>A little moment worth remembering.</p>

  <textarea
    value={todaysMemory}
    onChange={(event) => setTodaysMemory(event.target.value)}
    placeholder="Today, something special happened..."
    rows={5}
    maxLength={5000}
  />
</div>

            

            {selectedMood && (
              <p>
                You selected: {selectedMood} 💗
              </p>
            )}

            <button
              type="button"
              disabled={!selectedMood}
              onClick={saveTodayEntry}
            >
              🌷 Save Today's Entry
            </button>

            <button
              type="button"
              onClick={() => setShowEntryForm(false)}
            >
              Close
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
