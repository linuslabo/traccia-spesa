import React from 'react';
import type { Settings, Theme } from '../types';

interface SettingsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const handleThemeChange = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSettings(prev => ({ ...prev, mealVoucherValue: value }));
    } else if (e.target.value === '') {
        setSettings(prev => ({...prev, mealVoucherValue: 0}));
    }
  };
  
  const handleAccentColorChange = (colorName: string) => {
    setSettings(prev => ({ ...prev, accentColor: colorName }));
  };

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Chiaro' },
    { value: 'dark', label: 'Scuro' },
    { value: 'amoled', label: 'AMOLED' },
    { value: 'system', label: 'Sistema' },
  ];
  
  const accentColors: { name: string; color: string; label: string; }[] = [
    { name: 'cyan', color: '#22d3ee', label: 'Ciano' },
    { name: 'sky', color: '#38bdf8', label: 'Cielo' },
    { name: 'blue', color: '#60a5fa', label: 'Blu' },
    { name: 'indigo', color: '#818cf8', label: 'Indaco' },
    { name: 'violet', color: '#a78bfa', label: 'Viola' },
    { name: 'fuchsia', color: '#e879f9', label: 'Fucsia' },
    { name: 'rose', color: '#f472b6', label: 'Rosa' },
    { name: 'emerald', color: '#34d399', label: 'Smeraldo' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-primary mb-3">Tema Colore</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`p-3 text-center rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                settings.theme === value
                  ? 'text-on-accent accent-bg accent-border'
                  : 'bg-tertiary border-transparent text-secondary hover:border-color'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-primary mb-3">Colore Principale</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 justify-items-center">
          {accentColors.map(({ name, color, label }) => (
            <button
              key={name}
              onClick={() => handleAccentColorChange(name)}
              className="w-10 h-10 rounded-full transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary flex items-center justify-center"
              style={{ backgroundColor: color, ringColor: color }}
              aria-label={label}
            >
              {settings.accentColor === name && (
                 <svg className="w-5 h-5 text-white mix-blend-difference" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-primary mb-3">Buono Pasto</h3>
        <label htmlFor="voucher-value" className="block text-sm font-medium text-secondary mb-2">
          Valore di un singolo buono pasto (€)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
            €
          </span>
          <input
            id="voucher-value"
            type="number"
            inputMode="decimal"
            value={settings.mealVoucherValue}
            onChange={handleVoucherChange}
            placeholder="Es. 8.00"
            min="0"
            step="0.01"
            className="w-full bg-tertiary text-primary placeholder-color p-3 pl-7 rounded-md border-2 border-transparent accent-border-focus focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;