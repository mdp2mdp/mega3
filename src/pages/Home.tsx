import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { APP_LOGO } from '@/const';
// import { ServiceIcon } from '@/components/ServiceIcons';
// import { TelegramIcon, WhatsAppIcon, MessengerLink } from '@/components/MessengerIcons';
// import { ContactForm } from '@/components/ContactForm';
import { SimpleContactForm } from '../components/SimpleContactForm';
import Projects from '../components/Projects';
import Hero from '../components/Hero';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const advantagesRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'О компании', ref: aboutRef },
    { label: 'Услуги', ref: servicesRef },
    { label: 'Преимущества', ref: advantagesRef },
    { label: 'Проекты', ref: projectsRef },
    { label: 'Вопросы', ref: faqRef },
    { label: 'Контакты', ref: contactRef },
  ];

  const Counter = ({ target, label, suffix }: { target: number; label: string; suffix: string }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let current = 0;
          const increment = Math.ceil(target / 50);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 30);
        }
      });
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [hasAnimated, target]);

    return (
      <div ref={ref} className="text-center">
        <div className="text-4xl font-bold text-white mb-2">
          {count}{suffix}
        </div>
        <p className="text-gray-200 text-sm">{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={APP_LOGO} alt="Logo" className="h-10" />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.ref)}
                className="text-gray-700 hover:text-[#0f5a6b] transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a href="tel:+79266010660" className="flex items-center gap-1 md:gap-2 text-gray-700 hover:text-[#0f5a6b] transition-colors">
              <Phone size={16} />
              <span className="hidden md:inline text-sm font-medium">+7 926 601-06-60</span>
            </a>
            
            <a href="https://wa.me/79266010660" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-6 w-auto" />
            </a>
            <a href="https://t.me/P757BP" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/telegram-icon.png" alt="Telegram" className="h-6 w-auto" />
            </a>
            <a href="https://max.ru/u/f9LHodD0cOIhZcRXW9VFkiSla5sHUI4LrlvepURUaCJWE1Hfm2v8NRE2wrU" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/max-icon.png" alt="Max" className="h-6 w-auto" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-[#0f5a6b]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide from right */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
            <nav className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg animate-in slide-in-from-right-full duration-300">
              <div className="p-6 space-y-4">
                <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4">
                  <X size={24} className="text-gray-700" />
                </button>
                <div className="mt-8 space-y-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => scrollToSection(item.ref)}
                      className="block w-full text-left text-gray-700 hover:text-[#0f5a6b] py-2 font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <a href="tel:+79261692970" className="block text-gray-700 hover:text-[#0f5a6b] py-2 font-medium">
                    +7 926 169-29-70
                  </a>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <a href="https://wa.me/79266010660" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-8 w-auto" />
                  </a>
                  <a href="https://t.me/P757BP" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src="/telegram-icon.png" alt="Telegram" className="h-8 w-auto" />
                  </a>
                  <a href="https://max.ru/u/f9LHodD0cOIhZcRXW9VFkiSla5sHUI4LrlvepURUaCJWE1Hfm2v8NRE2wrU" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src="/max-icon.png" alt="Max" className="h-8 w-auto" />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Redesigned with equipment focus */}
      <Hero 
        onContactClick={() => scrollToSection(contactRef)} 
        onProjectsClick={() => scrollToSection(projectsRef)} 
      />

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">О компании</h2>
            <div className="w-20 h-1 bg-[#0f5a6b] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#0f5a6b] mb-3">Опыт и профессионализм</h3>
                <p className="text-gray-600 leading-relaxed">
                  Компания специализируется на комплексном оснащении медицинских, образовательных и других государственных учреждений. Реализуются проекты «под ключ» — от анализа технической и проектной документации до поставки, монтажа и ввода оборудования в эксплуатацию.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0f5a6b] mb-3">Наш подход</h3>
                <p className="text-gray-600 leading-relaxed">
                  Работа ведется в строгом соответствии с регулирующими документами. Команда инженеров детально изучает задачи заказчика, оптимизирует техническое задание, предлагая практичные и экономически обоснованные варианты.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-[#0f5a6b]">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Почему мы лучше</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#0f5a6b] font-bold text-lg">✓</span>
                  <span className="text-gray-600">Опытная команда профессионалов</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0f5a6b] font-bold text-lg">✓</span>
                  <span className="text-gray-600">Поставщик эксклюзивной компьютерной техники и мебели</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0f5a6b] font-bold text-lg">✓</span>
                  <span className="text-gray-600">Сотрудничество с надежными поставщиками</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0f5a6b] font-bold text-lg">✓</span>
                  <span className="text-gray-600">Гарантия качества и долговечности продуктов</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0f5a6b] font-bold text-lg">✓</span>
                  <span className="text-gray-600">Проекты реализуются в строгом соответствии с документами</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 border-t-8 border-[#0f5a6b]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Наши ценности</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Скорость и гибкость</h3>
              <p className="text-gray-600">
                Отсутствие бюрократии позволяет решать вопросы оперативно. Быстрое принятие решений и адаптация к изменяющимся условиям — преимущество перед крупными игроками рынка.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Клиентоориентированность</h3>
              <p className="text-gray-600">
                Глубокое погружение в специфику деятельности каждого клиента позволяет подобрать решение, которое повысит именно его эффективность, а не просто соответствует стандартам.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Прозрачность</h3>
              <p className="text-gray-600">
                Открытое общение, честные сметы и отсутствие скрытых платежей. Клиент всегда знает, за что платит и какой результат получит.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Профессионализм</h3>
              <p className="text-gray-600">
                Сочетание глубоких профессиональных знаний и энергии, которая вкладывается в каждый проект. Высокий уровень подготовки специалистов гарантирует качественное выполнение работ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-[#0f5a6b] border-t-8 border-[#0f5a6b]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Наши достижения</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Counter target={2020} label="год основания" suffix="" />
            <Counter target={35} label="проектов за последний год" suffix="+" />
            <Counter target={40} label="областей РФ, где работает наша команда" suffix="+" />
            <Counter target={100} label="проектов сданы в строго оговоренные сроки" suffix="%" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 bg-gray-50 border-t-8 border-[#0f5a6b]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Наши услуги</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { title: 'Экспертиза проектной документации', desc: 'Детальный анализ технического задания и оптимизация решений', icon: 'expertise' as const },
              { title: 'Поставка оборудования', desc: 'Работа с надежными производителями и поставщиками', icon: 'supply' as const },
              { title: 'Монтаж и установка', desc: 'Профессиональный монтаж с соблюдением всех норм', icon: 'installation' as const },
              { title: 'Пусконаладка', desc: 'Полная настройка и тестирование оборудования', icon: 'commissioning' as const },
              { title: 'Техническое обслуживание', desc: 'Постоянная поддержка и обслуживание систем', icon: 'maintenance' as const },
            ].map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  {/* <ServiceIcon type={service.icon} /> */}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section ref={advantagesRef} className="py-20 bg-white border-t-8 border-[#0f5a6b]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Почему выбирают МЕГА-СЕРВИС?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Комплексный подход', desc: 'От анализа ТЗ до ввода оборудования в эксплуатацию' },
              { title: 'Надежные партнеры', desc: 'Работа только с проверенными производителями' },
              { title: 'Быстрое выполнение', desc: 'Соблюдение сроков — гарантия для каждого проекта' },
              { title: 'Профессиональная команда', desc: 'Опытные инженеры и проектировщики' },
            ].map((adv, i) => (
              <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{adv.title}</h3>
                  <p className="text-gray-600">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Projects Section */}
      <div ref={projectsRef}>
        <Projects />
      </div>





      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-gray-50 border-t-8 border-[#0f5a6b]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {[
              { q: 'Какие сроки выполнения проектов?', a: 'Сроки зависят от объема и сложности проекта. В среднем проекты выполняются за 2-4 недели. Мы всегда стараемся соблюдать согласованные сроки.' },
              { q: 'Даете ли вы гарантию на оборудование?', a: 'Да, мы предоставляем гарантию на все поставляемое оборудование в соответствии с условиями производителя. Также предлагаем услуги техническое обслуживания.' },
              { q: 'Как происходит процесс согласования проекта?', a: 'После получения технического задания наша команда проводит анализ, разрабатывает предложение и согласовывает все детали с клиентом перед началом работ.' },
              { q: 'Какие способы оплаты вы принимаете?', a: 'Мы принимаем банковские переводы, наличный расчет и другие удобные для вас способы оплаты. Возможна рассрочка для крупных проектов.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left font-bold text-gray-900 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  {item.q}
                  <span className={`transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {expandedFaq === i && (
                  <div className="px-6 py-4 border-t border-gray-200 text-gray-600">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 bg-white border-t-8 border-[#0f5a6b]">
        <div className="max-w-2xl mx-auto px-4">
          <SimpleContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f5a6b] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Контакты</h3>
              <p>+7 926 601-06-60</p>
              <div className="flex items-center gap-3 my-3">
                <a href="https://wa.me/79266010660" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  <img src="/whatsapp-icon.png" alt="WhatsApp" className="h-6 w-6 object-contain" />
                </a>
                <a href="https://t.me/P757BP" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  <img src="/telegram-icon.png" alt="Telegram" className="h-6 w-6 object-contain" />
                </a>
                <a href="https://max.ru/u/f9LHodD0cOIhZcRXW9VFkiSla5sHUI4LrlvepURUaCJWE1Hfm2v8NRE2wrU" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  <img src="/max-icon.png" alt="Max" className="h-6 w-6 object-contain" />
                </a>
              </div>
              <p>info@mgservis.ru</p>
              <p className="mt-2 text-sm text-gray-300">г. Мытищи, ул. Кадомцева, д.2</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Навигация</h3>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <button onClick={() => scrollToSection(item.ref)} className="hover:underline">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Реквизиты</h3>
              <p>ООО "Мега-Сервис"</p>
              <p>ИНН: 5029053808</p>
              <p>ОГРН: 1035005502663</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center">
            <p>&copy; 2024 Мега-Сервис-Групп. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
