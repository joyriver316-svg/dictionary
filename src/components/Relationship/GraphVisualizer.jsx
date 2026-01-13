import React, { useMemo, useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Search, RefreshCw } from 'lucide-react';

const GraphVisualizer = ({ relationships = [], centerNode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [depth, setDepth] = useState(1);
    const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef(null);

    // Filter Logic: Get subgraph based on centerNode and depth
    const data = useMemo(() => {
        if (!centerNode) return { nodes: [], links: [] };

        const nodes = new Set();
        const links = [];
        const visited = new Set();
        const queue = [{ id: centerNode, depth: 0 }];

        visited.add(centerNode);
        nodes.add(centerNode);

        // BFS Traversal Control
        // We iterate interactions to find neighbors up to depth

        // Optimize: Convert relationships to adjacency list for faster traversal if needed
        // For small datasets, iteration is fine.

        // Current implementation: Multi-pass filtering (simpler for React useMemo structure without maintaining complex state)
        // Pass 0: Center
        // Pass 1: Links connected to Center -> Add Neighbors
        // Pass 2: Links connected to Neighbors -> Add Neighbors...

        let currentLevelNodes = new Set([centerNode]);

        for (let d = 0; d < depth; d++) {
            const nextLevelNodes = new Set();

            relationships.forEach(rel => {
                const subjectIn = currentLevelNodes.has(rel.subject);
                const objectIn = currentLevelNodes.has(rel.object);

                if (subjectIn || objectIn) {
                    // This link helps us expand or is internal
                    // We add it if at least one side is in current expansion frontier

                    // Add link if not already added (simple check)
                    // Note: relationships might be large, better logic needed for massive graphs
                    if (!links.includes(rel)) {
                        links.push({
                            source: rel.subject,
                            target: rel.object,
                            label: rel.relation // Ensure 'relation' property is used based on knTypeData format
                        });
                    }

                    if (subjectIn && !visited.has(rel.object)) {
                        visited.add(rel.object);
                        nextLevelNodes.add(rel.object);
                        nodes.add(rel.object);
                    }
                    if (objectIn && !visited.has(rel.subject)) {
                        visited.add(rel.subject);
                        nextLevelNodes.add(rel.subject);
                        nodes.add(rel.subject);
                    }
                }
            });

            if (nextLevelNodes.size === 0) break;
            currentLevelNodes = nextLevelNodes;
        }

        // Apply Search Filter (Post-traversal filter or Highlight?)
        // If Search text exists, we might filter the RESULTING nodes to only show those matching + their connections?
        // Or usually in these visualizations, Search finds a node and centers it, or filters the list.
        // Let's implement filters: Only show nodes matching search (and their neighbors?) or just highlight?
        // Use case: "Node Search" usually filters the graph to show only matching nodes and immediate connections.
        // For now, let's keep all traversals visible but maybe filter if term is strict.
        // Based on UI "Search" button, it implies a filter action.

        let validNodes = Array.from(nodes).map(id => ({
            id,
            group: id === centerNode ? 1 : 2,
            isMatch: !searchTerm || id.toLowerCase().includes(searchTerm.toLowerCase())
        }));

        if (searchTerm) {
            // If searching, maybe we only show matches? 
            // Or we just highlight matches. Let's filter for now to be "responsive".
            // But if we filter nodes, we must filter links.

            // Option A: Filter: Only match nodes.
            // Option B: Highlight: Match nodes are blue, others gray.
            // Let's go with B (Highlighting) as removing nodes disconnects the graph often.
            // Actually, the user prompts "Node Search" with a "Search" button. 
            // Let's stick to standard behavior: Select/Highlight.
        }

        return { nodes: validNodes, links };
    }, [relationships, centerNode, depth]);

    // Resize Observer
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setGraphDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div className="w-full h-full flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden">
            {/* Control Header */}
            <div className="flex flex-wrap items-center gap-2 px-4 min-h-[48px] border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap shrink-0">
                        노드: {data.nodes.length.toLocaleString()}개
                    </span>
                    <div className="h-3 w-px bg-gray-300 mx-1 shrink-0"></div>
                    <input
                        type="text"
                        placeholder="노드 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-full min-w-[60px] focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-500">Depth</span>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={depth}
                            onChange={(e) => setDepth(parseInt(e.target.value) || 1)}
                            className="border border-gray-300 rounded px-1 py-1 text-xs w-10 text-center focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap">
                        검색
                    </button>
                    <button
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                        onClick={() => { setSearchTerm(""); setDepth(1); }}
                        title="초기화"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 bg-white relative" ref={containerRef}>
                <ForceGraph2D
                    width={graphDimensions.width}
                    height={graphDimensions.height}
                    graphData={data}
                    nodeLabel="id"
                    nodeColor={node => node.group === 1 ? '#60a5fa' : (node.isMatch !== false ? '#93c5fd' : '#e5e7eb')}
                    nodeRelSize={6}
                    linkColor={() => '#cbd5e1'}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    linkCurvature={0} // Straight lines as per image? Or curved? Image looks straight-ish but spread. default curve is fine.

                    // Custom Render for Link Labels
                    linkCanvasObjectMode={() => 'after'}
                    linkCanvasObject={(link, ctx) => {
                        const MAX_FONT_SIZE = 4;
                        const LABEL_NODE_MARGIN = 4;

                        const start = link.source;
                        const end = link.target;

                        if (typeof start !== 'object' || typeof end !== 'object') return;

                        const textPos = Object.assign(...['x', 'y'].map(c => ({
                            [c]: start[c] + (end[c] - start[c]) / 2
                        })));

                        const relLink = { x: end.x - start.x, y: end.y - start.y };
                        const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;

                        let textAngle = Math.atan2(relLink.y, relLink.x);
                        if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
                        if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

                        const label = link.label;

                        ctx.font = '2px Sans-Serif';
                        const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width);
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                        ctx.save();
                        ctx.translate(textPos.x, textPos.y);
                        ctx.rotate(textAngle);

                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, ...bckgDimensions);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#64748b'; // Slate 500
                        ctx.fillText(label, 0, 0);
                        ctx.restore();
                    }}

                    // Custom Render for Node Labels (outside/below node)
                    nodeCanvasObjectMode={() => 'after'}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = '#334155'; // Slate 700

                        const nodeR = 6; // RelSize
                        ctx.fillText(label, node.x, node.y + nodeR + 2);
                    }}
                />
            </div>
        </div>
    );
};

export default GraphVisualizer;
