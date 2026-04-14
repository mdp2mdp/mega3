import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, CheckCircle2, Video, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const projectsData = [
  {
    id: 1,
    title: "Кабинет врача общей практики и пост скорой помощи",
    location: "Московская обл., Волоколамский г.о., д. Судниково",
    client: "ГБУЗ МО",
    description: "Полное комплексное оснащение здания амбулатории с постом на 2 бригады «под ключ». Объект сдан с полной готовностью к лицензированию (СанПиН 2.1.3678-20).",
    features: [
      "Амбулаторный блок: диагностическое оборудование (ЭКГ, УЗИ), функциональная мебель, ЕГИСЗ.",
      "Пост СМП: комплектация медицинских укладок по Приказу № 100н (кардиология, травматология, акушерство).",
      "Инфраструктура: системы хранения, мебель для персонала, видеонаблюдение и связь."
    ],
    videoUrl: null,
    images: ["/sudnikovo-1.jpg", "/sudnikovo-2.jpg", "/sudnikovo-3.jpg", "/sudnikovo-4.jpg", "/sudnikovo-5.jpg", "/sudnikovo-6.jpg", "/sudnikovo-7.jpg"]
  },
  {
    id: 2,
    title: "Подстанция скорой медицинской помощи на 5 бригад",
    location: "Московская обл., г.о. Ступино, рп. Михнево",
    client: "ГКУ МО «Дирекция заказчика капитального строительства»",
    description: "Комплексное оснащение подстанции «под ключ», обеспечивающее бесперебойную работу медицинского персонала и автопарка спецтранспорта.",
    features: [
      "Медицинская зона: оборудование и мебель для осмотра и временного пребывания.",
      "Гаражный бокс: шиномонтажное и балансировочное оборудование, мойка, система очистки воды.",
      "Зона отдыха: кухонный блок и мягкая мебель для восстановления бригад.",
      "Административный блок: оргтехника, конференц-зал с интерактивной панелью."
    ],
    videoUrl: null,
    images: ["/mihnevo-1.jpg", "/mihnevo-2.jpg", "/mihnevo-3.jpg", "/mihnevo-4.jpg", "/mihnevo-5.jpg", "/mihnevo-6.jpg", "/mihnevo-7.jpg"]
  },
  {
    id: 3,
    title: "Модульный фельдшерско-акушерский пункт (ФАП)",
    location: "Московская обл., г.о. Клин, д. Мисирево",
    client: "Минздрав Московской области",
    description: "Современный модульный ФАП площадью 200 кв.м. Оснащение проведено в рамках единого архитектурного стандарта соцобъектов Подмосковья.",
    features: [
      "Организация кабинетов для приема 36 пациентов в смену.",
      "Система телемедицины для дистанционных консультаций с узкими специалистами.",
      "Прививочный блок и палата длительного пребывания пациентов.",
    ],
    videoUrl: "https://vk.com/video-137833611_456261672",
    images: ["/misirevo-1.jpg", "/misirevo-2.jpg", "/misirevo-3.jpg", "/misirevo-4.jpg", "/misirevo-5.jpg", "/misirevo-6.jpg", "/misirevo-7.jpg"]
  }
];

