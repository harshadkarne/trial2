// Global state
let currentUser = null;
let currentRole = null;
let isLogin = true;
let selectedAvatar = 'boy1';
let currentStudentSection = 'dashboard';
let currentTeacherSection = 'overview';

// Translations
const translations = {
  en: {
    welcome: "Welcome to Interactive STEM Learning",
    tagline: "Explore, Learn, and Discover the Wonders of Science, Technology, Engineering, and Mathematics",
    student: "Student",
    teacher: "Teacher",
    studentDesc: "Start your learning journey with fun games and videos",
    teacherDesc: "Manage content and track student progress"
  },
  od: {
    welcome: "ଇଣ୍ଟରାକ୍ଟିଭ୍ STEM ଶିକ୍ଷାକୁ ସ୍ୱାଗତ",
    tagline: "ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତିବିଦ୍ୟା, ଇଞ୍ଜିନିୟରିଂ ଏବଂ ଗଣିତର ଆଶ୍ଚର୍ଯ୍ୟ ଅନ୍ୱେଷଣ, ଶିକ୍ଷା ଏବଂ ଆବିଷ୍କାର କରନ୍ତୁ",
    student: "ଛାତ୍ର",
    teacher: "ଶିକ୍ଷକ",
    studentDesc: "ମଜାଦାର ଖେଳ ଏବଂ ଭିଡିଓ ସହିତ ଆପଣଙ୍କର ଶିକ୍ଷା ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
    teacherDesc: "ବିଷୟବସ୍ତୁ ପରିଚାଳନା କରନ୍ତୁ ଏବଂ ଛାତ୍ରଙ୍କ ଅଗ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ"
  }
};

// Avatar options
const avatarOptions = [
  { id: 'boy1', emoji: '👦', name: 'Boy 1' },
  { id: 'girl1', emoji: '👧', name: 'Girl 1' },
  { id: 'boy2', emoji: '🧒', name: 'Boy 2' },
  { id: 'girl2', emoji: '👩', name: 'Girl 2' },
  { id: 'man1', emoji: '👨', name: 'Man 1' },
  { id: 'woman1', emoji: '👩‍🦱', name: 'Woman 1' },
  { id: 'student1', emoji: '👨‍🎓', name: 'Graduate 1' },
  { id: 'student2', emoji: '👩‍🎓', name: 'Graduate 2' },
  { id: 'scientist1', emoji: '👨‍🔬', name: 'Scientist 1' },
  { id: 'scientist2', emoji: '👩‍🔬', name: 'Scientist 2' },
  { id: 'teacher1', emoji: '👨‍🏫', name: 'Teacher 1' },
  { id: 'teacher2', emoji: '👩‍🏫', name: 'Teacher 2' },
];

// Sample data
const videos = [
  { id: 'photosynthesis', title: 'How Plants Make Food', subject: 'science', duration: '5:30', difficulty: 'Easy', icon: '🌱' },
  { id: 'geometry', title: 'Fun with Shapes', subject: 'mathematics', duration: '7:15', difficulty: 'Medium', icon: '📐' },
  { id: 'circuits', title: 'Electric Circuits', subject: 'technology', duration: '6:45', difficulty: 'Medium', icon: '⚡' },
  { id: 'bridges', title: 'Building Bridges', subject: 'engineering', duration: '8:20', difficulty: 'Hard', icon: '🌉' },
];

const games = [
  { id: 'math-quiz', title: 'Math Quiz Challenge', subject: 'mathematics', difficulty: 'Easy', icon: '🧮' },
  { id: 'science-lab', title: 'Virtual Science Lab', subject: 'science', difficulty: 'Medium', icon: '🧪' },
  { id: 'pattern-game', title: 'Pattern Master', subject: 'mathematics', difficulty: 'Hard', icon: '🎨' },
  { id: 'coding-game', title: 'Code Builder', subject: 'technology', difficulty: 'Medium', icon: '💻' },
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    currentRole = currentUser.role;
    showDashboard();
  }
  
  // Initialize language
  updateLanguage();
  
  // Initialize avatar grid
  initializeAvatarGrid();
  
  // Set up form submission
  document.getElementById('authForm').addEventListener('submit', handleAuth);
  
  // Set up language change
  document.getElementById('languageSelect').addEventListener('change', updateLanguage);
});

