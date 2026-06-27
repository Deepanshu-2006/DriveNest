"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getSendbirdClient } from '@/lib/sendbird-client';
import { getSendbirdUserId } from '@/lib/utils';
import { UserEventHandler } from '@sendbird/chat';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useCompare } from '../_context/CompareContext';

function HeaderContent() {
    const { isSignedIn, user, isLoaded } = useUser();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { compareCars } = useCompare();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
            setUnreadCount(0);
            return;
        }

        let isMounted = true;
        const handlerId = 'header-unread-count-handler';
        const userEmail = user.primaryEmailAddress.emailAddress;
        const sendbirdUserId = getSendbirdUserId(userEmail);
        const sb = getSendbirdClient();

        if (!sb) return;

        const initUnreadCount = async () => {
            try {
                if (sb.currentUser?.userId !== sendbirdUserId) {
                    await sb.connect(sendbirdUserId);
                }

                if (!isMounted) return;

                const count = await sb.groupChannel.getTotalUnreadMessageCount();
                if (isMounted) setUnreadCount(count);

                const userEventHandler = new UserEventHandler();
                userEventHandler.onTotalUnreadMessageCountChanged = (totalCount) => {
                    if (isMounted) setUnreadCount(totalCount);
                };
                sb.addUserEventHandler(handlerId, userEventHandler);

                const channelHandler = new GroupChannelHandler();
                channelHandler.onMessageReceived = async (channel, message) => {
                    try {
                        const updatedCount = await sb.groupChannel.getTotalUnreadMessageCount();
                        if (isMounted) setUnreadCount(updatedCount);
                    } catch (err) {
                        console.error("Error updating unread count on message received:", err);
                    }
                };
                sb.groupChannel.addGroupChannelHandler(handlerId, channelHandler);

            } catch (error) {
                console.error("Error initializing Sendbird unread count:", error);
            }
        };

        initUnreadCount();

        return () => {
            isMounted = false;
            try {
                const sbClient = getSendbirdClient();
                if (sbClient) {
                    sbClient.removeUserEventHandler(handlerId);
                    sbClient.groupChannel.removeGroupChannelHandler(handlerId);
                }
            } catch (err) {
                console.error("Error removing Sendbird handlers:", err);
            }
        };
    }, [isLoaded, isSignedIn, user]);

    const isDarkHome = (pathname === '/' || pathname === '/add-listing' || pathname === '/profile' || pathname.startsWith('/listing-details') || pathname.startsWith('/search') || pathname === '/compare') && isSignedIn;

    // Active link states
    const isInboxActive = pathname === '/profile' && searchParams.get('tab') === 'inbox';
    const isProfileActive = pathname === '/profile' && searchParams.get('tab') !== 'inbox';

    return (
        <header className={isDarkHome ? "bg-[#050505] border-b border-white/10 sticky top-0 z-50 shadow-xs text-white transition-all duration-300" : "bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs transition-all duration-300"}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <img
                            src="/logo.png"
                            alt="Drive Nest Logo"
                            className="h-14 w-auto object-contain rounded-e-full"
                        />
                        <span className="bg-linear-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent text-2xl font-extrabold tracking-tight">
                            DriveNest
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav aria-label="Global" className={`hidden md:flex items-center gap-8 font-semibold text-[16px] ${isDarkHome ? 'text-white/85' : 'text-gray-600'}`}>
                        <ul className="flex items-center gap-8">
                            <li>
                                <Link className={`transition ${pathname === '/'
                                        ? (isDarkHome ? 'text-teal-400 font-extrabold underline decoration-2 underline-offset-4' : 'text-teal-600 font-extrabold underline decoration-2 underline-offset-4')
                                        : (isDarkHome ? 'text-white/80 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600')
                                    }`} href="/"> Home </Link>
                            </li>
                            <li>
                                <Link className={`transition ${pathname === '/search'
                                        ? (isDarkHome ? 'text-teal-400 font-extrabold underline decoration-2 underline-offset-4' : 'text-teal-600 font-extrabold underline decoration-2 underline-offset-4')
                                        : (isDarkHome ? 'text-white/80 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600')
                                    }`} href="/search"> Search </Link>
                            </li>

                            <li>
                                <Link className={`transition flex items-center gap-1.5 ${pathname === '/compare'
                                        ? (isDarkHome ? 'text-teal-400 font-extrabold underline decoration-2 underline-offset-4' : 'text-teal-600 font-extrabold underline decoration-2 underline-offset-4')
                                        : (isDarkHome ? 'text-white/80 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600')
                                    }`} href="/compare">
                                    <span>Compare</span>
                                    {compareCars.length > 0 && (
                                        <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-black text-white">
                                            {compareCars.length}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            {isSignedIn && (
                                <li>
                                    <Link className={`transition flex items-center gap-1.5 ${isInboxActive
                                            ? (isDarkHome ? 'text-teal-400 font-extrabold underline decoration-2 underline-offset-4' : 'text-teal-600 font-extrabold underline decoration-2 underline-offset-4')
                                            : (isDarkHome ? 'text-white/80 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600')
                                        }`} href="/profile?tab=inbox">
                                        <span>Inbox</span>
                                        {unreadCount > 0 && (
                                            <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white animate-pulse">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            )}
                            {isSignedIn && (
                                <li>
                                    <Link className={`transition ${isProfileActive
                                            ? (isDarkHome ? 'text-teal-400 font-extrabold underline decoration-2 underline-offset-4' : 'text-teal-600 font-extrabold underline decoration-2 underline-offset-4')
                                            : (isDarkHome ? 'text-white/80 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600')
                                        }`} href="/profile"> Profile </Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    {/* Right action buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isSignedIn ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    className="block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700  hover:font-extrabold hover:scale-105 transition-all shadow-sm"
                                    href={pathname === '/add-listing' ? '/profile' : '/add-listing'}
                                >
                                    {pathname === '/add-listing' ? 'My Profile' : 'Submit Listing'}
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        ) : (
                            <Link
                                className="block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                href="/sign-in"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        {isSignedIn && <UserButton afterSignOutUrl="/" />}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 transition focus:outline-none ${isDarkHome ? 'text-white/80 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'}`}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <div className={`md:hidden border-t px-4 py-4 space-y-3 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkHome ? 'border-white/10 bg-black/95' : 'border-gray-100 bg-white'}`}>
                    <nav className="flex flex-col gap-3 font-medium text-[16px]">
                        <Link onClick={() => setIsOpen(false)} className={`px-3 py-2 rounded-md transition ${pathname === '/' ? (isDarkHome ? 'text-teal-400 bg-white/5 font-bold' : 'text-teal-600 bg-gray-50 font-bold') : (isDarkHome ? 'text-white/80 hover:text-teal-400 hover:bg-white/5' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50')}`} href="/"> Home </Link>
                        <Link onClick={() => setIsOpen(false)} className={`px-3 py-2 rounded-md transition ${pathname === '/search' ? (isDarkHome ? 'text-teal-400 bg-white/5 font-bold' : 'text-teal-600 bg-gray-50 font-bold') : (isDarkHome ? 'text-white/80 hover:text-teal-400 hover:bg-white/5' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50')}`} href="/search"> Search </Link>

                        <Link onClick={() => setIsOpen(false)} className={`px-3 py-2 rounded-md transition flex items-center justify-between ${pathname === '/compare' ? (isDarkHome ? 'text-teal-400 bg-white/5 font-bold' : 'text-teal-600 bg-gray-50 font-bold') : (isDarkHome ? 'text-white/80 hover:text-teal-400 hover:bg-white/5' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50')}`} href="/compare">
                            <span>Compare</span>
                            {compareCars.length > 0 && (
                                <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-black text-white">
                                    {compareCars.length}
                                </span>
                            )}
                        </Link>
                        {isSignedIn && (
                            <>
                                <Link onClick={() => setIsOpen(false)} className={`px-3 py-2 rounded-md transition flex items-center justify-between ${isInboxActive ? (isDarkHome ? 'text-teal-400 bg-white/5 font-bold' : 'text-teal-600 bg-gray-50 font-bold') : (isDarkHome ? 'text-white/80 hover:text-teal-400 hover:bg-white/5' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50')}`} href="/profile?tab=inbox">
                                    <span>Inbox</span>
                                    {unreadCount > 0 && (
                                        <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Link onClick={() => setIsOpen(false)} className={`px-3 py-2 rounded-md transition ${isProfileActive ? (isDarkHome ? 'text-teal-400 bg-white/5 font-bold' : 'text-teal-600 bg-gray-50 font-bold') : (isDarkHome ? 'text-white/80 hover:text-teal-400 hover:bg-white/5' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50')}`} href="/profile"> Profile </Link>
                            </>
                        )}
                    </nav>
                    {!isSignedIn && (
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                onClick={() => setIsOpen(false)}
                                className="block text-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                href="/sign-in"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                    {isSignedIn && (
                        <div className={`pt-2 border-t ${isDarkHome ? 'border-white/10' : 'border-gray-100'}`}>
                            <Link
                                onClick={() => setIsOpen(false)}
                                className="block text-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                href={pathname === '/add-listing' ? '/profile' : '/add-listing'}
                            >
                                {pathname === '/add-listing' ? 'My Profile' : 'Submit Listing'}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default function Header() {
    return (
        <Suspense fallback={
            <header className="w-full bg-[#050505] border-b border-white/10 h-20 sticky top-0 z-50" />
        }>
            <HeaderContent />
        </Suspense>
    );
}
