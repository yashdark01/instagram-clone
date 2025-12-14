'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutAsync } from '@/store/thunks/authThunks';
import { selectUser, selectAuthLoading } from '@/store/selectors/authSelectors';
import { openSearchModal } from '@/store/slices/uiSlice';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MessageSquare, 
  PlusSquare, 
  Compass, 
  Heart, 
  Search,
  MoreHorizontal,
  LogOut,
  Settings,
  Instagram
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import SearchModal from '@/components/SearchModal';

export default function TopNavbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    router.push('/login');
  };

  // Get user ID - handle both id and _id for compatibility
  const userId = user?.id || (user as any)?._id;

  return (
    <nav className="sticky top-0 z-50 h-[54px] border-b border-[#dbdbdb] bg-white">
      <div className="mx-auto flex h-full w-full max-w-full items-center justify-between px-5">
        {/* Left Section - Logo */}
        <Link href="/home" className="flex items-center">
          <Instagram className="h-8 w-8 text-[#262626]" />
        </Link>

        {/* Mobile View - Only Chat Button */}
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#262626] hover:text-[#262626]">
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop View - All Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#262626] hover:text-[#262626]">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#262626] hover:text-[#262626]">
            <MessageSquare className="h-6 w-6" />
          </Button>
          <Link href="/create-post">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#262626] hover:text-[#262626]">
              <PlusSquare className="h-6 w-6" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#262626] hover:text-[#262626]">
            <Compass className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#262626] hover:text-[#262626]">
            <Heart className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#262626] hover:text-[#262626]"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-6 w-6" />
          </Button>
          {user?.id && !loading && (
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowMenu(!showMenu)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-[#0095f6] text-white text-xs">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
              {showMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-[#dbdbdb] rounded-md shadow-lg py-1">
                  <Link href={`/profile/${user.id}`}>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#fafafa] flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#fafafa] text-[#ed4956] flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </nav>
  );
}

