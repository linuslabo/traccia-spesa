import React, { useState, useEffect } from 'react';
import NewShopping from './components/NewShopping';
import History from './components/History';
import BottomNav from './components/BottomNav';
import Settings from './components/Settings';
import type { Product, ShoppingSession, View, Settings as AppSettings } from './types';

const colorThemes: Record<string, Record<string, Record<string, string>>> = {
    cyan: {
        light: { '--accent-color': '#0891b2', '--accent-hover': '#06b6d4', '--accent-text': '#0891b2', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#22d3ee', '--accent-hover': '#67e8f9', '--accent-text': '#22d3ee', '--text-on-accent': '#0f172a' },
    },
    sky: {
        light: { '--accent-color': '#0284c7', '--accent-hover': '#0ea5e9', '--accent-text': '#0284c7', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#38bdf8', '--accent-hover': '#7dd3fc', '--accent-text': '#38bdf8', '--text-on-accent': '#0f172a' },
    },
    blue: {
        light: { '--accent-color': '#2563eb', '--accent-hover': '#3b82f6', '--accent-text': '#2563eb', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#60a5fa', '--accent-hover': '#93c5fd', '--accent-text': '#60a5fa', '--text-on-accent': '#0f172a' },
    },
    indigo: {
        light: { '--accent-color': '#4f46e5', '--accent-hover': '#6366f1', '--accent-text': '#4f46e5', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#818cf8', '--accent-hover': '#a5b4fc', '--accent-text': '#818cf8', '--text-on-accent': '#0f172a' },
    },
    violet: {
        light: { '--accent-color': '#7c3aed', '--accent-hover': '#8b5cf6', '--accent-text': '#7c3aed', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#a78bfa', '--accent-hover': '#c4b5fd', '--accent-text': '#a78bfa', '--text-on-accent': '#0f172a' },
    },
    fuchsia: {
        light: { '--accent-color': '#c026d3', '--accent-hover': '#d946ef', '--accent-text': '#c026d3', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#e879f9', '--accent-hover': '#f0abfc', '--accent-text': '#e879f9', '--text-on-accent': '#0f172a' },
    },
    rose: {
        light: { '--accent-color': '#e11d48', '--accent-hover': '#f43f5e', '--accent-text': '#e11d48', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#f472b6', '--accent-hover': '#fb7185', '--accent-text': '#f472b6', '--text-on-accent': '#0f172a' },
    },
    emerald: {
        light: { '--accent-color': '#059669', '--accent-hover': '#10b981', '--accent-text': '#059669', '--text-on-accent': '#ffffff' },
        dark: { '--accent-color': '#34d399', '--accent-hover': '#6ee7b7', '--accent-text': '#34d399', '--text-on-accent': '#0f172a' },
    },
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('new');
  const [history, setHistory] = useState<ShoppingSession[]>([]);
  const [currentItems, setCurrentItems] = useState<Product[]>([]);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      const defaults = { theme: 'dark', mealVoucherValue: 8, accentColor: 'cyan' };
      return savedSettings ? { ...defaults, ...JSON.parse(savedSettings) } : defaults;
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      return { theme: 'dark', mealVoucherValue: 8, accentColor: 'cyan' };
    }
  });

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('shoppingHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedCurrentItems = localStorage.getItem('currentShoppingItems');
      if (savedCurrentItems && !editingSessionId) {
        setCurrentItems(JSON.parse(savedCurrentItems))
      };
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shoppingHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save shopping history to localStorage", error);
    }
  }, [history]);
  
  // Save current items to localStorage
  useEffect(() => {
    try {
       if (!editingSessionId) {
         localStorage.setItem('currentShoppingItems', JSON.stringify(currentItems));
       }
    } catch (error) {
      console.error("Failed to save current items to localStorage", error);
    }
  }, [currentItems, editingSessionId]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  // Handle theme changes
  useEffect(() => {
    const applyTheme = (theme: AppSettings['theme']) => {
      const root = document.documentElement;
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', theme);
      }
    };
    
    applyTheme(settings.theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme(settings.theme);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Handle Accent Color changes
  useEffect(() => {
    const root = document.documentElement;
    const themeAttribute = root.getAttribute('data-theme');
    const isDark = themeAttribute === 'dark' || themeAttribute === 'amoled';
    
    const colors = colorThemes[settings.accentColor as keyof typeof colorThemes] || colorThemes.cyan;
    const themeColors = isDark ? colors.dark : colors.light;

    for (const [key, value] of Object.entries(themeColors)) {
        root.style.setProperty(key, value);
    }
  }, [settings.accentColor, settings.theme]);

  const handleEditSession = (sessionId: string) => {
    const sessionToEdit = history.find(s => s.id === sessionId);
    if (sessionToEdit) {
      setEditingSessionId(sessionId);
      setCurrentItems([...sessionToEdit.items]);
      setView('new');
    }
  };

  const handleSaveSession = () => {
    if (currentItems.length === 0) return;

    const total = currentItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (editingSessionId) {
      // Update existing session
      setHistory(prevHistory => prevHistory.map(session => 
        session.id === editingSessionId
          ? { ...session, items: currentItems, total, date: new Date().toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'short' }) + ' (mod.)' }
          : session
      ));
      setEditingSessionId(null);
    } else {
      // Create new session
      const newSession: ShoppingSession = {
        id: new Date().toISOString(),
        date: new Date().toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'short' }),
        items: currentItems,
        total,
      };
      setHistory(prevHistory => [newSession, ...prevHistory]);
      setView('history');
    }
    
    setCurrentItems([]);
  };
  
  const titles: Record<string, {title: string, subtitle: string}> = {
    history: { title: "Storico", subtitle: "Rivedi le tue spese passate" },
    settings: { title: "Impostazioni", subtitle: "Personalizza la tua esperienza" }
  }

  const currentTitleInfo = (view in titles) ? titles[view as keyof typeof titles] : null;

  return (
    <div className="bg-primary text-primary min-h-screen font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24">
        {currentTitleInfo && (
          <header className="text-center my-6 animate-fade-in">
            <h1 className="text-4xl font-bold accent-text tracking-tight">{currentTitleInfo.title}</h1>
            <p className="text-muted mt-1">{currentTitleInfo.subtitle}</p>
          </header>
        )}
        <main>
          {view === 'new' && <NewShopping items={currentItems} setItems={setCurrentItems} onSaveSession={handleSaveSession} mealVoucherValue={settings.mealVoucherValue} isEditing={!!editingSessionId} />}
          {view === 'history' && <History history={history} onEditSession={handleEditSession} />}
          {view === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
        </main>
      </div>
      <BottomNav currentView={view} setView={setView} />
    </div>
  );
};

export default App;