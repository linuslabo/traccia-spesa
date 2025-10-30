import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Product } from '../types';
import { PlusIcon, TrashIcon, TicketIcon } from './Icons';

interface NewShoppingProps {
  items: Product[];
  setItems: React.Dispatch<React.SetStateAction<Product[]>>;
  onSaveSession: () => void;
  mealVoucherValue: number;
  isEditing: boolean;
}

const NewShopping: React.FC<NewShoppingProps> = ({ items, setItems, onSaveSession, mealVoucherValue, isEditing }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const generateId = (): string => {
    // Prefer native randomUUID when available
    try {
      if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
        return (crypto as any).randomUUID();
      }
    } catch {}
    // Fallback using getRandomValues (RFC4122 v4)
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0'));
      return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
    }
    // Last-resort fallback
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  };

  useEffect(() => {
    nameInputRef.current?.focus();
  }, [])

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);
  
  const vouchersUsed = mealVoucherValue > 0 ? Math.floor(total / mealVoucherValue) : 0;
  const remainingForNext = mealVoucherValue > 0 ? mealVoucherValue - (total % mealVoucherValue) : 0;


  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price.replace(',', '.'));
    const quantityNum = parseInt(quantity, 10);

    if (name.trim() && !isNaN(priceNum) && priceNum > 0 && !isNaN(quantityNum) && quantityNum > 0) {
      const newItem: Product = {
        id: generateId(),
        name: name.trim(),
        price: priceNum,
        quantity: quantityNum,
      };
      setItems(prevItems => [newItem, ...prevItems]);
      setName('');
      setPrice('');
      setQuantity('1');
      nameInputRef.current?.focus();
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleSave = () => {
    if (items.length > 0) {
      onSaveSession();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddItem} className="bg-secondary p-4 rounded-lg shadow-lg space-y-4">
        <input
          ref={nameInputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome prodotto"
          className="w-full bg-tertiary text-primary placeholder-color p-3 rounded-md border-2 border-transparent accent-border-focus focus:outline-none"
          required
        />
        <div className="flex gap-4">
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Prezzo (€)"
            className="w-1/2 bg-tertiary text-primary placeholder-color p-3 rounded-md border-2 border-transparent accent-border-focus focus:outline-none"
            required
          />
          <input
            type="number"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantità"
            min="1"
            className="w-1/2 bg-tertiary text-primary placeholder-color p-3 rounded-md border-2 border-transparent accent-border-focus focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 accent-bg accent-bg-hover text-on-accent font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          <PlusIcon className="h-5 w-5" />
          Aggiungi Prodotto
        </button>
      </form>

      {items.length === 0 ? (
        <div className="text-center py-10 text-muted bg-secondary/50 rounded-lg">
          <p className="font-semibold">{ isEditing ? 'Nessun prodotto nella lista' : 'La tua lista è vuota' }</p>
          <p className="text-sm">{ isEditing ? 'Aggiungi o modifica i prodotti' : 'Aggiungi un prodotto per iniziare.' }</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-secondary p-3 rounded-lg flex items-center justify-between shadow-md animate-fade-in">
              <div>
                <p className="font-semibold text-primary">{item.name}</p>
                <p className="text-sm text-secondary">{item.quantity} x €{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-lg text-primary">€{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-muted hover:text-danger transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 bg-backdrop backdrop-blur-sm border-t border-color p-4">
        <div className="container mx-auto max-w-lg flex justify-between items-center">
          <div>
            <span className="text-muted text-sm">Totale Provvisorio</span>
            <p className="text-3xl font-bold accent-text">€{total.toFixed(2)}</p>
            {mealVoucherValue > 0 && total > 0 && (
              <div className="flex items-center gap-2 mt-1 text-xs text-secondary">
                <TicketIcon className="h-4 w-4 shrink-0" />
                <span>
                  <strong>{vouchersUsed}</strong> buoni usati &bull; Mancano <strong>€{remainingForNext.toFixed(2)}</strong>
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={items.length === 0}
            className={`font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg ${isEditing ? 'accent-bg text-on-accent accent-bg-hover' : 'bg-green-500 hover:bg-green-600 text-white'} disabled:bg-slate-600 disabled:cursor-not-allowed`}
          >
            {isEditing ? 'Aggiorna Spesa' : 'Salva Spesa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewShopping;