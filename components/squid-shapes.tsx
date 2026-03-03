export function SquidShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Circle */}
      <div className="absolute left-[10%] top-[20%] h-24 w-24 rounded-full border-2 border-squid-red/10 sm:h-32 sm:w-32" />
      {/* Triangle */}
      <svg className="absolute right-[15%] top-[30%] h-24 w-24 sm:h-28 sm:w-28" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="none" stroke="var(--squid-red)" strokeWidth="1.5" opacity="0.1" />
      </svg>
      {/* Square */}
      <div className="absolute bottom-[25%] left-[20%] h-20 w-20 rotate-12 border-2 border-squid-red/10 sm:h-24 sm:w-24" />
      {/* Small scattered shapes */}
      <div className="absolute right-[8%] bottom-[40%] h-8 w-8 rounded-full border border-squid-green/10" />
      <div className="absolute left-[5%] bottom-[50%] h-6 w-6 rotate-45 border border-squid-gold/10" />
    </div>
  )
}
