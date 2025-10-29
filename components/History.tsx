import React, { useState } from 'react';
import type { ShoppingSession } from '../types';
import { ChevronDownIcon, PencilIcon } from './Icons';

interface HistoryProps {
  history: ShoppingSession[];
  onEditSession: (sessionId: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onEditSession }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(currentId => (currentId === id ? null : id));
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-muted bg-secondary/50 rounded-lg">
        <p className="font-semibold">Nessuna spesa salvata.</p>
        <p className="text-sm">Completa una nuova spesa per vederla qui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {history.map(session => (
        <div key={session.id} className="bg-secondary rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <div className="w-full text-left p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-secondary">{session.date}</p>
              <p className="text-xl font-bold accent-text">Totale: €{session.total.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => onEditSession(session.id)} className="p-2 text-muted hover:accent-text transition-colors" aria-label="Modifica spesa">
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => toggleExpand(session.id)} className="p-2 text-muted hover:accent-text transition-colors" aria-label="Mostra dettagli">
                    <ChevronDownIcon
                      className={`h-6 w-6 transition-transform duration-300 ${
                        expandedId === session.id ? 'rotate-180' : ''
                      }`}
                    />
                </button>
            </div>
          </div>
          {expandedId === session.id && (
            <div className="p-4 border-t border-color bg-primary/50">
              <h3 className="font-semibold mb-2 text-muted text-sm">Dettaglio Prodotti:</h3>
              <ul className="space-y-2">
                {session.items.map(item => (
                  <li key={item.id} className="flex justify-between text-secondary text-sm">
                    <span>{item.name} <span className="text-muted">(x{item.quantity})</span></span>
                    <span className="font-mono">€{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default History;