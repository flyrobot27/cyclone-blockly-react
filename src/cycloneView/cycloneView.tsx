import { Canvas } from "reaflow";

export function CycloneView() {
    return (
        <div style={{
            height: "90vh"
        }}>
            <Canvas 
            readonly={true}
            nodes={[{
                id: '1',
                text: '1'
            }, {
                id: '2',
                text: '2'
            }]} edges={[{
                id: '1-2',
                from: '1',
                to: '2'
            }]} onLayoutChange={layout => console.log('Layout', layout)} />
        </div>);
}
