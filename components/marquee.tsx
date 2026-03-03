export function Marquee() {
  const text = "Courses offered by SCSIT: MBA \u2022 MSc \u2022 M.Tech \u2022 MCA \u2022 BCA \u2022 BSc \u2022 Integrated"
  return (
    <div className="overflow-hidden border-y border-border/40 bg-squid-card/50 py-3">
      <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-8 text-sm text-muted-foreground">
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
