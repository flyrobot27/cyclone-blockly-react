import { Canvas, Icon, Node } from "reaflow";
import combi from "./icons/combi.png";

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

function codeToNode (codeJson: ModelCode) {

    let nodes = codeJson.networkInput.map((node, _index) => {
        let id = node.label.toString();
        let description = node.description || node.type.toLowerCase();
        let text = `${id} - ${description}`;
        return {
            id: id,
            text: text
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
    
    let nodes = Array<any>();
    let edges = Array<any>();

    props.codeList.forEach((codeString, _index) => {
        let code: ModelCode = JSON.parse(codeString);
        nodes = nodes.concat(codeToNode(code));
        edges = edges.concat(codeToEdges(code));
    });

    return (
        <div className="h-[88vh]">
            <Canvas className="bg-gray-100"
                readonly={true}
                nodes={nodes}
                edges={edges}
                node={<Node icon={<Icon/>} draggable={true}/>} />
        </div>);
}
