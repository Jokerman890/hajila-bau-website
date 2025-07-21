import { Building2, Hammer, Users, Trophy } from "lucide-react";

function Stats() {
  return (
    <div className="w-full py-20 lg:py-40 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6">
        {/* Titel-Sektion */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Unsere Erfolge in Zahlen
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Über Jahre hinweg haben wir uns als vertrauensvoller Partner im Baugewerbe etabliert
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid text-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-6 lg:gap-8">
          <div className="flex gap-0 flex-col justify-between items-center p-8 border rounded-xl bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="p-3 rounded-full bg-primary/10 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold text-foreground mb-2">
              150+
            </h3>
            <p className="text-lg font-medium text-muted-foreground">
              Erfolgreich abgeschlossene Projekte
            </p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Seit Firmengründung
            </p>
          </div>

          <div className="flex gap-0 flex-col justify-between items-center p-8 border rounded-xl bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="p-3 rounded-full bg-success/10 mb-6">
              <Users className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold text-foreground mb-2">
              500+
            </h3>
            <p className="text-lg font-medium text-muted-foreground">
              Zufriedene Kunden
            </p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Privatpersonen & Unternehmen
            </p>
          </div>

          <div className="flex gap-0 flex-col justify-between items-center p-8 border rounded-xl bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="p-3 rounded-full bg-blue-500/10 mb-6">
              <Hammer className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold text-foreground mb-2">
              15+
            </h3>
            <p className="text-lg font-medium text-muted-foreground">
              Jahre Erfahrung
            </p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Im Baugewerbe
            </p>
          </div>

          <div className="flex gap-0 flex-col justify-between items-center p-8 border rounded-xl bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="p-3 rounded-full bg-yellow-500/10 mb-6">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-4xl lg:text-5xl tracking-tighter font-bold text-foreground mb-2">
              100%
            </h3>
            <p className="text-lg font-medium text-muted-foreground">
              Qualitätsgarantie
            </p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Auf alle unsere Arbeiten
            </p>
          </div>
        </div>

        {/* Zusätzliche Informationen */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-primary/5 border border-primary/20">
            <span className="text-sm font-medium text-primary">✓ Zertifizierte Handwerker</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-primary">✓ Termingerechte Umsetzung</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-primary">✓ Faire Preise</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Stats };