@@ .. @@
 import React, { useState } from 'react';
 import { X, User, Lock, Mail, BookOpen, Eye, EyeOff } from 'lucide-react';
+import { signUp, signIn } from '../lib/supabase';

 interface AuthModalProps {
@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!validateForm()) return;

     try {
       if (isLogin) {
-        // Login logic
-        const users = JSON.parse(localStorage.getItem(`${role}s`) || '[]');
-        const user = users.find((u: any) => u.username === formData.username && u.password === formData.password);
-        
-        if (user) {
-          localStorage.setItem('currentUser', JSON.stringify({ ...user, role }));
-          onLogin(user);
+        // Supabase login
+        const { user } = await signIn(formData.username, formData.password);
+        if (user) {
+          // Get user profile from users table
+          const { data: profile } = await supabase
+            .from('users')
+            .select('*')
+            .eq('id', user.id)
+            .single();
+          
+          if (profile) {
+            localStorage.setItem('currentUser', JSON.stringify(profile));
+            onLogin(profile);
+          }
           onClose();
         } else {
-          setErrors({ general: 'Invalid username or password' });
+          setErrors({ general: 'Login failed' });
         }
       } else {
-        // Registration logic
-        const users = JSON.parse(localStorage.getItem(`${role}s`) || '[]');
-        const existingUser = users.find((u: any) => u.username === formData.username);
-        
-        if (existingUser) {
-          setErrors({ username: 'Username already exists' });
-          return;
-        }
-
-        const newUser = {
-          id: Date.now().toString(),
+        // Supabase registration
+        const userData = {
           name: formData.name,
           username: formData.username,
           email: formData.email,
           password: formData.password,
-          ...(role === 'student' ? { grade: formData.grade } : { subject: formData.subject }),
-          createdAt: new Date().toISOString(),
-          avatar: 'default',
-          progress: role === 'student' ? {
-            totalXP: 0,
-            currentLevel: 1,
-            videosWatched: 0,
-            gamesPlayed: 0,
-            timeSpent: 0,
-            currentStreak: 0,
-            subjects: {
-              science: { progress: 0, xp: 0 },
-              mathematics: { progress: 0, xp: 0 },
-              technology: { progress: 0, xp: 0 },
-              engineering: { progress: 0, xp: 0 }
-            }
-          } : null
+          role,
+          grade: role === 'student' ? formData.grade : undefined,
+          subject: role === 'teacher' ? formData.subject : undefined
         };

-        users.push(newUser);
-        localStorage.setItem(`${role}s`, JSON.stringify(users));
-        localStorage.setItem('currentUser', JSON.stringify({ ...newUser, role }));
+        const { user } = await signUp(userData);
+        if (user) {
+          // Get the created user profile
+          const { data: profile } = await supabase
+            .from('users')
+            .select('*')
+            .eq('id', user.id)
+            .single();
         
-        onLogin(newUser);
-        onClose();
+          if (profile) {
+            localStorage.setItem('currentUser', JSON.stringify(profile));
+            onLogin(profile);
+            onClose();
+          }
+        }
       }
     } catch (error) {
-      setErrors({ general: 'An error occurred. Please try again.' });
+      console.error('Auth error:', error);
+      if (error.message.includes('User not found')) {
+        setErrors({ general: 'Invalid username or password' });
+      } else if (error.message.includes('duplicate')) {
+        setErrors({ username: 'Username already exists' });
+      } else {
+        setErrors({ general: 'An error occurred. Please try again.' });
+      }
     }
   };