"use client"

import { FormInputPlay, InputPropsPlay } from '@/comp/ui/formInputPlay';
import { deletePlayGame, updatePlayGame } from '@/data/app/actions/Plays';
import { Play, logPlayTypes, playPersonnelTypes } from '@/data/types/logPlayTypes';
import React, { useEffect, useState } from 'react';

export default function PlayDataCorrection({ play, authorized }: { play: Play; authorized: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Play>>({});
  const [originalPlay, setOriginalPlay] = useState<Partial<Play>>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (play) {
      setFormData(play);
      setOriginalPlay(play);
    }
  }, [play]);

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
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!authorized) return;
    if (!isEditing) return;
    e.preventDefault();

    setIsPending(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          formDataToSend.append(key, value as string | Blob);
        }
      });
      await updatePlayGame(formDataToSend, play.id!);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while updating the play.');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!authorized) return;
    if (window.confirm('Are you sure you want to delete this play?')) {
      setIsPending(true);
      setError(null);

      try {
        await deletePlayGame(play.id!);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while deleting the play.');
      } finally {
        setIsPending(false);
      }
    }
  };

  const toggleEditing = (e: React.MouseEvent) => {
    if (!authorized) return;
    e.preventDefault();
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalPlay });
    setIsEditing(false);
  };

  const formFields: InputPropsPlay[] = [
    { label: '# in Drive', name: 'num_in_game_drive', type: 'number', required: true, onChange: handleInputChange },
    { label: 'Down', name: 'down', type: 'number', onChange: handleInputChange },
    { label: 'Distance', name: 'distance', type: 'number', onChange: handleInputChange },
    { label: 'Yard Line', name: 'yard_line', type: 'number', onChange: handleInputChange },
    { label: 'Hash', name: 'hash', type: 'select', options: ['L', 'M', 'R'], required: true, onChange: handleInputChange },
    { label: 'Personnel', name: 'personnel', type: 'select', options: playPersonnelTypes, required: true, onChange: handleInputChange },
    { label: 'Formation Name', name: 'formation_name', type: 'text', required: true, onChange: handleInputChange },
    { label: 'Back Alignment', name: 'back_alignment', type: 'text', onChange: handleInputChange },
    { label: 'Formation Strength', name: 'formation_strength', type: 'select', options: ['L', 'R'], required: true, onChange: handleInputChange },
    { label: 'Motion', name: 'motion', type: 'text', onChange: handleInputChange },
    { label: 'Pass Protection', name: 'pass_protection', type: 'text', onChange: handleInputChange },
    { label: 'Play Call', name: 'play_call', type: 'text', required: true, onChange: handleInputChange },
    { label: 'Play Call Strength', name: 'play_call_strength', type: 'select', options: ['L', 'R'], required: true, onChange: handleInputChange },
    { label: 'Call Tag', name: 'call_tag', type: 'text', onChange: handleInputChange },
    { label: 'Play Call Type', name: 'play_call_grouping', type: 'select', options: logPlayTypes, required: true, onChange: handleInputChange },
    { label: 'Play Call Family', name: 'play_call_family', type: 'text', onChange: handleInputChange },
    { label: 'Result', name: 'result', type: 'select', options: ["Complete", "Incomplete", "Run", "QB Run", "Scramble", "Sack", "Penalty on Defense", "Penalty on Offense", "Fumble", "Interception", "TD Pass", "TD Run", "TD Scramble", "TD QB Run"], required: true, onChange: handleInputChange },
    { label: 'Yards', name: 'yards', type: 'number', required: true, onChange: handleInputChange },
    { label: 'Missed Check', name: 'missed_check', type: 'checkbox', onChange: handleInputChange },
    { label: 'QB Outstanding Play', name: 'outstanding_qb_play', type: 'checkbox', onChange: handleInputChange },
    { label: 'Off Schedule Play on QB', name: 'off_schedule_play_on_qb', type: 'checkbox', onChange: handleInputChange },
    { label: 'QB Turnover Worthy Play', name: 'turnover_worthy_play', type: 'checkbox', onChange: handleInputChange },
    { label: 'Bad Play Reason', name: 'bad_play_reason', type: 'textarea', onChange: handleInputChange },
    { label: 'Notes', name: 'notes', type: 'textarea', onChange: handleInputChange },
  ];
  return (
    <div className="p-4 bg-neutral-50 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Play Data</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-7 gap-1'>
          {formFields.map((field) => (
            <FormInputPlay
              key={field.name}
              {...field}
              disabled={!isEditing}
              value={
                formData[field.name] === 'null' || formData[field.name] === null
                  ? ''
                  : formData[field.name] as string | number | boolean | undefined
              }
            />
          ))}

        </div>
        <div className="mt-4 flex gap-4 justify-end">
          {authorized && (
            <div className="mt-4 flex gap-4 justify-end">
              {isEditing ? (
                <>
                  <button type="button" className="secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="primary" disabled={isPending}>
                    {isPending ? 'Updating...' : 'Update Play'}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="danger" onClick={handleDelete} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Delete Play'}
                  </button>
                  <button type="button" className="primary" onClick={toggleEditing}>
                    Edit Play
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}