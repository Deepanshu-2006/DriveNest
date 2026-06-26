"use client";

import React, { useState, useEffect } from 'react';
import { SendBirdProvider, ChannelList, Channel } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { MessageSquare } from 'lucide-react';

function SendbirdInbox({ userId, nickname, profileUrl, isDark }) {
  const [channelUrl, setChannelUrl] = useState('');
  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const url = params.get('channelUrl');
      if (url) {
        setChannelUrl(url);
      }
    }
  }, []);

  if (!appId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-3xl dark:border-white/10 bg-slate-50 dark:bg-black/20">
        <p className="text-red-500 font-bold mb-2">Sendbird App ID is not configured.</p>
        <p className="text-sm text-slate-500 max-w-md">
          Please add `NEXT_PUBLIC_SENDBIRD_APP_ID` (and the private `SENDBIRD_API_TOKEN` key) to your `.env.local` file, then restart the development server.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full select-none">
      <SendBirdProvider
        appId={appId}
        userId={userId}
        nickname={nickname}
        profileUrl={profileUrl}
        theme={isDark ? 'dark' : 'light'}
      >
        <div className="flex h-150 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-[#0f0f0f]">
          <div className="w-1/3 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f]">
            <ChannelList
              onChannelSelect={(channel) => {
                if (channel && channel.url) {
                  setChannelUrl(channel.url);
                  // Update URL parameter without page reload
                  const newUrl = `${window.location.pathname}?tab=inbox&channelUrl=${encodeURIComponent(channel.url)}`;
                  window.history.replaceState(null, '', newUrl);
                } else {
                  setChannelUrl('');
                }
              }}
            />
          </div>
          <div className="w-2/3 bg-slate-50 dark:bg-black/20 h-full">
            {channelUrl ? (
              <Channel channelUrl={channelUrl} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-white/40">
                <MessageSquare className="w-16 h-16 mb-4 stroke-1 animate-pulse text-teal-500" />
                <h4 className="text-lg font-bold">Inbox</h4>
                <p className="text-sm mt-1 text-center max-w-xs px-4">
                  Select a conversation from the list to start chatting with the buyer or seller.
                </p>
              </div>
            )}
          </div>
        </div>
      </SendBirdProvider>
    </div>
  );
}

export default SendbirdInbox;
