 [과업 지시서] 온톨로지 기반 하이브리드 RAG 검토 플랫폼 구축
1. 프로젝트 개요

프로젝트명: Nolan Ontology-RAG Explorer

목적: LLM이 추출한 온톨로지(사전 및 관계)를 TFT가 검토, 논의하고 원천 데이터(Chunk)를 확인할 수 있는 협업 인터페이스 구축

주요 기능: 카테고리별 사전(Synonym) 관리, 문서(Chunk) 연동 뷰어, 트리플(Triple) 구조 시각화

2. 화면 구성 및 상세 요구사항

A. LNB (Left Navigation Bar)
기능: 추출된 온톨로지의 카테고리(엔티티 타입) 목록을 트리 또는 리스트 형태로 제공

인터랙션: 카테고리 선택 시 메인 콘텐츠 영역의 데이터 갱신

B. 메인 콘텐츠 영역 (Tab 구조)
탭 1: Dictionary (사전)

목록: 유의어(Synonyms) 그룹화 리스트

메타데이터: 각 유의어별 포함된 Chunk(문서) 수 표시

문서 뷰어: 우측에 청크 문서 아이콘 배치. 아이콘 클릭 시 Modal 또는 Side-panel을 통해 문서 전체 내용 출력

탭 2: Relationship (관계)

시각화: 카테고리 간의 연결 관계를 트리플(Subject-Predicate-Object) 구조로 시각화

형태: 그래프 네트워크 뷰 또는 계층형 리스트 뷰

🎨 React 디자인 시스템 가이드라인 (Design Tokens & Rules)
안티그라비티 팀이 일관된 UI를 유지하도록 React 기반의 디자인 기준을 정의합니다.

1. Layout & Navigation
LNB Structure: width: 280px, background: #F8F9FA. 선택된 아이템은 Primary Color로 하이라이트.

Tab System: Ant Design 또는 MUI의 기본 탭 스타일을 따르되, 탭 전환 시 상태(State)가 유지되어야 함.

2. Component Specifications
Dictionary List: * Card 형태를 사용하여 유의어를 묶음.

Badge 컴포넌트로 Chunk 개수 표기 (ex: +12).

Chunk Viewer:

초기 상태: FileTextOutlined 형태의 큰 아이콘 배치.

확대 상태: Slide-over Drawer 또는 중심부 Modal 사용. 가독성을 위해 Line-height: 1.6 확보.

Relation Graph:

react-force-graph 또는 Cytoscape.js 라이브러리 권장.

노드(Node) 클릭 시 해당 관계의 근거가 되는 원문으로 이동하는 Shortcut 제공.

3. Typography & Color (Brand Identity)
Primary Color: #1A73E8 (Google Blue - 신뢰감 강조)

Background: #FFFFFF (Main), #F1F3F4 (Secondary)

Font: 'Pretendard' 또는 'Noto Sans KR' (14px 기본, 12px 메타정보)

🛠️ 기술 스택 및 데이터 인터페이스 (Ant-Gravity 전달용)
JSON
{
  "tech_stack": ["React", "Tailwind CSS", "Zustand/Recoil (State)", "React Query"],
  "data_structure": {
    "category": "string",
    "dictionary": [
      {
        "term": "string",
        "synonyms": ["string"],
        "chunk_count": "number",
        "chunks": [{"id": "id", "content": "text"}]
      }
    ],
    "relations": [
      {"subject": "A", "predicate": "related_to", "object": "B"}
    ]
  }
}
이 과업 지시서와 디자인 가이드를 안티그라비티 팀에 전달하면, TFT가 요구하는 **"데이터 근거 확인이 가능한 검토 환경"**이 체계적으로 구현될 것입니다.