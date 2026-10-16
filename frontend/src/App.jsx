
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import DailyCheckIn from './pages/DailyCheckIn'
import Journal from './pages/Journal'
import Insights from './pages/Insights'


const moods = [
  { name: 'Happy', emoji: '🌸', color: '#F6B7C8' },
  { name: 'Calm', emoji: '🌿', color: '#B8D8C0' },
  { name: 'Grateful', emoji: '💜', color: '#D9C5EB' },
  { name: 'Productive', emoji: '🌻', color: '#F6D998' },
  { name: 'Tired', emoji: '🪫', color: '#CED6E3' },
  { name: 'Stressed', emoji: '😣', color: '#EBC6A8' },
  { name: 'Sad', emoji: '💧', color: '#A9BFD8' },
  { name: 'Depressed', emoji: '⛈️', color: '#B8B0CC' },
]


const happinessFactors = [
  { name: 'Family', emoji: '🏡' },
  { name: 'Friends', emoji: '💕' },
  { name: 'Nature', emoji: '🌿' },
  { name: 'Hobbies', emoji: '🎨' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Other', emoji: '✨' },
]


const moodRecommendations = {
  Tired: {
    message: "You've done enough for now. Rest is productive too. 💗",
    activity: "🛌 Take a 20-minute rest or enjoy a quiet cup of tea.",
  },
  Stressed: {
    message: "You don't have to solve everything at once. 🌿",
    activity: "🧘 Try five minutes of gentle breathing or stretching.",
  },
  Sad: {
    message: "It's okay to have a difficult day. 🌷",
    activity: "🎨 Try painting, journaling, or listening to comforting music.",
  },
  Depressed: {
    message: "You deserve kindness and support, especially today. 💗",
    activity: "🌤️ Try one small act of self-care, or reach out to someone you trust.",
  },
}

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

  const [entryDate, setEntryDate] = useState(() => new Date())


  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedFactors, setSelectedFactors] = useState([])

  const [savedMoods, setSavedMoods] = useState(readSavedMoods)
  const [savedFactors, setSavedFactors] = useState(readSavedFactors)

  const [gratitude, setGratitude] = useState('')

  const [todaysMemory, setTodaysMemory] = useState('')
  const [activePage, setActivePage] = useState('home')

  
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
  
function openEntryForDay(day) {
  const date = new Date(currentYear, currentMonth, day)
  setEntryDate(date)
  const dateKey = makeDateKey(date)

  setSelectedDay(day)
  setSelectedMood(savedMoods[dateKey] ?? null)

  const factors = savedFactors[dateKey]
  setSelectedFactors(
    Array.isArray(factors) ? [...factors] : []
  )

  setGratitude(savedGratitude[dateKey] ?? '')
  setTodaysMemory(savedMemories[dateKey] ?? '')

  setShowEntryForm(true)
  setActivePage('checkin')
}


  function openTodayEntry() {
    
    const today = new Date()
    setEntryDate(today)
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
    setActivePage('checkin')

  }

  function saveTodayEntry() {
    if (!selectedMood) return

    const dateToSave = entryDate
    const dateKey = makeDateKey(dateToSave)

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
    setViewDate(dateToSave)
    setSelectedDay(dateToSave.getDate())
    setActivePage('home')

    }

    