// Language functions
function updateLanguage() {
  const language = document.getElementById('languageSelect').value;
  const t = translations[language];
  
  document.getElementById('welcomeTitle').textContent = t.welcome;
  document.getElementById('welcomeTagline').textContent = t.tagline;
  document.getElementById('studentTitle').textContent = t.student;
  document.getElementById('teacherTitle').textContent = t.teacher;
  document.getElementById('studentDesc').textContent = t.studentDesc;
  document.getElementById('teacherDesc').textContent = t.teacherDesc;
}

// Role selection
function selectRole(role) {
  currentRole = role;
  showAuthModal();
}

// Modal functions
function showAuthModal() {
  document.getElementById('authModal').classList.add('active');
  updateAuthModal();
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
  clearForm();
}

function updateAuthModal() {
  const title = document.getElementById('authTitle');
  const submitText = document.getElementById('authSubmitText');
  const toggleText = document.getElementById('authToggleText');
  
  title.textContent = `${isLogin ? 'Login' : 'Register'} as ${currentRole}`;
  submitText.textContent = isLogin ? 'Login' : 'Register';
  toggleText.textContent = isLogin ? "Don't have an account? Register" : "Already have an account? Login";
  
  // Show/hide fields based on mode and role
  document.getElementById('nameField').style.display = isLogin ? 'none' : 'block';
  document.getElementById('emailField').style.display = (!isLogin && currentRole === 'teacher') ? 'block' : 'none';
  document.getElementById('gradeField').style.display = (!isLogin && currentRole === 'student') ? 'block' : 'none';
  document.getElementById('subjectField').style.display = (!isLogin && currentRole === 'teacher') ? 'block' : 'none';
}

function toggleAuthMode() {
  isLogin = !isLogin;
  updateAuthModal();
  clearErrors();
}

function togglePassword() {
  const passwordField = document.getElementById('password');
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

// Form handling
function handleAuth(e) {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  const formData = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    grade: document.getElementById('grade').value,
    subject: document.getElementById('subject').value
  };
  
  if (isLogin) {
    login(formData);
  } else {
    register(formData);
  }
}

