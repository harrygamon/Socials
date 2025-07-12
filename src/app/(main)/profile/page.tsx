'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Edit, 
  Camera, 
  Settings, 
  Heart, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  Crown,
  Shield
} from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || 'Your Name',
    bio: 'Adventure seeker and coffee enthusiast. Looking for someone to explore the world with! 🌍',
    age: 25,
    location: 'New York, NY',
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee', 'Music'],
    subscription: 'FREE' as 'FREE' | 'SILVER' | 'GOLD'
  })

  const handleSave = () => {
    // TODO: Implement profile update
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  const handleUpgrade = async (plan: 'SILVER' | 'GOLD') => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  const subscriptionPlans = {
    FREE: { name: 'Free', icon: Shield, color: 'text-secondary-600' },
    SILVER: { name: 'Silver', icon: Star, color: 'text-secondary-500' },
    GOLD: { name: 'Gold', icon: Crown, color: 'text-yellow-500' }
  }

  const currentPlan = subscriptionPlans[profileData.subscription]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                <AvatarFallback className="text-2xl">{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{profileData.age} years old</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  {isEditing && (
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                {profileData.bio}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-secondary-400">
                  <Heart className="w-4 h-4" />
                  <span>24 matches</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-secondary-400">
                  <Users className="w-4 h-4" />
                  <span>156 followers</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-secondary-400">
                  <currentPlan.icon className={`w-4 h-4 ${currentPlan.color}`} />
                  <span>{currentPlan.name} Plan</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <Input
                      id="interests"
                      value={profileData.interests.join(', ')}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        interests: e.target.value.split(',').map(i => i.trim()) 
                      }))}
                      placeholder="Travel, Photography, Hiking..."
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Bio</h3>
                    <p className="text-secondary-700 dark:text-secondary-300">{profileData.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-secondary-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-secondary-600 dark:text-secondary-400">
                <Heart className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                <p>No recent matches to show</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white">Subscription</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Current plan: {currentPlan.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleUpgrade('SILVER')}>Upgrade to Silver</Button>
                  <Button variant="outline" onClick={() => handleUpgrade('GOLD')}>Upgrade to Gold</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white">Privacy</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Manage your privacy settings
                  </p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 