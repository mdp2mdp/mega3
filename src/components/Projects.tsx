import { createPortal } from "react-dom";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Building, CheckCircle2, Video, X, ChevronLeft, ChevronRight, ExternalLink, ArrowUpRight, Camera, Stethoscope, GraduationCap, CalendarCheck } from 'lucide-react';
import { projectsData, categories, categoryLabel, type Category, type Project } from './projectsData';

const categoryIcon: Record<Category, React.ComponentType<{ size?: number; className?: string }>> = {
  medical: Stethoscope,
  education: GraduationCap,
};

// Заглушка для объектов, фото которых ещё не загружены
function PhotoPlaceholder({ category, className = '' }: { category: Category; className?: string }) {
  const Icon = categoryIcon[category];
  return (
    <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#0f5a6b] to-[#0a3f4b] text-white/80 ${className}`}>
      <Icon size={40} className="opacity-70" />
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-70">
        <Camera size={14} /> Фото скоро появятся
      </span>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<'all' | Category>('all');
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ projectId: number; index: number } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const scrollPositionRef = useRef(0);

  const visibleProjects = useMemo(
    () => (filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter)),
    [filter]
  );
  const counts = useMemo(() => ({
    all: projectsData.length,
    medical: projectsData.filter(p => p.category === 'medical').length,
    education: projectsData.filter(p => p.category === 'education').length,
  }), []);

  const openProject: Project | null = openProjectId ? projectsData.find(p => p.id === openProjectId) ?? null : null;
  const activeProject = selectedImage ? projectsData.find(p => p.id === selectedImage.projectId) ?? null : null;
  const activeImageUrl = activeProject && selectedImage ? activeProject.images[selectedImage.index] : null;

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

  const isModalOpen = !!(openProjectId || selectedImage || selectedVideo);

  // Esc закрывает верхнее окно, стрелки листают фото
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVideo) setSelectedVideo(null);
        else if (selectedImage) setSelectedImage(null);
        else setOpenProjectId(null);
      }
      if (selectedImage) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage, selectedVideo]);

  // Блокировка прокрутки страницы при открытом окне
  useEffect(() => {
    if (isModalOpen) {
      if (document.body.style.position !== 'fixed') {
        scrollPositionRef.current = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.width = '100%';
      }
    } else if (document.body.style.position === 'fixed') {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollPositionRef.current);
      html.style.scrollBehavior = originalScrollBehavior;
    }
  }, [isModalOpen]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.changedTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const distance = touchStartX - e.changedTouches[0].clientX;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
    setTouchStartX(null);
  };

  // Ссылки на видео -> ссылки для плеера (iframe)
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
    <section className="py-20 bg-white border-t-8 border-[#0f5a6b]" id="projects">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Реализованные проекты</h2>
          <div className="w-20 h-1 bg-[#0f5a6b] mx-auto"></div>
        </div>

        {/* Фильтр по направлениям */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Направления проектов">
          {categories.map(c => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(c.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#0f5a6b] text-white border-[#0f5a6b] shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#0f5a6b] hover:text-[#0f5a6b]'
                }`}
              >
                {c.label}
                <span className={`ml-2 text-xs ${active ? 'text-white/70' : 'text-slate-400'}`}>{counts[c.key]}</span>
              </button>
            );
          })}
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map(project => {
            const Icon = categoryIcon[project.category];
            return (
              <article
                key={project.id}
                onClick={() => setOpenProjectId(project.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenProjectId(project.id); } }}
                tabIndex={0}
                role="button"
                aria-label={`${project.title} — подробнее`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5a6b]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {project.images[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <PhotoPlaceholder category={project.category} className="w-full h-full" />
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 text-[#0f5a6b] text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                    <Icon size={14} /> {categoryLabel[project.category]}
                  </span>
                  {project.videoUrl && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      <Video size={14} /> Видео
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6">
                  {project.year && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#0f5a6b] mb-2">
                      <CalendarCheck size={14} /> {project.year}
                    </p>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3">{project.title}</h3>
                  <p className="flex items-start gap-2 text-sm text-slate-500 mb-4">
                    <MapPin size={16} className="text-[#0f5a6b] shrink-0 mt-0.5" />
                    <span>{project.location}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.facts.map(f => (
                      <span key={f} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">{f}</span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#0f5a6b] group-hover:gap-2.5 transition-all">
                    Подробнее <ArrowUpRight size={16} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Окна выносим в body, иначе transform у FadeInSection ломает fixed */}
      {createPortal(<>
      {/* ОКНО ПРОЕКТА */}
      {openProject && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpenProjectId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={openProject.title}
        >
          <div className="min-h-full flex items-start md:items-center justify-center p-0 md:p-8">
            <div
              className="relative bg-white w-full max-w-5xl md:rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenProjectId(null)}
                aria-label="Закрыть"
                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-slate-700 rounded-full p-2 shadow cursor-pointer transition-colors"
              >
                <X size={24} />
              </button>

              <div className="grid lg:grid-cols-12 gap-0">
                {/* Фото */}
                <div className="lg:col-span-5 p-4 md:p-6 space-y-3 bg-slate-50 md:rounded-l-3xl">
                  {openProject.images.length > 0 ? (
                    <>
                      <div
                        className="aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow cursor-zoom-in"
                        onClick={() => setSelectedImage({ projectId: openProject.id, index: 0 })}
                      >
                        <img src={openProject.images[0]} alt={openProject.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="grid grid-cols-6 lg:grid-cols-4 gap-2">
                        {openProject.images.slice(1).map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in"
                            onClick={() => setSelectedImage({ projectId: openProject.id, index: idx + 1 })}
                          >
                            <img src={img} alt={`${openProject.title} фото ${idx + 2}`} loading="lazy" className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-110 transition-all" />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <PhotoPlaceholder category={openProject.category} className="aspect-video rounded-2xl" />
                  )}
                </div>

                {/* Информация */}
                <div className="lg:col-span-7 p-6 md:p-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#0f5a6b]/10 text-[#0f5a6b] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    {React.createElement(categoryIcon[openProject.category], { size: 14 })} {categoryLabel[openProject.category]}
                  </span>
                  {openProject.videoUrl && (
                    <button
                      onClick={() => setSelectedVideo(openProject.videoUrl)}
                      className="flex items-center gap-2 text-red-600 text-sm font-bold hover:text-red-700 transition-colors mb-3 cursor-pointer"
                    >
                      <Video size={18} /> СМОТРЕТЬ ВИДЕООБЗОР
                    </button>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-5 pr-8">{openProject.title}</h3>

                  <div className="space-y-2 mb-6 text-slate-600">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#0f5a6b] shrink-0 mt-1" />
                      <span>{openProject.location}</span>
                    </div>
                    {openProject.client && (
                      <div className="flex items-start gap-3">
                        <Building size={18} className="text-[#0f5a6b] shrink-0 mt-1" />
                        <span>Заказчик: {openProject.client}</span>
                      </div>
                    )}
                    {openProject.year && (
                      <div className="flex items-start gap-3">
                        <CalendarCheck size={18} className="text-[#0f5a6b] shrink-0 mt-1" />
                        <span>{openProject.year}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                    <p className="text-slate-700 leading-relaxed">{openProject.description}</p>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="text-green-600" size={20} />
                    {openProject.featuresTitle}
                  </h4>
                  <ul className="space-y-3">
                    {openProject.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0f5a6b] mt-2 shrink-0"></div>
                        <span className="text-slate-600 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ПОЛНОЭКРАННОЕ ФОТО */}
      {activeImageUrl && activeProject && selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out touch-none"
          onClick={() => setSelectedImage(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="absolute top-5 right-5 text-white/70 hover:text-white p-2 transition-colors z-50" onClick={() => setSelectedImage(null)} aria-label="Закрыть">
            <X size={40} />
          </button>
          <button className="absolute left-2 md:left-10 text-white/70 hover:text-white p-2 transition-colors z-50" onClick={e => { e.stopPropagation(); handlePrev(); }} aria-label="Назад">
            <ChevronLeft size={48} />
          </button>
          <img
            src={activeImageUrl}
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 select-none"
            onClick={e => e.stopPropagation()}
            alt="Увеличенное фото"
          />
          <button className="absolute right-2 md:right-10 text-white/70 hover:text-white p-2 transition-colors z-50" onClick={e => { e.stopPropagation(); handleNext(); }} aria-label="Вперёд">
            <ChevronRight size={48} />
          </button>
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 text-white/70 font-medium select-none text-lg tracking-widest">
            {selectedImage.index + 1} / {activeProject.images.length}
          </div>
        </div>
      )}

      {/* ВИДЕО */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 touch-none"
          onClick={() => setSelectedVideo(null)}
        >
          <button className="absolute top-5 right-5 text-white/70 hover:text-white p-2 transition-colors z-50" onClick={() => setSelectedVideo(null)} aria-label="Закрыть">
            <X size={40} />
          </button>
          <div className="w-full max-w-5xl flex flex-col gap-4 relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
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
      </>, document.body)}
    </section>
  );
}
