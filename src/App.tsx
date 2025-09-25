@@ .. @@
-import React from 'react';
+import React, { useState, useEffect } from 'react';
+import LandingPage from './components/LandingPage';
+import AuthModal from './components/AuthModal';
+import StudentDashboard from './components/StudentDashboard';
+import TeacherDashboard from './components/TeacherDashboard';
+import { supabase, getCurrentUser } from './lib/supabase';

 function App() {
+  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'teacher'>('landing');
+  const [showAuthModal, setShowAuthModal] = useState(false);
+  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
+  const [currentUser, setCurrentUser] = useState<any>(null);
+  const [loading, setLoading] = useState(true);
+
+  useEffect(() => {
+    // Check for existing session
+    const checkSession = async () => {
+      try {
+        const { data: { session } } = await supabase.auth.getSession();
+        if (session) {
+          const user = await getCurrentUser();
+          if (user) {
+            setCurrentUser(user);
+            setCurrentView(user.role);
+          }
+        }
+      } catch (error) {
+        console.error('Error checking session:', error);
+        // Fallback to localStorage for offline mode
+        const localUser = localStorage.getItem('currentUser');
+        if (localUser) {
+          const user = JSON.parse(localUser);
+          setCurrentUser(user);
+          setCurrentView(user.role);
+        }
+      } finally {
+        setLoading(false);
+      }
+    };
+
+    checkSession();
+
+    // Listen for auth changes
+    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
+      if (event === 'SIGNED_IN' && session) {
+        const user = await getCurrentUser();
+        if (user) {
+          setCurrentUser(user);
+          setCurrentView(user.role);
+        }
+      } else if (event === 'SIGNED_OUT') {
+        setCurrentUser(null);
+        setCurrentView('landing');
+        localStorage.removeItem('currentUser');
+      }
+    });
+
+    return () => subscription.unsubscribe();
+  }, []);
+
+  const handleRoleSelect = (role: 'student' | 'teacher') => {
+    setSelectedRole(role);
+    setShowAuthModal(true);
+  };
+
+  const handleLogin = (userData: any) => {
+    setCurrentUser(userData);
+    setCurrentView(userData.role);
+    setShowAuthModal(false);
+  };
+
+  const handleLogout = async () => {
+    try {
+      await supabase.auth.signOut();
+    } catch (error) {
+      console.error('Error signing out:', error);
+    }
+    setCurrentUser(null);
+    setCurrentView('landing');
+    localStorage.removeItem('currentUser');
+  };
+
+  const handleHome = () => {
+    setCurrentView('landing');
+  };
+
+  if (loading) {
+    return (
+      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 flex items-center justify-center">
+        <div className="text-white text-center">
+          <div className="text-6xl mb-4 animate-pulse">🚀</div>
+          <h2 className="text-2xl font-bold mb-2">AmaVidya</h2>
+          <p className="text-white/80">Loading your learning experience...</p>
+        </div>
+      </div>
+    );
+  }
+
   return (
-    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
-      <p>Start prompting (or editing) to see magic happen :)</p>
+    <div className="min-h-screen">
+      {currentView === 'landing' && (
+        <LandingPage onRoleSelect={handleRoleSelect} />
+      )}
+      
+      {currentView === 'student' && currentUser && (
+        <StudentDashboard 
+          user={currentUser} 
+          onLogout={handleLogout}
+          onHome={handleHome}
+        />
+      )}
+      
+      {currentView === 'teacher' && currentUser && (
+        <TeacherDashboard 
+          user={currentUser} 
+          onLogout={handleLogout}
+          onHome={handleHome}
+        />
+      )}
+
+      {showAuthModal && (
+        <AuthModal
+          isOpen={showAuthModal}
+          onClose={() => setShowAuthModal(false)}
+          role={selectedRole}
+          onLogin={handleLogin}
+        />
+      )}
     </div>
   );
 }