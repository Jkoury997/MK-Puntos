"use client";

export default function DynamicHeader({
  title = "Marcela Koury",
  subtitle = "Localizador de Tiendas",
  className = "",
}) {
  return (
    <header
      className={`bg-secondary text-secondary-foreground shadow-sm border-b border-border/50 ${className}`}
    >
      <div className="px-4 py-6">
        <h1 className="text-md md:text-4xl font-light text-center tracking-[0.2em] uppercase">
          {title}
        </h1>

        {subtitle && (
          <p className="text-[10px] md:text-xs text-center opacity-70 mt-2 font-light tracking-[0.3em] uppercase">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
