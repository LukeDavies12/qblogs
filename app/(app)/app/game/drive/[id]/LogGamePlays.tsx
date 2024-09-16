"use client"

import { FormInputPlay, InputPropsPlay } from '@/comp/ui/formInputPlay';
import { logGamePlay } from '@/data/app/actions/Plays';
import { Play, logPlayTypes } from '@/data/types/logPlayTypes';
import { useEffect, useState } from 'react';

export default function LogGamePlays({ gameDriveId }: { gameDriveId: number }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Play>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const requiredFields: (keyof Play)[] = [
      'hash', 'personnel', 'formation_name', 'formation_strength', 'play_call',
      'play_call_strength', 'result', 'yards', 'team_qb_id',
      'turnover_worthy_play', 'qb_pressured', 'missed_check', 'play_call_grouping'
    ];
    
    const isValid = requiredFields.every(field => 
      formData[field] !== undefined && formData[field] !== ''
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let inputValue: string | number | boolean | undefined = value;

    if (type === 'number') {
      inputValue = value === '' ? undefined : Number(value);
    } else if (type === 'checkbox') {
      inputValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsPending(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          formDataToSend.append(key, value as string | Blob); 
        }
      });
      await logGamePlay(formDataToSend, gameDriveId);
      setFormData({});
      e.currentTarget.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while logging the play.');
    } finally {
      setIsPending(false);
    }
  };

  const formFields: InputPropsPlay[] = [
    { label: 'Hash', name: 'hash', type: 'select', options: ['L', 'LM', 'M', 'RM', 'R'], required: true, onChange: handleInputChange },
    { label: 'Yard Line', name: 'yard_line', type: 'number', onChange: handleInputChange },
    { label: 'Down', name: 'down', type: 'number', onChange: handleInputChange },
    { label: 'Distance', name: 'distance', type: 'number', onChange: handleInputChange },
    { label: 'Personnel', name: 'personnel', type: 'select', options: ['00', '01', '10', '11', '12', '13', '20', '21', '22', '23'], required: true, onChange: handleInputChange },
    { label: 'Formation Name', name: 'formation_name', type: 'text', required: true, onChange: handleInputChange },
    { label: 'Back Alignment', name: 'back_alignment', type: 'text', onChange: handleInputChange },
    { label: 'Formation Strength', name: 'formation_strength', type: 'select', options: ['L', 'R'], required: true, onChange: handleInputChange },
    { label: 'Motion', name: 'motion', type: 'text', onChange: handleInputChange },
    { label: 'Pass Protection', name: 'pass_protection', type: 'text', onChange: handleInputChange },
    { label: 'Play Call', name: 'play_call', type: 'text', required: true, onChange: handleInputChange },
    { label: 'Play Call Strength', name: 'play_call_strength', type: 'select', options: ['L', 'R'], required: true, onChange: handleInputChange },
    { label: 'Call Tag', name: 'call_tag', type: 'text', onChange: handleInputChange },
    { label: 'Play Call Grouping', name: 'play_call_grouping', type: 'select', options: logPlayTypes, required: true, onChange: handleInputChange },
    { label: 'Result', name: 'result', type: 'select', options: ["Complete", "Incomplete", "Run", "QB Run", "Sack", "Fumble", "Interception", "TD Pass", "TD Run", "TD QB Run"], required: true, onChange: handleInputChange },
    { label: 'Yards', name: 'yards', type: 'number', required: true, onChange: handleInputChange },
    { label: 'Outstanding QB Play', name: 'outstanding_qb_play', type: 'checkbox', onChange: handleInputChange },
    { label: 'Missed Check', name: 'missed_check', type: 'checkbox', required: true, onChange: handleInputChange },
    { label: 'Off Schedule Play on QB', name: 'off_schedule_play_on_qb', type: 'checkbox', onChange: handleInputChange },
    { label: 'Turnover Worthy Play', name: 'turnover_worthy_play', type: 'checkbox', required: true, onChange: handleInputChange },
    { label: 'QB Pressured', name: 'qb_pressured', type: 'checkbox', required: true, onChange: handleInputChange },
    { label: 'Pass Read', name: 'pass_read', type: 'checkbox', onChange: handleInputChange },
    { label: 'Pass Ball Placement', name: 'pass_ball_placement', type: 'checkbox', onChange: handleInputChange },
    { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
    { label: 'QB Run Execution', name: 'qb_run_execution', type: 'checkbox', onChange: handleInputChange },
    { label: 'QB Run Read Key', name: 'qb_run_read_key', type: 'checkbox', onChange: handleInputChange },
    { label: 'Bad Play Reason', name: 'bad_play_reason', type: 'textarea', onChange: handleInputChange },
    { label: 'Notes', name: 'notes', type: 'textarea', onChange: handleInputChange },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-neutral-50 rounded-2xl">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className='grid grid-cols-7 gap-1 items-center'>
        {formFields.map((field) => (
          <FormInputPlay key={field.name} {...field} onChange={handleInputChange} />
        ))}
      </div>
      <div>
        <button type="submit" className={`primary mt-2 w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}  disabled={!isFormValid || isPending}>
          {isPending ? 'Logging Play...' : 'Log Play'}
        </button>
      </div>
    </form>
  )
}