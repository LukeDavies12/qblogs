"use client"

import { FormInputPlay, InputPropsPlay } from '@/comp/ui/formInputPlay';
import { logGamePlay } from '@/data/app/actions/Plays';
import { Play, logPlayTypes, playPersonnelTypes } from '@/data/types/logPlayTypes';
import { useRef, useState } from 'react';

export default function LogGamePlays({ gameDriveId }: { gameDriveId: number }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Play>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const requiredFields: (keyof Play)[] = [
    'num_in_game_drive', 'hash', 'yard_line', 'down', 'distance', 'personnel',
    'formation_name', 'formation_strength', 'play_call',
    'play_call_strength', 'result', 'yards', 'play_call_grouping'
  ];

  const validateForm = (data: Partial<Play>) => {
    return requiredFields.every(field => {
      const value = data[field];
      return value !== undefined && value !== '' && value !== null;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let inputValue: string | number | boolean = value;

    if (type === 'number') {
      inputValue = value === '' ? '' : Number(value);
    } else if (type === 'checkbox') {
      inputValue = (e.target as HTMLInputElement).checked;
    }

    const updatedFormData = { ...formData, [name]: inputValue };
    setIsFormValid(validateForm(updatedFormData));

    setFormData(updatedFormData);
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
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while logging the play.');
    } finally {
      setIsPending(false);
    }
  };

  const baseFormFields: InputPropsPlay[] = [
    { label: '# in Drive*', name: 'num_in_game_drive', type: 'number', required: true, onChange: handleInputChange, placeholder: 'Enter play number' },
    { label: 'Down*', name: 'down', type: 'number', onChange: handleInputChange, placeholder: 'Enter down', required: true },
    { label: 'Distance*', name: 'distance', type: 'number', onChange: handleInputChange, placeholder: 'Enter distance', required: true },
    { label: 'Yard Line*', name: 'yard_line', type: 'number', onChange: handleInputChange, placeholder: 'Enter yard line', required: true },
    { label: 'Hash*', name: 'hash', type: 'select', options: ['L', 'M', 'R'], required: true, onChange: handleInputChange, placeholder: 'Select hash' },
    { label: 'Personnel*', name: 'personnel', type: 'select', options: playPersonnelTypes, required: true, onChange: handleInputChange, placeholder: 'Select personnel' },
    { label: 'Formation Name*', name: 'formation_name', type: 'text', required: true, onChange: handleInputChange, placeholder: 'Enter formation name' },
    { label: 'Back Alignment', name: 'back_alignment', type: 'text', onChange: handleInputChange, placeholder: 'Enter back alignment' },
    { label: 'Formation Strength*', name: 'formation_strength', type: 'select', options: ['L', 'R'], required: true, onChange: handleInputChange, placeholder: 'Select formation strength' },
    { label: 'Motion', name: 'motion', type: 'text', onChange: handleInputChange, placeholder: 'Enter motion' },
    { label: 'Pass Protection', name: 'pass_protection', type: 'text', onChange: handleInputChange, placeholder: 'Enter pass protection' },
    { label: 'Play Call*', name: 'play_call', type: 'text', required: true, onChange: handleInputChange, placeholder: 'Enter play call' },
    { label: 'Play Call Strength*', name: 'play_call_strength', type: 'select', options: ['L', 'R'], required: true, onChange: handleInputChange, placeholder: 'Select play call strength' },
    { label: 'Call Tag', name: 'call_tag', type: 'text', onChange: handleInputChange, placeholder: 'Enter call tag' },
    { label: 'Play Call Type*', name: 'play_call_grouping', type: 'select', options: logPlayTypes, required: true, onChange: handleInputChange, placeholder: 'Select play call type' },
    { label: 'Play Call Family', name: 'play_call_family', type: 'text', onChange: handleInputChange, placeholder: 'Enter play call family' },
    { label: 'Result*', name: 'result', type: 'select', options: ["Complete", "Incomplete", "Run", "QB Run", "Scramble", "Sack", "Penalty on Defense", "Penalty on Offense", "Fumble", "Interception", "TD Pass", "TD Run", "TD Scramble", "TD QB Run"], required: true, onChange: handleInputChange, placeholder: 'Select result' },
    { label: 'Yards*', name: 'yards', type: 'number', required: true, onChange: handleInputChange, placeholder: 'Enter yards' },
    { label: 'Missed Check', name: 'missed_check', type: 'checkbox', onChange: handleInputChange },
    { label: 'QB Outstanding Play', name: 'outstanding_qb_play', type: 'checkbox', onChange: handleInputChange },
    { label: 'Off Schedule Play on QB', name: 'off_schedule_play_on_qb', type: 'checkbox', onChange: handleInputChange },
    { label: 'QB Turnover Worthy Play', name: 'turnover_worthy_play', type: 'checkbox', onChange: handleInputChange },
  ];

  const getConditionalFields = (): InputPropsPlay[] => {
    const playCallGrouping = formData.play_call_grouping;
    const result = formData.result;

    switch (playCallGrouping) {
      case 'Pass':
        if (result === 'Incomplete' || result === 'Complete' || result === 'TD Pass' || result === 'Interception') {
          return [
            { label: 'QB Pressured', name: 'qb_pressured', type: 'checkbox', onChange: handleInputChange },
            { label: 'Pass Read', name: 'pass_read', type: 'checkbox', onChange: handleInputChange },
            { label: 'Pass Ball Placement', name: 'pass_ball_placement', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'Sack') {
          return [
            { label: 'QB Pressured', name: 'qb_pressured', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'Fumble') {
          return [
            { label: 'QB Pressured', name: 'qb_pressured', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'Scramble' || 'TD Scramble') {
          return [
            { label: 'QB Pressured', name: 'qb_pressured', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        return [];
      case 'Run with RPO':
        if (result === 'Run' || result === 'TD Run' || result === 'Fumble' || result === 'Sack') {
          return [
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'Scramble') {
          return [
            { label: 'QB Pressured', name: 'qb_pressured', type: 'checkbox', onChange: handleInputChange },
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
          ]
        }
        if (result === 'Incomplete' || result === 'Complete' || result === 'TD Pass' || result === 'Interception') {
          return [
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
            { label: 'Pass Ball Placement', name: 'pass_ball_placement', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        return [];
      case 'QB Run no Read':
        return [
          { label: 'QB Run Execution', name: 'qb_run_execution', type: 'checkbox', onChange: handleInputChange },
        ];
      case 'QB Run with RPO':
        if (result === 'Run') {
          return [
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'QB Run') {
          return [
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
            { label: 'QB Run Execution', name: 'qb_run_execution', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'Incomplete' || result === 'Complete' || result === 'TD Pass' || result === 'Interception') {
          return [
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
            { label: 'Pass Ball Placement', name: 'pass_ball_placement', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'Sack') {
          return [
            { label: 'Run RPO Key Read', name: 'run_rpo_key_read', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        return [];
      case 'QB Run with Run Read Key':
        if (result === 'Run') {
          return [
            { label: 'QB Run Read Key', name: 'qb_run_read_key', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        if (result === 'QB Run') {
          return [
            { label: 'QB Run Read Key', name: 'qb_run_read_key', type: 'checkbox', onChange: handleInputChange },
            { label: 'QB Run Execution', name: 'qb_run_execution', type: 'checkbox', onChange: handleInputChange },
          ];
        }
        return [];
      default:
        return [];
    }
  };

  const finalFormFields: InputPropsPlay[] = [
    ...baseFormFields,
    ...getConditionalFields(),
    { label: 'Bad Play Reason', name: 'bad_play_reason', type: 'textarea', onChange: handleInputChange },
    { label: 'Notes', name: 'notes', type: 'textarea', onChange: handleInputChange },
  ];

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="p-4 bg-neutral-50 rounded-2xl">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className='grid grid-cols-7 gap-1 items-center'>
        {finalFormFields.map((field) => (
          <FormInputPlay
            key={field.name} {...field}
            onChange={handleInputChange}
            value={
              formData[field.name] === 'null' || formData[field.name] === null
                ? ''
                : formData[field.name] as string | number | boolean | undefined
            } />
        ))}
      </div>
      <div>
        <button type="submit"
          className={`primary mt-2 w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid || isPending}>
          {isPending ? 'Logging Play...' : 'Log Play'}
        </button>
      </div>
    </form>
  )
}