import React, { useEffect, useState, useMemo } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
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

  const stats = [
    { value: "2020", label: "год основания" },
    { value: "35+", label: "проектов за последний год" },
    { value: "40+", label: "областей РФ" },
  ];

  return (
    <section className="relative pt-28 pb-16 min-h-screen flex flex-col items-center justify-center">

      {/* Фиксированный фон (эффект параллакса) */}
      <div className="fixed inset-0 z-[-1] bg-[#0f5a6b]">
        {/* Мягкие световые пятна */}
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-[#1b8aa0]/40 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#0a3f4b]/80 blur-3xl"></div>
        {init && (
          <Particles
            id="tsparticles"
            className="absolute inset-0 z-0"
            options={particlesOptions}
          />
        )}
        {/* Затемнение к низу для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f5a6b]/30 via-transparent to-[#0a3f4b]/70 z-10"></div>
      </div>

      {/* Контент */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-white">
        <span className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm mb-6">
          {["Медицина", "Образование", "Госучреждения"].map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#8be3d9]"></span>}
              {t}
            </React.Fragment>
          ))}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
          Комплексное оснащение{" "}
          <span className="bg-gradient-to-r from-[#8be3d9] to-white bg-clip-text text-transparent">учреждений</span>
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-white/85 max-w-3xl mx-auto leading-relaxed">
          От анализа технического задания до поставки, монтажа и ввода оборудования в эксплуатацию
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onContactClick} className="group inline-flex items-center justify-center gap-2 bg-white text-[#0f5a6b] px-8 py-3.5 rounded-xl hover:bg-gray-100 hover:shadow-xl transition-all duration-200 font-bold text-lg cursor-pointer">
            Оставить заявку
            <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button onClick={onProjectsClick} className="border-2 border-white/80 text-white px-8 py-3.5 rounded-xl hover:bg-white hover:text-[#0f5a6b] transition-colors duration-200 font-bold text-lg cursor-pointer">
            Посмотреть проекты
          </button>
        </div>

        {/* Ключевые цифры */}
        <div className="mt-14 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto">
          {stats.map(st => (
            <div key={st.label} className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 py-4 md:py-5">
              <div className="text-2xl md:text-4xl font-bold">{st.value}</div>
              <div className="text-xs md:text-sm text-white/75 mt-1">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      <ChevronDown aria-hidden="true" size={28} className="relative z-20 mt-10 text-white/60 animate-bounce motion-reduce:animate-none" />
    </section>
  );
}
