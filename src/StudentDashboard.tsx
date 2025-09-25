@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Home, Play, TowerControl as GameController2, TrendingUp, Trophy, Star, Clock, Target, Settings, LogOut, User } from 'lucide-react';
 import AvatarCustomization from './AvatarCustomization';
+import VideoPlayer from './VideoPlayer';
+import GamePlayer from './GamePlayer';
+import NotificationToast from './NotificationToast';
+import { videos, games } from '../data/content';
+import { supabase, getCurrentUser, getStudentProgress, updateStudentProgress, recordVideoProgress, recordGameProgress } from '../lib/supabase';

 interface StudentDashboardProps {
@@ .. @@
   const [showAvatarModal, setShowAvatarModal] = useState(false);
   const [userData, setUserData] = useState(user);
+  const [selectedVideo, setSelectedVideo] = useState<any>(null);
+  const [selectedGame, setSelectedGame] = useState<any>(null);
+  const [notification, setNotification] = useState<{
+    type: 'success' | 'error' | 'xp' | 'achievement';
+    title: string;
+    message: string;
+    isVisible: boolean;
+  }>({ type: 'success', title: '', message: '', isVisible: false });
   const [progress, setProgress] = useState(user.progress || {
@@ .. @@
   });

   useEffect(() => {
-    // Load user data from localStorage
-    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
-    if (currentUser.id === user.id) {
-      setUserData(currentUser);
-      setProgress(currentUser.progress || progress);
+    // Load user data from Supabase
+    const loadUserData = async () => {
+      try {
+        const currentUser = await getCurrentUser();
+        if (currentUser) {
+          setUserData(currentUser);
+          
+          if (currentUser.role === 'student') {
+            const studentProgress = await getStudentProgress(currentUser.id);
+            if (studentProgress) {
+              setProgress(studentProgress);
+            }
+          }
+        }
+      } catch (error) {
+        console.error('Error loading user data:', error);
+        // Fallback to localStorage for offline mode
+        const localUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
+        if (localUser.id === user.id) {
+          setUserData(localUser);
+          setProgress(localUser.progress || progress);
+        }
+      }
+    };
+
+    loadUserData();
   }, []);

-  const updateProgress = (newProgress: any) => {
+  const updateProgress = async (newProgress: any) => {
     const updatedProgress = { ...progress, ...newProgress };
     setProgress(updatedProgress);
     
@@ -49,6 +82,18 @@
     const updatedUser = { ...userData, progress: updatedProgress };
     setUserData(updatedUser);
     
+    // Update Supabase
+    try {
+      await updateStudentProgress(userData.id, {
+        total_xp: updatedProgress.totalXP,
+        current_level: Math.floor(updatedProgress.totalXP / 100) + 1,
+        videos_watched: updatedProgress.videosWatched,
+        games_played: updatedProgress.gamesPlayed,
+        subjects: updatedProgress.subjects
+      });
+    } catch (error) {
+      console.error('Error updating progress in Supabase:', error);
+    }
+    
     // Update localStorage (for offline support)
     localStorage.setItem('currentUser', JSON.stringify(updatedUser));
@@ .. @@
   };

+  const showNotification = (type: 'success' | 'error' | 'xp' | 'achievement', title: string, message: string) => {
+    setNotification({ type, title, message, isVisible: true });
+  };
+
+  const hideNotification = () => {
+    setNotification(prev => ({ ...prev, isVisible: false }));
+  };
+
   const handleAvatarSave = (avatarId: string) => {
@@ .. @@
   };

-  const playVideo = (videoId: string, subject: string) => {
-    const newProgress = {
-      videosWatched: progress.videosWatched + 1,
-      totalXP: progress.totalXP + 10,
-      subjects: {
-        ...progress.subjects,
-        [subject]: {
-          progress: Math.min(100, progress.subjects[subject].progress + 5),
-          xp: progress.subjects[subject].xp + 10
-        }
-      }
-    };
-    updateProgress(newProgress);
+  const playVideo = (videoId: string) => {
+    const video = videos.find(v => v.id === videoId);
+    if (video) {
+      setSelectedVideo(video);
+    }
   };

-  const playGame = (gameId: string, subject: string) => {
-    const newProgress = {
-      gamesPlayed: progress.gamesPlayed + 1,
-      totalXP: progress.totalXP + 20,
-      subjects: {
-        ...progress.subjects,
-        [subject]: {
-          progress: Math.min(100, progress.subjects[subject].progress + 10),
-          xp: progress.subjects[subject].xp + 20
-        }
-      }
-    };
-    updateProgress(newProgress);
+  const playGame = (gameId: string) => {
+    const game = games.find(g => g.id === gameId);
+    if (game) {
+      setSelectedGame(game);
+    }
+  };
+
+  const handleVideoComplete = async (videoId: string, subject: string, watchTime: number) => {
+    try {
+      // Record video progress in Supabase
+      await recordVideoProgress(userData.id, videoId, watchTime, true);
+      
+      const newProgress = {
+        videosWatched: progress.videosWatched + 1,
+        totalXP: progress.totalXP + 10,
+        subjects: {
+          ...progress.subjects,
+          [subject]: {
+            progress: Math.min(100, progress.subjects[subject].progress + 5),
+            xp: progress.subjects[subject].xp + 10
+          }
+        }
+      };
+      
+      await updateProgress(newProgress);
+      showNotification('xp', 'Video Completed!', 'You earned 10 XP for watching the video!');
+      
+      // Check for achievements
+      if (newProgress.videosWatched === 1) {
+        showNotification('achievement', 'First Video!', 'You watched your first STEM video!');
+      }
+    } catch (error) {
+      console.error('Error recording video progress:', error);
+      showNotification('error', 'Error', 'Failed to save progress. Please try again.');
+    }
+  };
+
+  const handleGameComplete = async (gameId: string, subject: string, score: number, timeSpent: number) => {
+    try {
+      // Record game progress in Supabase
+      await recordGameProgress(userData.id, gameId, score, timeSpent);
+      
+      const newProgress = {
+        gamesPlayed: progress.gamesPlayed + 1,
+        totalXP: progress.totalXP + 20,
+        subjects: {
+          ...progress.subjects,
+          [subject]: {
+            progress: Math.min(100, progress.subjects[subject].progress + 10),
+            xp: progress.subjects[subject].xp + 20
+          }
+        }
+      };
+      
+      await updateProgress(newProgress);
+      showNotification('xp', 'Game Completed!', `You earned 20 XP! Score: ${score}/${games.find(g => g.id === gameId)?.questions.length || 0}`);
+      
+      // Check for achievements
+      if (newProgress.gamesPlayed === 1) {
+        showNotification('achievement', 'First Game!', 'You completed your first learning game!');
+      }
+      
+      if (score === games.find(g => g.id === gameId)?.questions.length) {
+        showNotification('achievement', 'Perfect Score!', 'You got all questions correct!');
+      }
+    } catch (error) {
+      console.error('Error recording game progress:', error);
+      showNotification('error', 'Error', 'Failed to save progress. Please try again.');
+    }
   };

@@ .. @@
   const renderVideos = () => (
     <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
-        {videos.map((video) => (
+        {videos.map((video) => (
           <div key={video.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
@@ .. @@
             </div>
             <button
-              onClick={() => playVideo(video.id, video.subject)}
+              onClick={() => playVideo(video.id)}
               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
             >
-              Watch Video (+10 XP)
+              Watch Video
             </button>
@@ .. @@
   const renderGames = () => (
     <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
-        {games.map((game) => (
+        {games.map((game) => (
           <div key={game.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
@@ .. @@
             <button
-              onClick={() => playGame(game.id, game.subject)}
+              onClick={() => playGame(game.id)}
               className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
             >
-              Play Game (+20 XP)
+              Play Game
             </button>
@@ .. @@
         onSave={handleAvatarSave}
       />
+
+      {/* Video Player Modal */}
+      {selectedVideo && (
+        <VideoPlayer
+          video={selectedVideo}
+          onComplete={handleVideoComplete}
+          onClose={() => setSelectedVideo(null)}
+        />
+      )}
+
+      {/* Game Player Modal */}
+      {selectedGame && (
+        <GamePlayer
+          game={selectedGame}
+          onComplete={handleGameComplete}
+          onClose={() => setSelectedGame(null)}
+        />
+      )}
+
+      {/* Notification Toast */}
+      <NotificationToast
+        type={notification.type}
+        title={notification.title}
+        message={notification.message}
+        isVisible={notification.isVisible}
+        onClose={hideNotification}
+      />
     </div>