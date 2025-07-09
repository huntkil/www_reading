'use client'

import { CommunityFeed } from '@/components/Community/CommunityFeed'

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">개인 기록</h1>
      <CommunityFeed />
    </div>
  )
} 