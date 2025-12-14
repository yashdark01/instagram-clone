'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectAuthLoading } from '@/store/selectors/authSelectors';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function LeftSidebar() {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  
  // Get user ID - handle both id and _id for compatibility
  const userId = user?.id || (user as any)?._id;

  // return (
  //   <aside className="hidden xl:block w-[250px]">
  //     <div className="sticky top-[74px] px-4">
  //       <nav className="space-y-1">
  //         <Link href="/home">
  //           <Button
  //             variant="ghost"
  //             className="w-full justify-start gap-3 h-12 text-[#262626] hover:bg-[#fafafa]"
  //           >
  //             <Home className="h-6 w-6" />
  //             <span className="ig-text-username">Home</span>
  //           </Button>
  //         </Link>
  //         <Button
  //           variant="ghost"
  //           className="w-full justify-start gap-3 h-12 text-[#262626] hover:bg-[#fafafa]"
  //         >
  //           <Search className="h-6 w-6" />
  //           <span className="ig-text-username">Search</span>
  //         </Button>
  //         <Link href="/create-post">
  //           <Button
  //             variant="ghost"
  //             className="w-full justify-start gap-3 h-12 text-[#262626] hover:bg-[#fafafa]"
  //           >
  //             <PlusSquare className="h-6 w-6" />
  //             <span className="ig-text-username">Create</span>
  //           </Button>
  //         </Link>
  //         <Button
  //           variant="ghost"
  //           className="w-full justify-start gap-3 h-12 text-[#262626] hover:bg-[#fafafa]"
  //         >
  //           <Heart className="h-6 w-6" />
  //           <span className="ig-text-username">Activity</span>
  //         </Button>
  //         {!loading && userId && (
  //           <Link href={`/profile/${userId}`}>
  //             <Button
  //               variant="ghost"
  //               className="w-full justify-start gap-3 h-12 text-[#262626] hover:bg-[#fafafa]"
  //             >
  //               <Avatar className="h-6 w-6">
  //                 <AvatarFallback className="bg-[#0095f6] text-white text-xs">
  //                   {user?.username?.[0]?.toUpperCase() || 'U'}
  //                 </AvatarFallback>
  //               </Avatar>
  //               <span className="ig-text-username">Profile</span>
  //             </Button>
  //           </Link>
  //         )}
  //       </nav>
  //     </div>
  //   </aside>
  // );
  return null;
}

