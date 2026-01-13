import React from 'react';
import useStore from '../../store/useStore';
import SynonymList from './SynonymList';

const DictionaryView = () => {
    const { dictionaryData, activeCategoryId } = useStore();

    if (!activeCategoryId) {
        return (
            <div className="h-full flex flex-col p-6">
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-400 text-lg font-medium">좌측 메뉴에서 카테고리를 선택하세요</p>
                    </div>
                </div>
            </div>
        );
    }

    if (dictionaryData.length === 0) {
        return (
            <div className="h-full w-full">
                <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800">개념사전 (Concept Dictionary)</h2>
                </div>
                <div className="flex-1 h-[calc(100%-3.5rem)] flex items-center justify-center text-gray-400">
                    <p>이 카테고리에는 사전 데이터가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-gray-800">개념사전 (Concept Dictionary)</h2>
                <div className="text-sm text-gray-500">
                    {dictionaryData.length} 개 용어
                </div>
            </div>
            <SynonymList data={dictionaryData} />
        </div>
    );
};

export default DictionaryView;
