'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectAuthLoading } from '@/store/selectors/authSelectors';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SearchModal from '@/components/SearchModal';

export default function BottomNavbar() {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const [showSearch, setShowSearch] = useState(false);
  
  // Get user ID - handle both id and _id for compatibility
  const userId = user?.id || (user as any)?._id;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#dbdbdb] bg-white md:hidden">
        <div className="flex h-14 items-center justify-around">
          <Link href="/home" className="flex items-center justify-center">
            <Home className="h-6 w-6 text-[#262626]" />
          </Link>
          <button 
            className="flex items-center justify-center"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-6 w-6 text-[#262626]" />
          </button>
          <Link href="/create-post" className="flex items-center justify-center">
            <PlusSquare className="h-6 w-6 text-[#262626]" />
          </Link>
          <button className="flex items-center justify-center">
            <Heart className="h-6 w-6 text-[#262626]" />
          </button>
          {!loading && userId && (
            <Link href={`/profile/${userId}`} className="flex items-center justify-center">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-[#0095f6] text-white text-xs">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </nav>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}

