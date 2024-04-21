import { Canvas, Icon, Node } from "reaflow";
import combiIcon from "./icons/combi.png";
import normalImage from "./icons/normal.png";
import queueImage from "./icons/queue.png";
import consolidateImage from "./icons/consolidate.png";
import counterImage from "./icons/counter.png";
import BlockNames from "../blocklyEditor/blocks/names";

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


function codeToNode (codeJson: ModelCode) {

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

function codeToEdges (codeJson: ModelCode) {
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


export function CycloneView(props: { codeList: string[] | null}) {
    
    if (!props.codeList) {
        return <></>
    }
    
    let nodes = Array<GraphNode>();
    let edges = Array<GraphEdge>();

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

    console.log(JSON.stringify(nodes, null, 2));
    console.log(JSON.stringify(edges, null, 2));

    return (
        <div className="h-[88vh]">
            <Canvas className="bg-gray-100"
                readonly={true}
                nodes={nodes}
                edges={edges}
                node={<Node icon={<Icon/>} draggable={true}/>} />
        </div>);
}
