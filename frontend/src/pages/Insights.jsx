
const moods = [
  { name: 'Happy', emoji: '🌸' },
  { name: 'Calm', emoji: '🌿' },
  { name: 'Grateful', emoji: '💜' },
  { name: 'Productive', emoji: '🌻' },
  { name: 'Tired', emoji: '🪫' },
{ name: 'Stressed', emoji: '😣' },
{ name: 'Sad', emoji: '💧' },
{ name: 'Depressed', emoji: '⛈️' },
]

function Insights({ savedMoods = {}, savedFactors = {} }) {
  const moodCounts = moods.map((mood) => ({
    ...mood,
    count: Object.values(savedMoods).filter(
      (savedMood) => savedMood === mood.name
    ).length,
  }))

  const totalEntries = Object.values(savedMoods).length

  
  const factors = [
    { name: 'Family', emoji: '🏡' },
    { name: 'Friends', emoji: '💕' },
    { name: 'Nature', emoji: '🌿' },
    { name: 'Hobbies', emoji: '🎨' },
    { name: 'Music', emoji: '🎵' },
    { name: 'Other', emoji: '✨' },
  ]

  const factorCounts = factors.map((factor) => ({
    ...factor,
    count: Object.values(savedFactors).filter(
      (dayFactors) =>
        Array.isArray(dayFactors) &&
        dayFactors.includes(factor.name)
    ).length,
  }))

  const maxFactorCount = Math.max(
    1,
    ...factorCounts.map((factor) => factor.count)
  )


  return (
    <section className="insights-page">
      <h2>📊 My Mood Insights</h2>
      <p>A little look at your emotional garden. 🌷</p>

      <h3>🌸 Mood Distribution</h3>
      <p>Total recorded days: {totalEntries}</p>

      {moodCounts.map((mood) => (
        <div key={mood.name} className="mood-insight-row">
          <span>
            {mood.emoji} {mood.name}: {mood.count} days
          </span>

          <div
            style={{
              backgroundColor: '#F5E9EE',
              borderRadius: '12px',
              height: '14px',
              marginTop: '6px',
              marginBottom: '14px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${
                  totalEntries > 0
                    ? (mood.count / totalEntries) * 100
                    : 0
                }%`,
                height: '100%',
                backgroundColor: '#E7A5BC',
                borderRadius: '12px',
              }}
            />
          </div>
        </div>
      ))}
      
<h3>🌷 What Made Me Happy?</h3>
<p>The little things that brightened my days.</p>

{factorCounts.map((factor) => (
  <div key={factor.name} className="factor-insight-row">
    <span>
      {factor.emoji} {factor.name}: {factor.count} days
    </span>

    <div
      style={{
        backgroundColor: '#F5E9EE',
        borderRadius: '12px',
        height: '14px',
        marginTop: '6px',
        marginBottom: '14px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${(factor.count / maxFactorCount) * 100}%`,
          height: '100%',
          backgroundColor: '#B8D8C0',
          borderRadius: '12px',
        }}
      />
    </div>
  </div>
))}

    </section>
  )
}

export default Insights


