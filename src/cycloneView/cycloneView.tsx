import { Canvas } from "reaflow";

export function CycloneView() {
    return (
        <div className="h-[88vh]">
            <Canvas 
            readonly={true}
            nodes={[{
                id: '1',
                text: '1',
                icon: {
                    url: "./icons/combi.png",
                    height: 50,
                    width: 50
                }
            }, {
                id: '2',
                text: '2'
            }, {
                id: '3',
                text: '3'
            },{
                id: '4',
                text: '4'
            }]} edges={[{
                id: '1-2',
                from: '1',
                to: '2'
            }, {
                id: '1-3',
                from: '1',
                to: '3'
            },{
                id: '1-4',
                from: '1',
                to: '4'
            }, {
                id: '4-1',
                from: '4',
                to: '1'
            }]} onLayoutChange={layout => console.log('Layout', layout)} />
        </div>);
}
