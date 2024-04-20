import { Canvas, Icon, Node } from "reaflow";
import combi from "./icons/combi.png";

export function CycloneView() {
    return (
        <div className="h-[88vh]">
            <Canvas className="bg-gray-100"
                readonly={true}
                nodes={[{
                    id: '1',
                    text: '1 - Laborer Idle',
                    icon: {
                        url: combi,
                        width: 50,
                        height: 50
                    }
                }, {
                    id: '2',
                    text: '2'
                }, {
                    id: '3',
                    text: '3'
                }, {
                    id: '4',
                    text: '4'
                }]}

                edges={[{
                    id: '1-2',
                    from: '1',
                    to: '2'
                }, {
                    id: '1-3',
                    from: '1',
                    to: '3'
                }, {
                    id: '1-4',
                    from: '1',
                    to: '4'
                }, {
                    id: '4-1',
                    from: '4',
                    to: '1'
                }]}
                onLayoutChange={layout => console.log('Layout', layout)}
                node={<Node icon={<Icon/>}/>} />
        </div>);
}
