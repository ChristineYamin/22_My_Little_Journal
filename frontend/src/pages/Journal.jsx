import { useState } from 'react'
function Journal({
  savedMoods,
  savedFactors,
  savedGratitude,
  savedMemories,
}) {
    
const [searchText, setSearchText] = useState('')
  const entries = Object.keys(savedMoods)
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort((a, b) => b.localeCompare(a))

    
const filteredEntries = entries.filter((date) => {
  const searchableText = [
    date,
    savedMoods[date] || '',
    ...(savedFactors[date] || []),
    savedGratitude[date] || '',
    savedMemories[date] || '',
  ].join(' ').toLowerCase()

  return searchableText.includes(searchText.toLowerCase().trim())
})



  return (
    <section className="journal-page">
      <h2>💌 My Memory Scrapbook</h2>
      <p>A little collection of moments worth remembering.</p>

      
        <input
        className="journal-search"
        type="search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="🔎 Search my memories..."
        aria-label="Search journal entries"
        />


      {entries.length === 0 ? (
        <p>🌱 Your scrapbook is waiting for its first memory.</p>
      ) : (
        <div className="journal-entries">
          {filteredEntries.map((date) => (
            <article className="journal-entry" key={date}>
              
            <h3>
            🌷 {new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            })}
            </h3>


              <p>
                <strong>Mood:</strong> {savedMoods[date]}
              </p>

              {savedFactors[date]?.length > 0 && (
                <p>
                  <strong>💗 Happiness:</strong>{' '}
                  {savedFactors[date].join(', ')}
                </p>
              )}

              {savedGratitude[date] && (
                <p>
                  <strong>💌 Gratitude:</strong>{' '}
                  {savedGratitude[date]}
                </p>
              )}

              {savedMemories[date] && (
                <p>
                  <strong>📖 Memory:</strong>{' '}
                  {savedMemories[date]}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Journal
