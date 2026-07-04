import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group inline-flex items-center">
      <div className="flex items-center gap-1 text-slate-600 hover:text-[#2563eb] cursor-pointer p-2 rounded-md transition-colors">
        <Globe className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase">{i18n.language}</span>
      </div>
      <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden min-w-[120px] z-50">
        <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563eb] transition-colors">English</button>
        <button onClick={() => changeLanguage('hi')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563eb] transition-colors">हिन्दी (Hindi)</button>
        <button onClick={() => changeLanguage('bn')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563eb] transition-colors">বাংলা (Bengali)</button>
        <button onClick={() => changeLanguage('mr')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563eb] transition-colors">मराठी (Marathi)</button>
      </div>
    </div>
  );
};
