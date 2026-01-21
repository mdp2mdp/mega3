import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Пожалуйста, введите название компании';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, введите адрес электронной почты';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Пожалуйста, введите корректный адрес электронной почты';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Пожалуйста, опишите ваш проект';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Описание проекта должно содержать минимум 10 символов';
    }

    if (!formData.consent) {
      newErrors.consent = 'Пожалуйста, согласитесь на обработку персональных данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubmitted(true);
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        message: '',
        consent: false,
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted && (
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-700 font-medium">Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.</p>
        </div>
      )}

      <div>
        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0f5a6b] transition-colors disabled:bg-gray-100 ${
            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{errors.name}</span>
          </div>
        )}
      </div>

      <div>
        <input
          type="text"
          name="company"
          placeholder="Компания"
          value={formData.company}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0f5a6b] transition-colors disabled:bg-gray-100 ${
            errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.company && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{errors.company}</span>
          </div>
        )}
      </div>

      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0f5a6b] transition-colors disabled:bg-gray-100 ${
            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.phone && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{errors.phone}</span>
          </div>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0f5a6b] transition-colors disabled:bg-gray-100 ${
            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Описание проекта"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#0f5a6b] transition-colors disabled:bg-gray-100 ${
            errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        ></textarea>
        {errors.message && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{errors.message}</span>
          </div>
        )}
      </div>

      <div>
        <div className={`flex items-start gap-3 p-4 rounded-lg ${
          errors.consent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
        }`}>
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 w-5 h-5 text-[#0f5a6b] border-gray-300 rounded focus:ring-[#0f5a6b] cursor-pointer disabled:opacity-50"
          />
          <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
            Я согласен на обработку моих персональных данных в соответствии с Федеральным законом От 26.06.2006 № 152-ФЗ «О защите персональных данных»
          </label>
        </div>
        {errors.consent && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{errors.consent}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#0f5a6b] text-white py-3 rounded-lg hover:bg-[#0d4a57] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
