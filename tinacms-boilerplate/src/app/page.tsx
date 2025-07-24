export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🚀 TinaCMS Boilerplate
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Boilerplate Next.js + TinaCMS prêt à l'emploi pour créer des sites web modernes 
            avec un système de gestion de contenu intégré.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                ✨ Fonctionnalités
              </h2>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Next.js 14 avec App Router</li>
                <li>• TinaCMS pour l'édition de contenu</li>
                <li>• TypeScript pour la sécurité</li>
                <li>• Tailwind CSS pour le style</li>
                <li>• Configuration Git intégrée</li>
                <li>• Déploiement facile</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🛠️ Commandes
              </h2>
              <div className="text-left space-y-2 text-gray-600">
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                  npm run dev
                </div>
                <p className="text-sm">Démarre le serveur de développement</p>
                
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                  npm run tina:dev
                </div>
                <p className="text-sm">Démarre avec TinaCMS activé</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <a 
              href="/admin" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🎛️ Accéder à l'admin TinaCMS
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
