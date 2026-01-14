import { create } from 'zustand';
import mockData from '../mocks/data.json';

const useStore = create((set, get) => ({
    categories: [],
    activeCategoryId: null,
    activeTab: 'dictionary', // 'dictionary' | 'relationship' | 'kn_type' | 'settings'
    dictionaryData: [],
    relationshipData: [],
    relationshipDictionary: [],
    knTypeData: [],

    // Authentication & Settings State
    isAuthenticated: false,
    currentUser: null,
    users: [
        { id: 'admin', name: 'Administrator', password: 'admin' } // Default admin user
    ],
    // DB Settings & Workspace
    dbSettings: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: '',
        dbName: 'dictionary_db'
    },
    workspaces: [
        { id: 'ws1', name: '기본 워크스페이스', description: '기본 작업 공간입니다.' }
    ],
    activeWorkspaceId: 'ws1',

    // Actions
    // Settings Actions
    updateDbSettings: (settings) => set({ dbSettings: settings }),

    // Workspace Actions
    addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, { ...workspace, id: `ws${Date.now()}` }]
    })),
    updateWorkspace: (updatedWorkspace) => set((state) => ({
        workspaces: state.workspaces.map(ws =>
            ws.id === updatedWorkspace.id ? updatedWorkspace : ws
        )
    })),
    deleteWorkspace: (id) => set((state) => {
        // Prevent deleting the active workspace or the last remaining workspace
        if (state.workspaces.length <= 1) return state;

        let newActiveId = state.activeWorkspaceId;
        if (state.activeWorkspaceId === id) {
            const remaining = state.workspaces.filter(ws => ws.id !== id);
            newActiveId = remaining[0]?.id;
        }

        return {
            workspaces: state.workspaces.filter(ws => ws.id !== id),
            activeWorkspaceId: newActiveId
        };
    }),
    setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

    initialize: () => {
        const categories = mockData.data_structure.categories;
        set({
            categories,
            activeCategoryId: categories[0]?.id || null
        });
        get().loadCategoryData(categories[0]?.id);
    },

    setActiveCategory: (id) => {
        set({ activeCategoryId: id });
        get().loadCategoryData(id);
    },

    addCategory: (name) => {
        const newCategory = { id: `cat${Date.now()}`, name };
        set((state) => ({
            categories: [...state.categories, newCategory]
        }));
        // Select the new category
        get().setActiveCategory(newCategory.id);
    },

    updateCategory: (id, newName) => set((state) => ({
        categories: state.categories.map(cat =>
            cat.id === id ? { ...cat, name: newName } : cat
        )
    })),

    setActiveTab: (tab) => set({ activeTab: tab }),

    loadCategoryData: (categoryId) => {
        if (!categoryId) return;

        // Simulate data fetching from mock
        // Simulate data fetching from mock
        let dictData = mockData.data_structure.dictionary[categoryId] || [];
        const relData = mockData.data_structure.relations[categoryId] || [];
        let relDict = mockData.data_structure.relationship_dictionary || [];
        let knData = mockData.data_structure.kn_type_data ? (mockData.data_structure.kn_type_data[categoryId] || []) : [];

        // Helper to inflate data for UI visualization (Mockup purposes)
        const inflateData = (data, prefix) => {
            if (data.length > 0 && data.length < 60) {
                const inflated = [...data];
                while (inflated.length < 60) {
                    inflated.push(...data.map((item, idx) => ({
                        ...item,
                        id: `${prefix}_${inflated.length + idx}`, // Ensure unique ID if needed
                        // Append numbering to text fields to distinguish visually
                        term_kr: item.term_kr ? `${item.term_kr} ${inflated.length + idx + 1}` : undefined,
                        subject: item.subject ? `${item.subject} ${inflated.length + idx + 1}` : undefined
                    })));
                }
                return inflated.slice(0, 60);
            }
            return data;
        };

        dictData = inflateData(dictData, 'dict');
        relDict = inflateData(relDict, 'rel');
        knData = inflateData(knData, 'kn');

        set({
            dictionaryData: dictData,
            relationshipData: relData,
            relationshipDictionary: relDict,
            knTypeData: knData
        });
    },

    // Auth Actions
    login: (id, password) => {
        const user = get().users.find(u => u.id.toLowerCase() === id.toLowerCase() && u.password === password);
        if (user) {
            set({ isAuthenticated: true, currentUser: user });
            return true;
        }
        return false;
    },
    logout: () => set({ isAuthenticated: false, currentUser: null, activeTab: 'dictionary' }),

    // User Management Actions
    addUser: (newUser) => set((state) => ({ users: [...state.users, newUser] })),
    updateUser: (updatedUser) => set((state) => ({
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    })),
    deleteUser: (userId) => set((state) => ({
        users: state.users.filter(u => u.id !== userId)
    })),

    // Settings Actions
    updateDbSettings: (settings) => set({ dbSettings: settings }),
}));

export default useStore;
