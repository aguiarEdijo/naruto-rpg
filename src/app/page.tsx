'use client';

import Link from 'next/link';

export default function Home() {
  // Página inicial - usuário escolhe para onde ir

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('/assets_task_01k893tbr8fjcsx7bs3vqhe6cd_1761242713_img_0.webp')`
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#2c1810;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#1a0f0a;stop-opacity:1" />
                </linearGradient>
                <radialGradient id="fire" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:0.8" />
                  <stop offset="100%" style="stop-color:#8b0000;stop-opacity:0.3" />
                </radialGradient>
              </defs>
              <rect width="1920" height="1080" fill="url(#sky)"/>
              <!-- City silhouette -->
              <rect x="0" y="600" width="1920" height="480" fill="#1a0f0a"/>
              <!-- Buildings -->
              <rect x="100" y="400" width="80" height="200" fill="#2c1810"/>
              <rect x="200" y="350" width="120" height="250" fill="#1a0f0a"/>
              <rect x="350" y="300" width="100" height="300" fill="#2c1810"/>
              <rect x="500" y="250" width="150" height="350" fill="#1a0f0a"/>
              <rect x="700" y="200" width="200" height="400" fill="#2c1810"/>
              <rect x="950" y="180" width="180" height="420" fill="#1a0f0a"/>
              <rect x="1200" y="220" width="160" height="380" fill="#2c1810"/>
              <rect x="1400" y="300" width="140" height="300" fill="#1a0f0a"/>
              <rect x="1600" y="350" width="120" height="250" fill="#2c1810"/>
              <!-- Fire effects -->
              <circle cx="300" cy="500" r="40" fill="url(#fire)"/>
              <circle cx="600" cy="450" r="60" fill="url(#fire)"/>
              <circle cx="900" cy="480" r="35" fill="url(#fire)"/>
              <circle cx="1300" cy="520" r="50" fill="url(#fire)"/>
              <circle cx="1650" cy="500" r="30" fill="url(#fire)"/>
            </svg>
          `)}')`
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center pt-16 pb-8">
          <h1 className="text-8xl font-bold mb-4" style={{
            color: '#ff6b35',
            textShadow: '4px 4px 0px #8b0000, 8px 8px 0px #2c1810',
            fontFamily: 'serif',
            letterSpacing: '0.1em'
          }}>
            NARUTO
          </h1>
          <p className="text-2xl text-white font-semibold tracking-widest" style={{
            textShadow: '2px 2px 0px #000000'
          }}>
            AS RUÍNAS DA GUERRA
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl w-full">
            {/* Character Sheet */}
            <Link href="/dashboard/characters" className="group">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-xl border-2 border-orange-500 hover:border-orange-400 transition-all duration-300 p-6 lg:p-8 hover:bg-opacity-70 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-orange-500 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">Minhas Fichas</h3>
                  <p className="text-sm lg:text-base text-gray-300 group-hover:text-gray-200 transition-colors">Visualize e edite suas fichas de personagem</p>
                </div>
              </div>
            </Link>

            {/* Dice System - Temporariamente oculto */}
            {/* <Link href="/dice" className="group">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-xl border-2 border-red-500 hover:border-red-400 transition-all duration-300 p-6 lg:p-8 hover:bg-opacity-70 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-500 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18C6.67 18 6 17.33 6 16.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zM7.5 9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM16.5 9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6 18 6.67 18 7.5 17.33 9 16.5 9zm0 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors">Sistema de Dados</h3>
                  <p className="text-sm lg:text-base text-gray-300 group-hover:text-gray-200 transition-colors">Role dados para suas perícias e técnicas</p>
                </div>
              </div>
            </Link> */}

            {/* Rules */}
            <Link href="/rules" className="group">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-xl border-2 border-yellow-500 hover:border-yellow-400 transition-all duration-300 p-6 lg:p-8 hover:bg-opacity-70 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-yellow-500 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">Regras do Jogo</h3>
                  <p className="text-sm lg:text-base text-gray-300 group-hover:text-gray-200 transition-colors">Consulte as regras e mecânicas do sistema</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="pb-8 lg:pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-8 lg:mb-12" style={{
              textShadow: '2px 2px 0px #000000'
            }}>
              Características do Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-orange-500">
                <h3 className="text-xl font-bold text-orange-400 mb-3">Sistema Simples</h3>
                <p className="text-gray-300">Focado em narrativa com números baixos e cálculos automáticos</p>
              </div>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-red-500">
                <h3 className="text-xl font-bold text-red-400 mb-3">Dados 2d6</h3>
                <p className="text-gray-300">Sistema de rolagem equilibrado que mantém os dados sempre relevantes</p>
              </div>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-yellow-500">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">Clãs de Konoha</h3>
                <p className="text-gray-300">8 clãs principais com habilidades especiais únicas</p>
              </div>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Saúde Mental</h3>
                <p className="text-gray-300">Sistema único de Sabedoria x Paixão para profundidade psicológica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}