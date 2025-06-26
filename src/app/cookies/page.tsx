import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie-Hinweis - Hajila Bau GmbH',
  description: 'Cookie-Hinweis und Informationen zur Cookie-Nutzung der Hajila Bau GmbH',
  robots: 'noindex, nofollow',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🍪 Cookie-Hinweis
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="space-y-8">
              
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-6">
                <p className="text-gray-200 text-lg leading-relaxed">
                  Unsere Website nutzt Cookies und ähnliche Technologien, einschließlich Drittanbieter wie 
                  <span className="text-cyan-400 font-semibold"> Google Maps, Google Analytics, Google Ads</span> sowie 
                  Hostingdienste durch <span className="text-cyan-400 font-semibold">Hostinger</span>. 
                  Diese Cookies helfen uns, unsere Website nutzerfreundlich, effektiv und sicher zu betreiben.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">📘 Was sind Cookies?</h2>
                <div className="text-gray-200">
                  <p>
                    Cookies sind kleine Textdateien, die lokal im Zwischenspeicher Ihres Browsers gespeichert werden. 
                    Sie dienen der Wiedererkennung des Internetbrowsers und ermöglichen eine bessere Nutzererfahrung.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🎯 Zwecke der verwendeten Cookies:</h2>
                <div className="text-gray-200 space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 text-xl">⚙️</span>
                    <div>
                      <p className="font-semibold">Technisch notwendige Cookies:</p>
                      <p className="text-gray-300">Grundfunktionen der Website (z. B. durch Hostinger)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 text-xl">⚙️</span>
                    <div>
                      <p className="font-semibold">Präferenz-Cookies:</p>
                      <p className="text-gray-300">Speicherung individueller Einstellungen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 text-xl">📊</span>
                    <div>
                      <p className="font-semibold">Statistik-Cookies:</p>
                      <p className="text-gray-300">Analyse durch Google Analytics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 text-xl">🎯</span>
                    <div>
                      <p className="font-semibold">Marketing-Cookies:</p>
                      <p className="text-gray-300">Werbung durch Google Ads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 text-xl">🗺️</span>
                    <div>
                      <p className="font-semibold">Interaktive Inhalte:</p>
                      <p className="text-gray-300">Kartenanzeige durch Google Maps</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">📜 Rechtsgrundlagen:</h2>
                <div className="text-gray-200 space-y-2">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p><strong>Notwendige Cookies:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p><strong>Analyse-/Marketing-Cookies:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">✅ Cookie-Einwilligung:</h2>
                <div className="text-gray-200">
                  <p>
                    Beim ersten Besuch unserer Website werden Sie über ein Cookie-Banner um Ihre Einwilligung gebeten. 
                    Diese kann jederzeit widerrufen werden.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🔒 Kontrolle und Deaktivierung:</h2>
                <div className="text-gray-200">
                  <p>
                    Sie können Cookies jederzeit über Ihre Browsereinstellungen verwalten oder löschen. 
                    Beachten Sie jedoch, dass dadurch bestimmte Funktionen der Website eingeschränkt sein können.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🔗 Weitere Informationen:</h2>
                <div className="text-gray-200 space-y-2">
                  <p>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
                      Google Datenschutzerklärung
                    </a>
                  </p>
                  <p>
                    <a href="https://www.hostinger.de/datenschutzrichtlinie" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
                      Hostinger Datenschutzrichtlinie
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">💡 Hinweis</h3>
                <p className="text-gray-200">
                  Durch die weitere Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. 
                  Sie können Ihre Einwilligung jederzeit über die Cookie-Einstellungen Ihres Browsers widerrufen.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
              >
                ← Zurück zur Startseite
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
