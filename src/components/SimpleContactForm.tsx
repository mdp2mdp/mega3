import React from 'react';

export const SimpleContactForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо! Мы свяжемся с вами.');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Оставить заявку</h3>
        <div className="w-16 h-1 bg-[#0f5a6b] mx-auto rounded-full"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
          <input
            type="text"
            id="name"
            required
            className="w-full"
            placeholder="Как к вам обращаться?"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
          <input
            type="tel"
            id="phone"
            required
            className="w-full"
            placeholder="+7 (999) 000-00-00"
          />
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
          <textarea
            id="comment"
            rows={4}
            className="w-full"
            placeholder="Опишите ваш вопрос или задачу"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#0f5a6b] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#0d4b59] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Отправить
        </button>
      </form>
    </div>
  );
};