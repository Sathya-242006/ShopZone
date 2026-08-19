import React, { useState } from 'react';
import { X, Globe, Check, Search, DollarSign, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useLocale, COUNTRIES, CountryConfig } from '../context/LocaleContext';

interface LanguageCountryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LanguageCountryModal: React.FC<LanguageCountryModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    country,
    setCountry,
    isLocaleModalOpen: contextIsOpen,
    setIsLocaleModalOpen,
  } = useLocale();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const handleClose = propOnClose || (() => setIsLocaleModalOpen(false));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(country.code);

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.currencySymbol.toLowerCase().includes(q) ||
      c.currencyName.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const handleSelectAndApply = (c: CountryConfig) => {
    setCountry(c.code);
    handleClose();
  };

  return (
    <div
      id="country-currency-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="country-currency-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Select Country & Currency</h3>
              <p className="text-xs text-slate-500">
                All prices and shipping estimates will convert automatically
              </p>
            </div>
          </div>
          <button
            id="close-country-modal-btn"
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Banner */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Active Destination:</span>
            <span className="font-bold flex items-center gap-1.5 text-indigo-300">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </span>
          </div>
          <div className="text-xs font-mono bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-md border border-slate-700 font-bold">
            1 USD = {country.exchangeRate} {country.currency} ({country.currencySymbol})
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="country-search-input"
              type="text"
              placeholder="Search by country name, currency (USD, INR, EUR, GBP, AED)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-2xs"
              autoFocus
            />
          </div>
        </div>

        {/* Countries List */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[420px] space-y-2">
          {filteredCountries.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No countries found</p>
              <p className="text-xs text-slate-400">Try searching for a different country or currency code.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredCountries.map((c) => {
                const isSelected = country.code === c.code;
                return (
                  <button
                    key={c.code}
                    id={`select-country-${c.code.toLowerCase()}-btn`}
                    onClick={() => handleSelectAndApply(c)}
                    className={`text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl drop-shadow-xs">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                            {c.name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-slate-700">{c.currency}</span>
                          <span className="text-slate-300">•</span>
                          <span>{c.currencyName}</span>
                          <span className="font-mono text-indigo-600 font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {c.currencySymbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-indigo-400 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition">
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Language: English (Global)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {COUNTRIES.length} countries supported
          </span>
        </div>
      </div>
    </div>
  );
};
