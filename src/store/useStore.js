import { create } from 'zustand';
import mockData from '../mocks/data.json';

const useStore = create((set, get) => ({
    categories: [],
    activeCategoryId: null,
    activeTab: 'dictionary', // 'dictionary' | 'relationship' | 'kn_type'
    dictionaryData: [],
    relationshipData: [],
    relationshipDictionary: [],
    knTypeData: [],

    // Actions
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

    setActiveTab: (tab) => set({ activeTab: tab }),

    loadCategoryData: (categoryId) => {
        if (!categoryId) return;

        // Simulate data fetching from mock
        const dictData = mockData.data_structure.dictionary[categoryId] || [];
        const relData = mockData.data_structure.relations[categoryId] || [];
        const relDict = mockData.data_structure.relationship_dictionary || [];
        const knData = mockData.data_structure.kn_type_data ? (mockData.data_structure.kn_type_data[categoryId] || []) : [];

        set({
            dictionaryData: dictData,
            relationshipData: relData,
            relationshipDictionary: relDict,
            knTypeData: knData
        });
    }
}));

export default useStore;