export default function Projects() {
  // Состояние для хранения выбранного проекта и индекса фото
  const [selectedImage, setSelectedImage] = useState<{ projectId: number; index: number } | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);

  const handleNext = () => {
    setSelectedImage(prev => {
      if (!prev) return null;
      const project = projectsData.find(p => p.id === prev.projectId);
      if (!project) return null;
      return { ...prev, index: (prev.index + 1) % project.images.length };
    });
  };

  const handlePrev = () => {
    setSelectedImage(prev => {
      if (!prev) return null;
      const project = projectsData.find(p => p.id === prev.projectId);
      if (!project) return null;
      return { ...prev, index: (prev.index - 1 + project.images.length) % project.images.length };
    });
  };

  // Обработчик для закрытия модального окна по клавише Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setSelectedVideo(null);
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    if (selectedImage || selectedVideo) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedVideo]);

  // Блокировка прокрутки страницы при открытом модальном окне
  const isModalOpen = !!(selectedImage || selectedVideo);

  useEffect(() => {
    if (isModalOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else if (document.body.style.position === 'fixed') {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Отключаем плавную прокрутку на мгновение для моментального возврата
      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollPositionRef.current);
      html.style.scrollBehavior = originalScrollBehavior;
    }
  }, [isModalOpen]);

  const activeProject = selectedImage ? projectsData.find(p => p.id === selectedImage.projectId) : null;
  const activeImageUrl = activeProject ? activeProject.images[selectedImage.index] : null;

  // Обработчики свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;

    if (distance > 50) {
      handleNext(); // Свайп влево -> Следующее фото
    } else if (distance < -50) {
      handlePrev(); // Свайп вправо -> Предыдущее фото
    }
    setTouchStartX(null);
  };

  // Функция для преобразования обычных ссылок в ссылки для плеера (iframe)
  const getEmbedUrl = (url: string) => {
    if (url.includes('vk.com/video')) {
      const match = url.match(/video(-?\d+)_(\d+)/);
      if (match) return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2&autoplay=1`;
    }
    if (url.includes('dzen.ru/video/watch/')) {
      return `https://dzen.ru/embed/v${url.split('video/watch/')[1]?.split('?')[0].replace(/^v/, '')}?from_block=partner&from=zen&autoplay=1&tv=0`;
    }
    return url;
  };

  return (
    <section className="py-20 bg-white" id="projects">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Реализованные проекты</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="space-y-24">
          {projectsData.map((project) => (
            <div key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* ГАЛЕРЕЯ ФОТО (на мобильных пойдет вниз, на ПК будет слева) */}
              <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
  {/* Главное фото */}
  <div 
    className="aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200 cursor-zoom-in"
                onClick={() => setSelectedImage({ projectId: project.id, index: 0 })} // ДОБАВЛЕНО: открывает главное фото
  >
    <img 
      src={project.images[0]} 
      alt={project.title} 
      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
    />
  </div>

  {/* Сетка маленьких фото */}
  <div className="grid grid-cols-6 gap-2">
    {project.images.slice(1).map((img, idx) => (
      <div 
        key={idx} 
        className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in"
                    onClick={() => setSelectedImage({ projectId: project.id, index: idx + 1 })} // ДОБАВЛЕНО: открывает выбранное маленькое фото
      >
        <img 
          src={img} 
          alt={`${project.title} фото ${idx + 2}`} 
          className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all hover:scale-110" 
        />
      </div>
    ))}
  </div>
</div>

              {/* ИНФОРМАЦИЯ (на мобильных будет первой, на ПК будет справа) */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                {project.videoUrl && (
                  <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setSelectedVideo(project.videoUrl)} 
                       className="flex items-center gap-2 text-red-600 text-sm font-bold hover:text-red-700 transition-colors">
                      <Video size={18} /> СМОТРЕТЬ ВИДЕОБЗОР
                    </button>
                  </div>
                )}
                
                <h3 className="text-3xl font-bold text-slate-900 mb-6">{project.title}</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin size={18} className="text-yellow-500 shrink-0 mt-1" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <Building size={18} className="text-yellow-500 shrink-0 mt-1" />
                    <span>Заказчик: {project.client}</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={20} />
                    Объем выполненных работ:
                  </h4>
                  <ul className="grid grid-cols-1 gap-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 pl-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></div>
                        <span className="text-slate-600 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО (FULLSCREEN VIEW) */}
      {activeImageUrl && activeProject && selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out touch-none"
          onClick={() => setSelectedImage(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>

          <button 
            className="absolute left-2 md:left-10 text-white/70 hover:text-white p-2 transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          >
            <ChevronLeft size={48} />
          </button>

          <img 
            src={activeImageUrl} 
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 select-none"
            onClick={(e) => e.stopPropagation()}
            alt="Увеличенное фото"
          />

          <button 
            className="absolute right-2 md:right-10 text-white/70 hover:text-white p-2 transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          >
            <ChevronRight size={48} />
          </button>

          {/* Индикатор текущей фотографии */}
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 text-white/70 font-medium select-none text-lg tracking-widest">
            {selectedImage.index + 1} / {activeProject.images.length}
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ ВИДЕО */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 touch-none"
          onClick={() => setSelectedVideo(null)}
        >
          <button 
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 transition-colors z-50"
            onClick={() => setSelectedVideo(null)}
          >
            <X size={40} />
          </button>

          <div className="w-full max-w-5xl flex flex-col gap-4 relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            {/* Кнопка-предохранитель на случай блокировки со стороны Dzen */}
            <div className="flex justify-end">
              <a 
                href={selectedVideo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
              >
                <ExternalLink size={16} />
                Не загружается видео? Открыть оригинал
              </a>
            </div>
            <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
              <iframe 
                src={getEmbedUrl(selectedVideo)}
                className="w-full h-full border-0" 
                allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
