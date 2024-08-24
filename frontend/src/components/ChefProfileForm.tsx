// components/ChefProfileForm.tsx
import React, { useState } from "react";

type ProfileData = {
  name: string;
  description: string;
  specialty: string;
};

type Props = {
  onSubmit: (profileData: ProfileData) => Promise<void>;
  initialData: ProfileData;
};

const ChefProfileForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [specialty, setSpecialty] = useState(initialData.specialty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, description, specialty });
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0 text-center">
      <h2 className="text-2xl font-bold mb-6">Set Your Chef Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Specialty
          </label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChefProfileForm;