function exportJournalBackup() {
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    moods: savedMoods,
    happinessFactors: savedFactors,
    gratitude: savedGratitude,
    memories: savedMemories,
  }

  const file = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: 'application/json' }
  )

  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = `my-little-journal-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`

  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function importJournalBackup(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result)

      const isValid =
        backup.version === 1 &&
        backup.moods &&
        typeof backup.moods === 'object' &&
        !Array.isArray(backup.moods) &&
        backup.happinessFactors &&
        typeof backup.happinessFactors === 'object' &&
        !Array.isArray(backup.happinessFactors) &&
        backup.gratitude &&
        typeof backup.gratitude === 'object' &&
        !Array.isArray(backup.gratitude) &&
        backup.memories &&
        typeof backup.memories === 'object' &&
        !Array.isArray(backup.memories)

      if (!isValid) {
        alert('This is not a valid My Little Journal backup.')
        return
      }

      const confirmed = window.confirm(
        'Importing this backup will replace your current journal entries. Continue?'
      )

      if (!confirmed) return

      setSavedMoods(backup.moods)
      setSavedFactors(backup.happinessFactors)
      setSavedGratitude(backup.gratitude)
      setSavedMemories(backup.memories)

      alert('🌷 Your journal backup has been restored!')
    } catch {
      alert('Could not read this backup file.')
    } finally {
      event.target.value = ''
    }
  }

  reader.onerror = () => {
    alert('Could not open this backup file.')
    event.target.value = ''
  }

  reader.readAsText(file)
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
      
<nav className="app-navigation" aria-label="Main navigation">
  <button
    type="button"
    onClick={() => setActivePage('home')}
    aria-current={activePage === 'home' ? 'page' : undefined}
  >
    🌿 Home
  </button>

  <button
    type="button"
    onClick={openTodayEntry}
    aria-current={activePage === 'checkin' ? 'page' : undefined}
  >
    🌸 Check-in
  </button>

  <button
    type="button"
    onClick={() => setActivePage('journal')}
    aria-current={activePage === 'journal' ? 'page' : undefined}
  >
    💌 Journal
  </button>

  <button
    type="button"
    onClick={() => setActivePage('insights')}
    aria-current={activePage === 'insights' ? 'page' : undefined}
  >
    📊 Insights
  </button>
  
<div className="backup-controls">
  <button
    type="button"
    onClick={exportJournalBackup}
  >
    💾 Export Backup
  </button>
  
<label className="import-backup-button">
  📤 Import Backup
  <input
    type="file"
    accept=".json,application/json"
    onChange={importJournalBackup}
    style={{ display: 'none' }}
  />
</label>

</div>

</nav>
{activePage === 'home' && (
  <>
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
            <button
              type="button"
              className="edit-day-button"
              onClick={() => openEntryForDay(selectedDay)}
            >
              ✏️ {recordedMood ? 'Edit This Day' : 'Add Entry for This Day'}
            </button>
          </div>
        )}

      


        {/* Open today's check-in */}
        <button
          type="button"
          onClick={openTodayEntry}
        >
          🌸 Add Today's Entry
        </button>

        
      </section>
        </>
)}

{activePage === 'checkin' && (
  <DailyCheckIn>
    {/* Daily Check-in Form */}
        {showEntryForm && activePage === 'checkin' && (
          <div className="entry-form">
            
          <p className="entry-date">
            📅 {entryDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

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
            {selectedMood && moodRecommendations[selectedMood] && (
  <div className="mood-recommendation">
    <h3>🌷 A Little Care for You</h3>

    <p>
      {moodRecommendations[selectedMood].message}
    </p>

    <p>
      {moodRecommendations[selectedMood].activity}
    </p>

    {selectedMood === 'Depressed' && (
      <p>
        If you've been feeling this low for a while,
        consider talking with someone you trust or
        a mental health professional.
      </p>
    )}
  </div>
)}

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
            
<div className="entry-actions">
  <button
    type="button"
    className="save-entry-button"
    disabled={!selectedMood}
    onClick={saveTodayEntry}
  >
    🌷 Save Entry
  </button>

  <button
    type="button"
    className="close-entry-button"
    onClick={() => {
      setShowEntryForm(false)
      setActivePage('home')
    }}
  >
    ✕ Close
  </button>
</div>




            
          </div>
        )}
  </DailyCheckIn>
)}

{activePage === 'journal' && (
  <Journal
    savedMoods={savedMoods}
    savedFactors={savedFactors}
    savedGratitude={savedGratitude}
    savedMemories={savedMemories}
  />
)}
{activePage === 'insights' && (
  <Insights
  savedMoods={savedMoods}
  savedFactors={savedFactors}
/>
)}


    </main>
  )
}

export default App
