// ============================================================
// AUTH.JS - Sistem Login, SuperAdmin & Admin
// ============================================================

const Auth = {
    // ---- INISIALISASI USER DEFAULT ----
    init() {
        const users = Auth.getUsers();
        if (users.length === 0) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'superadmin',
                    password: 'superadmin123',
                    nama: 'Super Administrator',
                    role: 'superadmin',
                    aktif: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'admin',
                    password: 'admin123',
                    nama: 'Administrator',
                    role: 'admin',
                    aktif: true,
                    created_at: new Date().toISOString()
                }
            ];
            localStorage.setItem('church_users', JSON.stringify(defaultUsers));
        }
    },

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem('church_users')) || [];
        } catch { return []; }
    },

    // ---- LOGIN ----
    login(username, password) {
        Auth.init();
        const users = Auth.getUsers();
        const user = users.find(u =>
            u.username === username &&
            u.password === password &&
            u.aktif === true
        );
        if (user) {
            const session = {
                id: user.id,
                username: user.username,
                nama: user.nama,
                role: user.role,
                login_at: new Date().toISOString()
            };
            sessionStorage.setItem('church_session', JSON.stringify(session));
            return { success: true, user: session };
        }
        return { success: false };
    },

    // ---- LOGOUT ----
    logout() {
        sessionStorage.removeItem('church_session');
        window.location.href = 'index.html';
    },

    // ---- CEK SESSION ----
    getSession() {
        try {
            return JSON.parse(sessionStorage.getItem('church_session')) || null;
        } catch { return null; }
    },

    // ---- PROTEKSI HALAMAN ----
    requireLogin() {
        const session = Auth.getSession();
        if (!session) {
            window.location.href = 'index.html';
            return null;
        }
        return session;
    },

    // ---- CEK ROLE ----
    isSuperAdmin() {
        const s = Auth.getSession();
        return s && s.role === 'superadmin';
    },

    isAdmin() {
        const s = Auth.getSession();
        return s && (s.role === 'admin' || s.role === 'superadmin');
    },

    // ---- TAMBAH USER (SuperAdmin only) ----
    addUser(data) {
        if (!Auth.isSuperAdmin()) return { success: false, msg: 'Tidak ada akses' };
        const users = Auth.getUsers();
        if (users.find(u => u.username === data.username)) {
            return { success: false, msg: 'Username sudah digunakan' };
        }
        data.id = Date.now();
        data.aktif = true;
        data.created_at = new Date().toISOString();
        users.push(data);
        localStorage.setItem('church_users', JSON.stringify(users));
        return { success: true };
    },

    // ---- UPDATE USER ----
    updateUser(id, data) {
        if (!Auth.isSuperAdmin()) return false;
        const users = Auth.getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...data };
            localStorage.setItem('church_users', JSON.stringify(users));
            return true;
        }
        return false;
    },

    // ---- HAPUS USER ----
    deleteUser(id) {
        if (!Auth.isSuperAdmin()) return false;
        const session = Auth.getSession();
        if (session && session.id === id) return false; // Tidak bisa hapus diri sendiri
        let users = Auth.getUsers().filter(u => u.id !== id);
        localStorage.setItem('church_users', JSON.stringify(users));
        return true;
    }
};

Auth.init();


