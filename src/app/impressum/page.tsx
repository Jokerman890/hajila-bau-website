import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impressum - Hajila Bau GmbH',
  description: 'Impressum und rechtliche Angaben der Hajila Bau GmbH',
  robots: 'noindex, nofollow',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🧾 Impressum
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-4">
                  <strong>Angaben gemäß § 5 TMG / § 2 DL-InfoV:</strong>
                </p>
                
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">🏢 Hajila Bau GmbH</h2>
                  <p className="text-gray-200">
                    Wildeshauser Straße 3<br />
                    49088 Osnabrück<br />
                    Deutschland
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">👤 Vertreten durch:</h3>
                <p className="text-gray-200">Geschäftsführerin: Samiha Omerovic</p>
              </div>

                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">📞 Kontakt:</h3>
                  <div className="text-gray-200 space-y-1">
                    <p>Telefon Büro: <a href="tel:054144026213" className="text-cyan-400 hover:text-cyan-300">0541 44026213</a></p>
                    <p>Mobil: <a href="tel:015223000800" className="text-cyan-400 hover:text-cyan-300">0152 23000800</a></p>
                    <p>Fax: 0541 44097451</p>
                    <p>E-Mail: <a href="mailto:info@hajila-bau.de" className="text-cyan-400 hover:text-cyan-300">info@hajila-bau.de</a></p>
                  </div>
                </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">📋 Registereintrag:</h3>
                <div className="text-gray-200">
                  <p>Amtsgericht Osnabrück</p>
                  <p>HRB 210702</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">💶 Umsatzsteuer-ID:</h3>
                <p className="text-gray-200">DE401804294</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">🛡️ Berufshaftpflichtversicherung:</h3>
                <div className="text-gray-200">
                  <p>Versicherungsträger: R+V</p>
                  <p>Anschrift: [Adresse des Versicherers nicht verfügbar]</p>
                  <p>Geltungsbereich: Deutschland / EU (je nach Police)</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">🏛️ Zuständige Kammer:</h3>
                <div className="text-gray-200">
                  <p>Handwerkskammer Osnabrück-Emsland-Grafschaft Bentheim</p>
                  <p>Bramscher Straße 134–136</p>
                  <p>49088 Osnabrück</p>
                  <p><a href="https://www.hwk-osnabrueck.de" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">www.hwk-osnabrueck.de</a></p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">⚖️ Verbraucherstreitbeilegung:</h3>
                <p className="text-gray-200">
                  Die Hajila Bau GmbH nimmt nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
              >
                ← Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

