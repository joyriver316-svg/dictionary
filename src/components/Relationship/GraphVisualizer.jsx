import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphVisualizer = ({ relationships }) => {
    const data = useMemo(() => {
        const nodes = [];
        const links = [];
        const nodeSet = new Set();

        relationships.forEach(rel => {
            // Add Subject
            if (!nodeSet.has(rel.subject)) {
                nodes.push({ id: rel.subject, group: 1 });
                nodeSet.add(rel.subject);
            }
            // Add Object
            if (!nodeSet.has(rel.object)) {
                nodes.push({ id: rel.object, group: 2 });
                nodeSet.add(rel.object);
            }
            // Add Link
            links.push({
                source: rel.subject,
                target: rel.object,
                label: rel.predicate
            });
        });

        return { nodes, links };
    }, [relationships]);

    return (
        <div className="w-full h-full border rounded-lg bg-gray-50 overflow-hidden">
            <ForceGraph2D
                graphData={data}
                nodeLabel="id"
                nodeAutoColorBy="group"
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                curvedLinks={true}
                enableNodeDrag={true}
                width={800} // Dynamic sizing is better, but fixed for MVP stability or wrap in ResizeObserver
                height={600}

                // Link Label Rendering
                linkLabel="label"
                linkCanvasObjectMode={() => 'after'}
                linkCanvasObject={(link, ctx) => {
                    const MAX_FONT_SIZE = 4;
                    const LABEL_NODE_MARGIN = 4;

                    const start = link.source;
                    const end = link.target;

                    // ignore unbound links
                    if (typeof start !== 'object' || typeof end !== 'object') return;

                    // calculate label positioning
                    const textPos = Object.assign(...['x', 'y'].map(c => ({
                        [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                    })));

                    const relLink = { x: end.x - start.x, y: end.y - start.y };

                    const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;

                    let textAngle = Math.atan2(relLink.y, relLink.x);
                    // maintain label vertical orientation for legibility
                    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
                    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

                    const label = link.label;

                    // estimate fontSize to fit in link length
                    ctx.font = '2px Sans-Serif';
                    const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width);
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                    // draw text label (with background rect)
                    ctx.save();
                    ctx.translate(textPos.x, textPos.y);
                    ctx.rotate(textAngle);

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'darkgrey';
                    ctx.fillText(label, 0, 0);
                    ctx.restore();
                }}
            />
        </div>
    );
};

export default GraphVisualizer;
