import React, { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface HeroProps {
  onContactClick?: () => void;
  onProjectsClick?: () => void;
}

export default function Hero({ onContactClick, onProjectsClick }: HeroProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Мемоизируем настройки, чтобы они не пересоздавались при каждом скролле
  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false }, // Отключаем полноэкранный режим, ограничиваем блоком
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 120,
    interact: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
      },
      modes: {
        push: { quantity: 4 },
        grab: { distance: 150, links: { opacity: 1 } },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: true,
        speed: 1.2,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 80,
      },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  return (
    <section className="relative pt-24 pb-20 min-h-screen flex items-center justify-center">
      
      {/* Фиксированный фон (Эффект параллакса) */}
      <div className="fixed inset-0 z-[-1] bg-[#0f5a6b]">
        {init && (
          <Particles
            id="tsparticles"
            className="absolute inset-0 z-0"
            options={particlesOptions}
          />
        )}
        {/* Декоративный градиентный слой */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f5a6b] via-[#0f5a6b]/80 to-transparent z-10"></div>
      </div>

      {/* Контент */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Комплексное оснащение учреждений
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100">
          От анализа технического задания до поставки, монтажа и ввода оборудования в эксплуатацию
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onContactClick} className="bg-white text-[#0f5a6b] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg">
            Оставить заявку
          </button>
          <button onClick={onProjectsClick} className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#0f5a6b] transition-colors font-bold text-lg">
            Посмотреть проекты
          </button>
        </div>
      </div>
    </section>
  );
}