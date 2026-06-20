interface Props {
  backgroundImage?: string;
}

export default function Hero({ backgroundImage }: Props) {
  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden bg-dark">
      {backgroundImage ? (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
      ) : (
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src="/about%20my/training-promo.mp4" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-dark" />
      <div className="absolute bottom-28 right-4 z-10 md:bottom-36 md:right-12 lg:right-24">
        <div className="flex items-center gap-3 rounded-2xl border border-neon/30 bg-dark-card/80 px-5 py-3 shadow-[0_0_30px_rgba(57,255,20,0.15)] backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-neon to-emerald-500 text-lg font-black text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            14th
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-neon uppercase">CrossFit Coach</p>
            <p className="text-sm font-bold text-white">Ranked in Africa</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 px-4 text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-neon uppercase">
          Royal Fitness — CrossFit Tunisie
        </p>
        <h1 className="text-6xl font-black leading-none tracking-tight text-white md:text-8xl lg:text-9xl">
          STRONGER<br /><span className="text-neon">EVERY DAY</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base text-zinc-400 md:text-lg">
          Train with the 14th-ranked CrossFit coach in Africa. Forge your body. Forge your mind.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#pricing" className="rounded-full bg-neon px-10 py-3.5 text-sm font-bold tracking-widest text-black uppercase transition-all hover:brightness-110 hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]">
            Join Now
          </a>
          <a href="#process" className="rounded-full border border-zinc-600 px-10 py-3.5 text-sm font-bold tracking-widest text-zinc-300 uppercase transition-all hover:border-neon hover:text-neon">
            How It Works
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="h-10 w-6 rounded-full border-2 border-zinc-600">
          <div className="mx-auto mt-2 h-2 w-1.5 animate-bounce rounded-full bg-neon" />
        </div>
      </div>
    </section>
  );
}
