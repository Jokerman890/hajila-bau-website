import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - Hajila Bau GmbH',
  description: 'Datenschutzerklärung der Hajila Bau GmbH',
  robots: 'noindex, nofollow',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🔐 Datenschutzerklärung
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="space-y-8">
              
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🧾 1. Verantwortlicher</h2>
                <div className="text-gray-200">
                  <p className="font-semibold">Hajila Bau GmbH</p>
                  <p>Wildeshauser Straße 3</p>
                  <p>49088 Osnabrück</p>
                  <p>Geschäftsführerin: Samiha Omerovic</p>
                  <p>📞 <a href="tel:054144026213" className="text-cyan-400 hover:text-cyan-300">0541 44026213</a></p>
                  <p>✉️ <a href="mailto:info@hajila-bau.de" className="text-cyan-400 hover:text-cyan-300">info@hajila-bau.de</a></p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">💻 2. Daten beim Websitebesuch</h2>
                <div className="text-gray-200 space-y-2">
                  <p>Bei jedem Besuch unserer Website werden automatisch folgende Daten erfasst:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>IP-Adresse</li>
                    <li>Datum und Uhrzeit des Zugriffs</li>
                    <li>Aufgerufene Seiten</li>
                    <li>Browser-Typ und Referrer-URL</li>
                  </ul>
                  <p className="mt-3">
                    <strong>➡️ Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">📬 3. Kontaktaufnahme</h2>
                <div className="text-gray-200">
                  <p>Bei Kontaktaufnahme über E-Mail oder Telefon verarbeiten wir Ihre Daten zur Beantwortung Ihrer Anfrage.</p>
                  <p className="mt-2">
                    <strong>➡️ Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🍪 4. Cookies</h2>
                <div className="text-gray-200 space-y-2">
                  <p>Unsere Website verwendet Cookies von folgenden Anbietern:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Google Analytics (zur Analyse des Nutzerverhaltens)</li>
                    <li>Hostinger (für Hosting-Services)</li>
                  </ul>
                  <p className="mt-3">
                    <strong>➡️ Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a & f DSGVO
                  </p>
                  <p>
                    Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Google Datenschutz</a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">📊 5. Google-Dienste</h2>
                <div className="text-gray-200 space-y-2">
                  <p>Wir nutzen folgende Google-Dienste:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Google Analytics (mit IP-Anonymisierung)</li>
                  </ul>
                  <p className="mt-3">
                    <strong>➡️ Rechtsgrundlage:</strong> Nutzer-Einwilligung und berechtigtes Interesse
                  </p>
                  <p>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Google Datenschutzerklärung</a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🌐 6. Hosting</h2>
                <div className="text-gray-200">
                  <p>Unsere Website wird von Hostinger gehostet. Dabei werden technische Zugriffsdaten verarbeitet.</p>
                  <p className="mt-2">
                    <a href="https://www.hostinger.de/datenschutzrichtlinie" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Hostinger Datenschutz</a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">👤 7. Ihre Rechte</h2>
                <div className="text-gray-200 space-y-2">
                  <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Recht auf Auskunft</li>
                    <li>Recht auf Berichtigung</li>
                    <li>Recht auf Löschung</li>
                    <li>Recht auf Einschränkung der Verarbeitung</li>
                    <li>Recht auf Widerspruch</li>
                    <li>Recht auf Datenübertragbarkeit</li>
                  </ul>
                  <p className="mt-3">
                    Kontakt: ✉️ <a href="mailto:info@hajila-bau.de" className="text-cyan-400 hover:text-cyan-300">info@hajila-bau.de</a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🛡️ 8. Aufsichtsbehörde</h2>
                <div className="text-gray-200">
                  <p>Zuständige Aufsichtsbehörde:</p>
                  <p className="mt-2">Landesbeauftragte für Datenschutz Niedersachsen</p>
                  <p>Beschwerden können Sie direkt bei der Aufsichtsbehörde einreichen.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🔒 9. Datensicherheit</h2>
                <div className="text-gray-200">
                  <p>Wir setzen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ein und aktualisieren diese regelmäßig entsprechend dem technischen Fortschritt.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">📆 10. Stand</h2>
                <div className="text-gray-200">
                  <p>Diese Datenschutzerklärung hat den Stand: Juni 2025</p>
                </div>
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