function validateForm() {
  clearErrors();
  let isValid = true;
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!username) {
    showError('usernameError', 'Username is required');
    isValid = false;
  }
  
  if (!password) {
    showError('passwordError', 'Password is required');
    isValid = false;
  } else if (password.length < 6) {
    showError('passwordError', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (!isLogin) {
    const name = document.getElementById('name').value.trim();
    if (!name) {
      showError('nameError', 'Name is required');
      isValid = false;
    }
    
    if (currentRole === 'teacher') {
      const email = document.getElementById('email').value.trim();
      if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
      }
    }
  }
  
  return isValid;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function clearErrors() {
  const errorElements = ['authError', 'nameError', 'usernameError', 'emailError', 'passwordError'];
  errorElements.forEach(id => {
    const element = document.getElementById(id);
    element.style.display = 'none';
    element.textContent = '';
  });
}

function clearForm() {
  document.getElementById('authForm').reset();
  clearErrors();
}

// Authentication functions
function login(formData) {
  const users = JSON.parse(localStorage.getItem(`${currentRole}s`) || '[]');
  const user = users.find(u => u.username === formData.username && u.password === formData.password);
  
  if (user) {
    currentUser = { ...user, role: currentRole };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeAuthModal();
    showDashboard();
  } else {
    showError('authError', 'Invalid username or password');
  }
}

function register(formData) {
  const users = JSON.parse(localStorage.getItem(`${currentRole}s`) || '[]');
  const existingUser = users.find(u => u.username === formData.username);
  
  if (existingUser) {
    showError('usernameError', 'Username already exists');
    return;
  }
  
  const newUser = {
    id: Date.now().toString(),
    name: formData.name,
    username: formData.username,
    email: formData.email,
    password: formData.password,
    avatar: 'boy1',
    createdAt: new Date().toISOString(),
    ...(currentRole === 'student' ? { 
      grade: formData.grade,
      progress: {
        totalXP: 0,
        currentLevel: 1,
        videosWatched: 0,
        gamesPlayed: 0,
        timeSpent: 0,
        currentStreak: 0,
        subjects: {
          science: { progress: 0, xp: 0 },
          mathematics: { progress: 0, xp: 0 },
          technology: { progress: 0, xp: 0 },
          engineering: { progress: 0, xp: 0 }
        }
      }
    } : { 
      subject: formData.subject 
    })
  };
  
  users.push(newUser);
  localStorage.setItem(`${currentRole}s`, JSON.stringify(users));
  
  currentUser = { ...newUser, role: currentRole };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  closeAuthModal();
  showDashboard();
}

// Dashboard functions
function showDashboard() {
  document.getElementById('landingPage').style.display = 'none';
  
  if (currentRole === 'student') {
    document.getElementById('studentDashboard').classList.add('active');
    updateStudentInfo();
    showStudentSection('dashboard');
  } else {
    document.getElementById('teacherDashboard').classList.add('active');
    updateTeacherInfo();
    showTeacherSection('overview');
  }
}

function updateStudentInfo() {
  document.getElementById('studentName').textContent = currentUser.name;
  document.getElementById('studentGrade').textContent = `Grade ${currentUser.grade}`;
  document.getElementById('studentXP').textContent = `${currentUser.progress.totalXP} XP`;
  document.getElementById('studentLevel').textContent = Math.floor(currentUser.progress.totalXP / 100) + 1;
  document.getElementById('studentAvatar').textContent = getAvatarEmoji(currentUser.avatar);
  document.getElementById('studentWelcome').textContent = `Welcome back, ${currentUser.name}! Ready to learn something new?`;
}

function updateTeacherInfo() {
  document.getElementById('teacherName').textContent = currentUser.name;
  document.getElementById('teacherSubject').textContent = `${currentUser.subject} Teacher`;
  document.getElementById('teacherWelcome').textContent = `Welcome back, ${currentUser.name}! Here's what's happening with your students.`;
}

function getAvatarEmoji(avatarId) {
  const avatar = avatarOptions.find(a => a.id === avatarId);
  return avatar ? avatar.emoji : '👤';
}

// Student dashboard sections
function showStudentSection(section) {
  currentStudentSection = section;
  
  // Update active nav button
  const navButtons = document.querySelectorAll('#studentDashboard nav button');
  navButtons.forEach(btn => {
    btn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 text-gray-600 hover:bg-gray-100';
  });
  
  const activeButton = document.querySelector(`#studentDashboard nav button[onclick="showStudentSection('${section}')"]`);
  if (activeButton) {
    activeButton.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 bg-indigo-100 text-indigo-700 font-medium';
  }
  
  // Update section title
  const titles = {
    dashboard: 'Dashboard',
    videos: 'STEM Videos',
    games: 'Learning Games',
    progress: 'Progress',
    achievements: 'Achievements'
  };
  
  document.getElementById('studentSectionTitle').textContent = titles[section];
  
  // Load section content
  const content = document.getElementById('studentContent');
  
  switch (section) {
    case 'dashboard':
      content.innerHTML = renderStudentDashboard();
      break;
    case 'videos':
      content.innerHTML = renderStudentVideos();
      break;
    case 'games':
      content.innerHTML = renderStudentGames();
      break;
    case 'progress':
      content.innerHTML = renderStudentProgress();
      break;
    case 'achievements':
      content.innerHTML = renderStudentAchievements();
      break;
  }
}

function renderStudentDashboard() {
  const progress = currentUser.progress;
  
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100">Total XP</p>
              <p class="text-3xl font-bold">${progress.totalXP}</p>
            </div>
            <div class="text-4xl">⭐</div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100">Level</p>
              <p class="text-3xl font-bold">${Math.floor(progress.totalXP / 100) + 1}</p>
            </div>
            <div class="text-4xl">🏆</div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100">Videos Watched</p>
              <p class="text-3xl font-bold">${progress.videosWatched}</p>
            </div>
            <div class="text-4xl">▶️</div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100">Games Played</p>
              <p class="text-3xl font-bold">${progress.gamesPlayed}</p>
            </div>
            <div class="text-4xl">🎮</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-xl font-bold mb-4">Subject Progress</h3>
          <div class="space-y-4">
            ${Object.entries(progress.subjects).map(([subject, data]) => `
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium capitalize">${subject}</span>
                  <span class="text-sm text-gray-600">${data.progress}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${data.progress}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span class="text-blue-600">▶️</span>
              <span class="text-sm">Watched "How Plants Make Food"</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span class="text-green-600">🎮</span>
              <span class="text-sm">Completed Math Quiz Challenge</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <span class="text-purple-600">🏆</span>
              <span class="text-sm">Earned "Video Watcher" achievement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStudentVideos() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${videos.map(video => `
        <div class="card hover-lift">
          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center text-6xl text-white rounded-lg mb-4">
            ${video.icon}
          </div>
          <h3 class="text-xl font-bold mb-2">${video.title}</h3>
          <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span class="flex items-center gap-1">
              🕒 ${video.duration}
            </span>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${getDifficultyClass(video.difficulty)}">
              ${video.difficulty}
            </span>
          </div>
          <button onclick="playVideo('${video.id}', '${video.subject}')" class="w-full btn btn-primary">
            Watch Video (+10 XP)
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderStudentGames() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${games.map(game => `
        <div class="card hover-lift text-center">
          <div class="text-6xl mb-4">${game.icon}</div>
          <h3 class="text-xl font-bold mb-2">${game.title}</h3>
          <div class="flex justify-center mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium ${getDifficultyClass(game.difficulty)}">
              ${game.difficulty}
            </span>
          </div>
          <button onclick="playGame('${game.id}', '${game.subject}')" class="w-full btn btn-primary">
            Play Game (+20 XP)
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderStudentProgress() {
  const progress = currentUser.progress;
  
  return `
    <div class="card">
      <h3 class="text-2xl font-bold mb-6">Overall Progress</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 class="text-lg font-semibold mb-4">Subject Breakdown</h4>
          <div class="space-y-4">
            ${Object.entries(progress.subjects).map(([subject, data]) => `
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium capitalize">${subject}</span>
                  <span class="text-sm font-bold">${data.progress}% (${data.xp} XP)</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${data.progress}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Statistics</h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Total XP Earned</span>
              <span class="font-bold text-indigo-600">${progress.totalXP}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Current Level</span>
              <span class="font-bold text-green-600">${Math.floor(progress.totalXP / 100) + 1}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Videos Watched</span>
              <span class="font-bold text-blue-600">${progress.videosWatched}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Games Played</span>
              <span class="font-bold text-purple-600">${progress.gamesPlayed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStudentAchievements() {
  const progress = currentUser.progress;
  
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card ${progress.videosWatched > 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : 'bg-gray-100'}">
        <div class="text-4xl mb-3">🎬</div>
        <h3 class="text-lg font-bold mb-2">Video Watcher</h3>
        <p class="text-sm opacity-90 mb-3">Watch your first STEM video</p>
        <span class="text-xs px-2 py-1 rounded-full ${progress.videosWatched > 0 ? 'bg-white bg-opacity-20' : 'bg-gray-300 text-gray-600'}">
          ${progress.videosWatched > 0 ? 'Earned!' : 'Locked'}
        </span>
      </div>

      <div class="card ${progress.gamesPlayed > 0 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gray-100'}">
        <div class="text-4xl mb-3">🎮</div>
        <h3 class="text-lg font-bold mb-2">Game Starter</h3>
        <p class="text-sm opacity-90 mb-3">Play your first learning game</p>
        <span class="text-xs px-2 py-1 rounded-full ${progress.gamesPlayed > 0 ? 'bg-white bg-opacity-20' : 'bg-gray-300 text-gray-600'}">
          ${progress.gamesPlayed > 0 ? 'Earned!' : 'Locked'}
        </span>
      </div>

      <div class="card ${progress.totalXP >= 100 ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' : 'bg-gray-100'}">
        <div class="text-4xl mb-3">⭐</div>
        <h3 class="text-lg font-bold mb-2">Rising Star</h3>
        <p class="text-sm opacity-90 mb-3">Earn 100 XP</p>
        <span class="text-xs px-2 py-1 rounded-full ${progress.totalXP >= 100 ? 'bg-white bg-opacity-20' : 'bg-gray-300 text-gray-600'}">
          ${progress.totalXP >= 100 ? 'Earned!' : `${progress.totalXP}/100 XP`}
        </span>
      </div>
    </div>
  `;
}

// Teacher dashboard sections
function showTeacherSection(section) {
  currentTeacherSection = section;
  
  // Update active nav button
  const navButtons = document.querySelectorAll('#teacherDashboard nav button');
  navButtons.forEach(btn => {
    btn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 text-gray-600 hover:bg-gray-100';
  });
  
  const activeButton = document.querySelector(`#teacherDashboard nav button[onclick="showTeacherSection('${section}')"]`);
  if (activeButton) {
    activeButton.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 bg-indigo-100 text-indigo-700 font-medium';
  }
  
  // Update section title
  const titles = {
    overview: 'Overview',
    students: 'Students',
    content: 'Content',
    analytics: 'Analytics'
  };
  
  document.getElementById('teacherSectionTitle').textContent = titles[section];
  
  // Load section content
  const content = document.getElementById('teacherContent');
  
  switch (section) {
    case 'overview':
      content.innerHTML = renderTeacherOverview();
      break;
    case 'students':
      content.innerHTML = renderTeacherStudents();
      break;
    case 'content':
      content.innerHTML = renderTeacherContent();
      break;
    case 'analytics':
      content.innerHTML = renderTeacherAnalytics();
      break;
  }
}

function renderTeacherOverview() {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const totalStudents = students.length;
  const totalVideosWatched = students.reduce((sum, student) => sum + (student.progress?.videosWatched || 0), 0);
  const totalGamesPlayed = students.reduce((sum, student) => sum + (student.progress?.gamesPlayed || 0), 0);
  const averageProgress = students.length > 0 
    ? Math.round(students.reduce((sum, student) => sum + calculateOverallProgress(student), 0) / students.length)
    : 0;
  
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100">Total Students</p>
              <p class="text-3xl font-bold">${totalStudents}</p>
            </div>
            <div class="text-4xl">👥</div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100">Average Progress</p>
              <p class="text-3xl font-bold">${averageProgress}%</p>
            </div>
            <div class="text-4xl">📈</div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100">Videos Watched</p>
              <p class="text-3xl font-bold">${totalVideosWatched}</p>
            </div>
            <div class="text-4xl">📚</div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100">Games Played</p>
              <p class="text-3xl font-bold">${totalGamesPlayed}</p>
            </div>
            <div class="text-4xl">🏆</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-xl font-bold mb-4">Recent Student Activity</h3>
          <div class="space-y-3">
            ${students.slice(0, 5).map(student => `
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                  ${getAvatarEmoji(student.avatar)}
                </div>
                <div class="flex-1">
                  <p class="font-medium">${student.name}</p>
                  <p class="text-sm text-gray-600">
                    ${student.progress?.videosWatched || 0} videos • ${student.progress?.gamesPlayed || 0} games
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-green-600">
                    ${calculateOverallProgress(student)}%
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold mb-4">Subject Performance</h3>
          <div class="space-y-4">
            ${['science', 'mathematics', 'technology', 'engineering'].map(subject => {
              const avgProgress = students.length > 0 
                ? Math.round(students.reduce((sum, student) => 
                    sum + (student.progress?.subjects?.[subject]?.progress || 0), 0) / students.length)
                : 0;
              
              return `
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium capitalize">${subject}</span>
                    <span class="text-sm text-gray-600">${avgProgress}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${avgProgress}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTeacherStudents() {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  
  return `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div class="relative">
          <input type="text" placeholder="Search students..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${students.map(student => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg mr-3">
                        ${getAvatarEmoji(student.avatar)}
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">${student.name}</div>
                        <div class="text-sm text-gray-500">@${student.username}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.grade}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style="width: ${calculateOverallProgress(student)}%"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-900">${calculateOverallProgress(student)}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.progress?.totalXP || 0}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${student.progress?.videosWatched || 0}V • ${student.progress?.gamesPlayed || 0}G
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      ${students.length === 0 ? `
        <div class="text-center py-12">
          <div class="text-6xl text-gray-300 mb-4">👥</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p class="text-gray-500">Students will appear here when they register.</p>
        </div>
      ` : ''}
    </div>
  `;
}

function renderTeacherContent() {
  return `
    <div class="card">
      <h3 class="text-xl font-bold mb-4">Content Library</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="text-4xl mb-3">🌱</div>
          <h4 class="font-semibold mb-2">How Plants Make Food</h4>
          <p class="text-sm text-gray-600 mb-3">Science • 5:30 • Easy</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>👁️ 456 views</span>
            <span>⭐ 4.8/5</span>
          </div>
        </div>
        
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="text-4xl mb-3">📐</div>
          <h4 class="font-semibold mb-2">Fun with Shapes</h4>
          <p class="text-sm text-gray-600 mb-3">Mathematics • 7:15 • Medium</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>👁️ 387 views</span>
            <span>⭐ 4.6/5</span>
          </div>
        </div>
        
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="text-4xl mb-3">🧮</div>
          <h4 class="font-semibold mb-2">Math Quiz Challenge</h4>
          <p class="text-sm text-gray-600 mb-3">Game • Interactive • Easy</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>🎮 423 plays</span>
            <span>⭐ 4.9/5</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTeacherAnalytics() {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-xl font-bold mb-4">Engagement Metrics</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">2.4h</div>
              <div class="text-sm text-blue-800">Avg Session</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">94%</div>
              <div class="text-sm text-green-800">Completion</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">67%</div>
              <div class="text-sm text-purple-800">Return Rate</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold mb-4">Popular Content</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span class="font-medium">How Plants Make Food</span>
              </div>
              <span class="text-sm text-gray-600">456 views</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span class="font-medium">Math Quiz Challenge</span>
              </div>
              <span class="text-sm text-gray-600">423 plays</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span class="font-medium">Fun with Shapes</span>
              </div>
              <span class="text-sm text-gray-600">387 views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Utility functions
function getDifficultyClass(difficulty) {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function calculateOverallProgress(student) {
  if (!student.progress || !student.progress.subjects) return 0;
  const subjects = Object.values(student.progress.subjects);
  const total = subjects.reduce((sum, subject) => sum + subject.progress, 0);
  return Math.round(total / subjects.length);
}

// Game and video functions
function playVideo(videoId, subject) {
  const newProgress = {
    videosWatched: currentUser.progress.videosWatched + 1,
    totalXP: currentUser.progress.totalXP + 10,
    subjects: {
      ...currentUser.progress.subjects,
      [subject]: {
        progress: Math.min(100, currentUser.progress.subjects[subject].progress + 5),
        xp: currentUser.progress.subjects[subject].xp + 10
      }
    }
  };
  
  updateProgress(newProgress);
  alert(`🎉 Great job! You earned 10 XP for watching the video!`);
}

function playGame(gameId, subject) {
  const newProgress = {
    gamesPlayed: currentUser.progress.gamesPlayed + 1,
    totalXP: currentUser.progress.totalXP + 20,
    subjects: {
      ...currentUser.progress.subjects,
      [subject]: {
        progress: Math.min(100, currentUser.progress.subjects[subject].progress + 10),
        xp: currentUser.progress.subjects[subject].xp + 20
      }
    }
  };
  
  updateProgress(newProgress);
  alert(`🎉 Awesome! You earned 20 XP for playing the game!`);
}

function updateProgress(newProgress) {
  currentUser.progress = { ...currentUser.progress, ...newProgress };
  
  // Update localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Update students array
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const updatedStudents = students.map(s => 
    s.id === currentUser.id ? currentUser : s
  );
  localStorage.setItem('students', JSON.stringify(updatedStudents));
  
  // Update UI
  updateStudentInfo();
  if (currentStudentSection) {
    showStudentSection(currentStudentSection);
  }
}

// Avatar functions
function showAvatarModal() {
  selectedAvatar = currentUser.avatar;
  document.getElementById('avatarModal').classList.add('active');
  updateAvatarPreview();
}

function closeAvatarModal() {
  document.getElementById('avatarModal').classList.remove('active');
}

function initializeAvatarGrid() {
  const grid = document.getElementById('avatarGrid');
  grid.innerHTML = avatarOptions.map(avatar => `
    <button onclick="selectAvatar('${avatar.id}')" class="p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 border-gray-200 hover:border-indigo-300 hover:bg-gray-50" id="avatar-${avatar.id}">
      <div class="text-3xl mb-2">${avatar.emoji}</div>
      <div class="text-xs text-gray-600 font-medium">${avatar.name}</div>
    </button>
  `).join('');
}

function selectAvatar(avatarId) {
  selectedAvatar = avatarId;
  updateAvatarPreview();
  
  // Update grid selection
  avatarOptions.forEach(avatar => {
    const button = document.getElementById(`avatar-${avatar.id}`);
    if (avatar.id === avatarId) {
      button.className = 'p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 border-indigo-500 bg-indigo-50 shadow-lg';
    } else {
      button.className = 'p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 border-gray-200 hover:border-indigo-300 hover:bg-gray-50';
    }
  });
}

function updateAvatarPreview() {
  const selectedOption = avatarOptions.find(a => a.id === selectedAvatar);
  document.getElementById('selectedAvatarPreview').textContent = selectedOption.emoji;
  document.getElementById('selectedAvatarName').textContent = `Selected: ${selectedOption.name}`;
}

function saveAvatar() {
  currentUser.avatar = selectedAvatar;
  
  // Update localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Update students array
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const updatedStudents = students.map(s => 
    s.id === currentUser.id ? currentUser : s
  );
  localStorage.setItem('students', JSON.stringify(updatedStudents));
  
  // Update UI
  updateStudentInfo();
  closeAvatarModal();
}

// Navigation functions
function goHome() {
  document.getElementById('studentDashboard').classList.remove('active');
  document.getElementById('teacherDashboard').classList.remove('active');
  document.getElementById('landingPage').style.display = 'block';
  currentUser = null;
  currentRole = null;
}

function logout() {
  localStorage.removeItem('currentUser');
  goHome();
}