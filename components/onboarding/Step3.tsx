import React, { useState } from 'react';
import { OnboardingData } from './types';
import { MACHINERY_EQUIPMENT_OPTIONS, validateEquipment } from '@/utils/equipment';

interface Step3Props {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const WILAYAS = [
  'Alger',
  'Oran',
  'Constantine',
  'Tlemcen',
  'Annaba',
  'Ghardaïa',
  'Béjaïa',
  'Tizi Ouzou',
  'Blida',
  'Sétif',
  'Batna',
  'Djelfa',
  'Mostaganem',
  'Ouargla',
  'Biskra'
];

const EXPERIENCE_LEVELS = [
  { id: 'Emerging', label: 'Emerging', range: '0–2 years', desc: 'Developing core skills and building a portfolio.' },
  { id: 'Experienced', label: 'Experienced', range: '3–5 years', desc: 'Active professional working on independent projects.' },
  { id: 'Professional', label: 'Professional', range: '6–10 years', desc: 'Highly skilled specialist, established reputation.' },
  { id: 'Master', label: 'Master', range: '10+ years', desc: 'Expert/atelier head with deep knowledge of heritage craft.' },
];

export function Step3({ data, updateData, onNext, onPrev }: Step3Props) {
  const [wilaya, setWilaya] = useState(data.wilaya || '');
  const [experience, setExperience] = useState(data.experience || '');
  const [equipment, setEquipment] = useState<string[]>(data.equipment || []);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!wilaya) {
      setError('Wilaya is required.');
      return;
    }
    if (!experience) {
      setError('Experience level is required.');
      return;
    }
    updateData({ wilaya, experience, equipment: validateEquipment(equipment) });
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-5">
        
        {/* Title */}
        <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider text-[11px] font-bold">
          Where and how do you work?
        </label>

        {/* Wilaya Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="wilaya">
            Wilaya
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest py-3.5 px-4 font-body-md text-on-surface transition-all appearance-none cursor-pointer"
              id="wilaya"
              value={wilaya}
              onChange={(e) => {
                setError(null);
                setWilaya(e.target.value);
              }}
            >
              <option value="">Select your Wilaya</option>
              {WILAYAS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              unfold_more
            </span>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <label className="font-label-md text-label-md text-on-surface-variant block">
            Experience Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXPERIENCE_LEVELS.map((level) => {
              const isSelected = experience === level.id;
              return (
                <button
                  key={level.id}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-outline-variant/60 hover:border-primary/50 text-on-surface-variant hover:bg-surface-container-lowest'
                  }`}
                  type="button"
                  onClick={() => {
                    setError(null);
                    setExperience(level.id);
                  }}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-title-lg text-[14px] font-bold leading-none">
                      {level.label}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container text-[10px] rounded-full font-semibold">
                      {level.range}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    {level.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Machinery & Equipment (Task 4: Profile Creation) */}
        <div className="space-y-3 pt-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface-variant block font-bold">
              Atelier Machinery & Equipment (Optional)
            </label>
            <span className="text-xs text-primary font-semibold">
              {equipment.length} selected
            </span>
          </div>
          <p className="text-xs text-on-surface-variant/80">
            Select specialized machines available in your atelier to showcase your technical capability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {MACHINERY_EQUIPMENT_OPTIONS.map((item) => {
              const isChecked = equipment.includes(item);
              return (
                <label
                  key={item}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-all ${
                    isChecked
                      ? 'bg-primary/5 border-primary/40 text-primary font-medium'
                      : 'border-outline-variant/40 hover:bg-surface-container-lowest text-on-surface'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setEquipment((prev) =>
                        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                      );
                    }}
                    className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary shrink-0"
                  />
                  <span className="leading-tight">{item}</span>
                </label>
              );
            })}
          </div>
        </div>

        {error && (
          <span className="text-xs text-error font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </span>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
        <button
          className="flex-1 border border-outline hover:bg-surface-container-low text-on-surface font-label-md text-label-md py-4 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          type="button"
          onClick={() => {
            updateData({ wilaya, experience, equipment: validateEquipment(equipment) });
            onPrev();
          }}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <button
          className="flex-1 bg-primary text-white font-label-md text-label-md py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          type="button"
          onClick={handleNext}
        >
          Continue
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
