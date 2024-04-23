import { Canvas, Icon, Label, Node } from "reaflow";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import combiIcon from "./icons/combi.png";
import normalImage from "./icons/normal.png";
import queueImage from "./icons/queue.png";
import consolidateImage from "./icons/consolidate.png";
import counterImage from "./icons/counter.png";
import BlockNames from "../blocklyEditor/blocks/names";
import { useRef, useState } from "react";

interface ModelCode {
    networkInput: Array<NetworkElement | NetworkElementWithFollowers | NetworkElementWithFollowersPreceders>;
}

interface NetworkElement {
    type: string;
    label: number;
    description: string;
}

interface NetworkElementWithFollowers {
    type: string;
    label: number;
    description: string;
    followers: Array<NetworkElementReference>;
}

interface NetworkElementWithFollowersPreceders {
    type: string;
    label: number;
    description: string;
    followers: Array<NetworkElementReference>;
    preceders: Array<NetworkElementReference>;
}

interface NetworkElementReference {
    type: string;
    value: number;
}

interface GraphNode {
    id: string;
    text: string;
}

interface GraphEdge {
    id: string;
    from: string;
    to: string;
}


function codeToNode(codeJson: ModelCode) {

    let nodes = codeJson.networkInput.map((node, _index) => {
        let id = node.label.toString();
        let description = node.description || node.type.toLowerCase();
        let text = `${id} - ${description}`;

        let icon = "";

        switch (node.type) {
            case BlockNames.NetworkBlockTypes.Combi:
                icon = combiIcon;
                break;
            case BlockNames.NetworkBlockTypes.Normal:
                icon = normalImage;
                break;
            case BlockNames.NetworkBlockTypes.Queue:
                icon = queueImage;
                break;
            case BlockNames.NetworkBlockTypes.Consolidate:
                icon = consolidateImage;
                break;
            case BlockNames.NetworkBlockTypes.Counter:
                icon = counterImage;
                break;
        }

        return {
            id: id,
            text: text,
            icon: {
                url: icon,
                width: 60,
                height: 60
            }
        }
    });
    return nodes;
}

function codeToEdges(codeJson: ModelCode) {
    let edges = Array<any>();
    codeJson.networkInput.forEach((node, _index) => {
        if ('followers' in node) {
            let from = node.label.toString();
            let to = node.followers;
            to.forEach((follower, _index) => {
                edges.push({
                    id: `${from}-${follower.value}`,
                    from: from,
                    to: follower.value.toString()
                });
            });
        }

        if ('preceders' in node) {
            let to = node.label.toString();
            let from = node.preceders;
            from.forEach((preceder, _index) => {
                edges.push({
                    id: `${preceder.value}-${to}`,
                    from: preceder.value.toString(),
                    to: to
                });
            });
        }
    });
    return edges;
}


export function CycloneView(props: { codeList: string[] | null }) {

    let nodes = Array<GraphNode>();
    let edges = Array<GraphEdge>();

    if (props.codeList) {
        props.codeList.forEach((codeString, _index) => {
            let code: ModelCode = JSON.parse(codeString);
            nodes = nodes.concat(codeToNode(code));
            edges = edges.concat(codeToEdges(code));
        });

        // sort edge list based on "from" and "to" values
        edges.sort((a, b) => {
            let aFrom = parseInt(a.from);
            let bFrom = parseInt(b.from);
            let aTo = parseInt(a.to);
            let bTo = parseInt(b.to);
            if (aFrom < bFrom) {
                return -1;
            } else if (aFrom > bFrom) {
                return 1;
            } else {
                if (aTo < bTo) {
                    return -1;
                } else if (aTo > bTo) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        // sort node list based on "id" values
        nodes.sort((a, b) => {
            let aId = parseInt(a.id);
            let bId = parseInt(b.id);
            if (aId < bId) {
                return -1;
            } else if (aId > bId) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    // Mouse Scrolling
    const canvasDivRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const mouseCoords = useRef({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0
    });
    // const [isScrolling, setIsScrolling] = useState(false);
    const handleDragStart = (e: { pageX: number; pageY: number; }) => {
        if (!canvasDivRef.current) return;
        const slider = (canvasDivRef.current as any).children[0];
        const startX = e.pageX - slider.offsetLeft;
        const startY = e.pageY - slider.offsetTop;
        const scrollLeft = slider.scrollLeft;
        const scrollTop = slider.scrollTop;
        mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
        setIsMouseDown(true);
        document.body.style.cursor = "grabbing";
    }
    const handleDragEnd = () => {
        setIsMouseDown(false)
        if (!canvasDivRef.current) return
        document.body.style.cursor = "default"
    }
    const handleDrag = (e: { preventDefault: () => void; pageX: number; pageY: number; }) => {
        if (!isMouseDown || !canvasDivRef.current) return;
        e.preventDefault();
        const slider = (canvasDivRef.current as any).children[0];
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - mouseCoords.current.startX) * 1.5;
        const walkY = (y - mouseCoords.current.startY) * 1.5;
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
        slider.scrollTop = mouseCoords.current.scrollTop - walkY;
    }

    return (
        <div ref={canvasDivRef} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseMove={handleDrag} className="flex overflow-x-scroll h-[80vh]">
            <Canvas
                zoomable={false}
                readonly={true}
                nodes={nodes}
                edges={edges}
                node={
                    <Node
                        style={{
                            stroke: '#1a192b',
                            fill: 'white',
                            strokeWidth: 1
                        }}
                        icon={<Icon 
                            style={{
                                moveBy: { x: -30, y: -30 }
                            }}
                        />}
                        draggable={true}
                        label={
                            <Label style={{
                                fill: 'black',
                                fontSize: 12,
                                fontWeight: 'bold'
                            }} 
                        />}
                    />
                }
            />
        </div>
    );
}
