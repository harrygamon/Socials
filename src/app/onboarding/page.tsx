"use client";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const APP_NAME = 'Social';

const steps = [
  { label: "Photo" },
  { label: "Details" },
  { label: "Bio & Interests" },
];

function ProfilePreview({ image, name, age, gender, bio, interests }: { image?: string | null, name?: string, age?: string, gender?: string, bio?: string, interests?: string }) {
  return (
    <div className="card w-full max-w-xs mx-auto mt-8 md:mt-0 md:ml-8 flex flex-col items-center">
      <Avatar className="w-20 h-20 mb-2 shadow-neumorph">
        <AvatarImage src={image || ''} alt={name || 'Profile'} />
        <AvatarFallback>{name?.charAt(0) || '?'}</AvatarFallback>
      </Avatar>
      <h3 className="text-lg font-bold text-midnight mb-1">{name || 'Your Name'}{age ? `, ${age}` : ''}</h3>
      <span className="text-purple/70 text-sm mb-2">{gender && gender !== 'OTHER' ? gender : ''}</span>
      <p className="text-purple/80 text-center text-sm mb-2 min-h-[40px]">{bio || 'Your bio will appear here.'}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {(interests ? interests.split(',').map(i => i.trim()).filter(Boolean) : []).map((interest, idx) => (
          <span key={idx} className="bg-lilac/40 text-purple text-xs rounded-pill px-3 py-1 font-medium shadow-neumorph">{interest}</span>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [details, setDetails] = useState({ name: '', age: '', gender: 'OTHER' });
  const [detailsError, setDetailsError] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [bioError, setBioError] = useState('');
  const router = useRouter();
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishError, setFinishError] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [interestsList, setInterestsList] = useState<string[]>([]);

  // Add interest on Enter or comma
  const handleInterestInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && interestInput.trim()) {
      e.preventDefault();
      if (!interestsList.includes(interestInput.trim().toLowerCase())) {
        setInterestsList([...interestsList, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };
  // Remove interest
  const removeInterest = (idx: number) => {
    setInterestsList(interestsList.filter((_, i) => i !== idx));
  };

  // Step 1: Photo upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social-posts");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) {
      setImage(data.secure_url);
    }
    setUploading(false);
  };

  // Step 2: Details
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  const handleDetailsNext = () => {
    if (!details.name.trim() || !details.age) {
      setDetailsError('Please fill in all fields.');
      return;
    }
    setDetailsError('');
    setStep(2);
  };

  // Step 3: Bio & Interests
  const handleFinish = async () => {
    if (!bio.trim() || interestsList.length === 0) {
      setBioError('Please fill in all fields.');
      return;
    }
    setBioError('');
    setFinishLoading(true);
    setFinishError('');
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          name: details.name,
          age: details.age,
          gender: details.gender,
          bio,
          interests: interestsList.join(', '),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFinishError(data.error || 'Failed to complete onboarding.');
        setFinishLoading(false);
        return;
      }
      router.replace('/feed');
    } catch (err) {
      setFinishError('Failed to complete onboarding.');
      setFinishLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-lilac via-midnight to-teal">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="card w-full max-w-md mx-auto p-8 relative overflow-visible">
          {/* App Name & Welcome Message */}
          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-purple tracking-wide">{APP_NAME}</span>
            <h2 className="text-xl font-semibold text-midnight mt-2">Let’s get you set up!</h2>
            <p className="text-purple/70 mt-1">Complete your profile to start matching and connecting.</p>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-lilac/30 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-purple transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={steps.length}
              role="progressbar"
            />
          </div>
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.label} className="flex-1 flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${i <= step ? 'bg-purple' : 'bg-lilac/40'} transition-all duration-300`}>{i + 1}</div>
                <span className={`mt-2 text-xs font-medium ${i === step ? 'text-purple' : 'text-midnight/60'} transition-all duration-300`}>{s.label}</span>
              </div>
            ))}
          </div>
          {/* Animated Step Content */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                aria-label="Profile photo step"
              >
                {/* Step 1: Photo Upload */}
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4 shadow-neumorph">
                    <AvatarImage src={image || ''} alt="Profile" />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <label className="flex flex-col items-center cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} aria-label="Upload profile photo" />
                    <Button type="button" variant="outline" className="flex items-center gap-2" disabled={uploading}>
                      <Camera className="w-5 h-5" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </label>
                  {image && (
                    <Button className="btn-primary mt-8 w-full" onClick={() => setStep(1)} autoFocus>
                      Next
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                aria-label="Profile details step"
              >
                {/* Step 2: Name, Age, Gender */}
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={details.name}
                      onChange={handleDetailsChange}
                      className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={details.age}
                      onChange={handleDetailsChange}
                      className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                      required
                      min={18}
                      max={99}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-1">Gender</label>
                    <select
                      name="gender"
                      value={details.gender}
                      onChange={handleDetailsChange}
                      className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  {detailsError && <div className="text-red-500 text-sm text-center">{detailsError}</div>}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                      Back
                    </Button>
                    <Button className="btn-primary flex-1" onClick={handleDetailsNext}>
                      Next
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                aria-label="Profile bio and interests step"
              >
                {/* Step 3: Bio & Interests */}
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                      rows={3}
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-1">Interests</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {interestsList.map((interest, idx) => (
                        <span key={idx} className="bg-lilac/40 text-purple text-xs rounded-pill px-3 py-1 font-medium shadow-neumorph flex items-center gap-1">
                          {interest}
                          <button
                            type="button"
                            className="ml-1 text-purple/60 hover:text-purple focus:outline-none"
                            aria-label={`Remove interest ${interest}`}
                            onClick={() => removeInterest(idx)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      name="interestInput"
                      value={interestInput}
                      onChange={e => setInterestInput(e.target.value)}
                      onKeyDown={handleInterestInput}
                      className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                      placeholder="Type an interest and press Enter"
                      aria-label="Add interest"
                    />
                  </div>
                  {bioError && <div className="text-red-500 text-sm text-center">{bioError}</div>}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="btn-primary flex-1" onClick={handleFinish} disabled={finishLoading}>
                      {finishLoading ? 'Finishing...' : 'Finish'}
                    </Button>
                  </div>
                  {finishError && <div className="text-red-500 text-sm text-center mt-2">{finishError}</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Live Profile Preview */}
      <div className="flex-1 w-full flex items-center justify-center">
        <ProfilePreview
          image={image}
          name={details.name}
          age={details.age}
          gender={details.gender}
          bio={bio}
          interests={interestsList.join(', ')}
        />
      </div>
    </div>
  );
} 