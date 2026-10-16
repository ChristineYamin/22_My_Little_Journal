
function DailyCheckIn({
  children
}) {
  return (
    <section className="daily-checkin-page">
      <h2>🌸 My Daily Check-in</h2>
      <p>A little moment to reflect on your day.</p>

      {children}
    </section>
  )
}

export default DailyCheckIn
