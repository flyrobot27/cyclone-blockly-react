import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';

export interface ResultViewProps {
    data: {
        intrinsicResult: Array<IRRow>,
        nonIntrinsicResult: Array<NIRRow>,
        counterResult: Array<CounterRow>,
        waitingFileResult: Array<WFRow>,
        terminationReason: string
    } | null | undefined;
}

export interface IRRow {
    elementName: string;
    min: number;
    max: number;
    mean: number;
    stdDev: number;
    current: number;
}

export interface NIRRow {
    elementName: string;
    min: number;
    max: number;
    mean: number;
    stdDev: number;
    observationCount: number;
}

export interface CounterRow {
    elementName: string;
    finalCount: number;
    productionRate: number;
    averageInterArrivalTime: number;
    firstArrival: number;
    lastArrival: number;
}

export interface WFRow {
    elementName: string;
    averageLength: number;
    stdDev: number;
    maxLength: number;
    currentLength: number;
    avgWaitTime: number;
}

function ResultView(props: ResultViewProps | null): JSX.Element {

    if (!props || !props.data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    let intrinsicResult: IRRow[] = props.data.intrinsicResult;
    let nonintrinsicResult: NIRRow[] = props.data.nonIntrinsicResult;
    let counterResult: CounterRow[] = props.data.counterResult;
    let waitingFileResult: WFRow[] = props.data.waitingFileResult;
    let terminationReason = props.data.terminationReason;

    return (
        <TableContainer component={Paper}>
            <h4 className="m-3 font-black">Termination Reason: {terminationReason}</h4>
            <h3 className="m-3 font-bold">Intrinsic Result:</h3>
            <Table aria-label="Intrinsic Result">
                <TableHead>
                    <TableRow>
                        <TableCell className="font-bold">Element Name</TableCell>
                        <TableCell align='right' className="font-bold">Mean</TableCell>
                        <TableCell align='right' className="font-bold">Standard Deviasion</TableCell>
                        <TableCell align='right' className="font-bold">Minimum Value</TableCell>
                        <TableCell align='right' className="font-bold">Maximum Value</TableCell>
                        <TableCell align='right' className="font-bold">Current Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {intrinsicResult.map((row) => (
                        <TableRow key={row.elementName}>
                            <TableCell component="th" scope="row">
                                {row.elementName}
                            </TableCell>
                            <TableCell align="right">{row.mean.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.stdDev.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.min.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.max.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.current.toFixed(3)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3 className="m-3 font-bold">Non Intrinsic Result:</h3>
            <Table sx={{ minWidth: 650 }} aria-label="Non Intrinsic Result">
                <TableHead>
                    <TableRow>
                        <TableCell className="font-bold">Element Name</TableCell>
                        <TableCell align='right' className="font-bold">Mean</TableCell>
                        <TableCell align='right' className="font-bold">Standard Deviasion</TableCell>
                        <TableCell align='right' className="font-bold">Observation Count</TableCell>
                        <TableCell align='right' className="font-bold">Minimum Value</TableCell>
                        <TableCell align='right' className="font-bold">Maximum Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {nonintrinsicResult.map((row) => (
                        <TableRow key={row.elementName}>
                            <TableCell component="th" scope="row">
                                {row.elementName}
                            </TableCell>
                            <TableCell align="right">{row.mean.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.stdDev.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.observationCount.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.min.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.max.toFixed(3)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3 className="m-3 font-bold">Counter Result:</h3>
            <Table sx={{ minWidth: 650 }} aria-label="Counter Result">
                <TableHead>
                    <TableRow>
                        <TableCell className="font-bold">Element Name</TableCell>
                        <TableCell align='right' className="font-bold">Final Count</TableCell>
                        <TableCell align='right' className="font-bold">Production Rate</TableCell>
                        <TableCell align='right' className="font-bold">Average Inter Arrival Time</TableCell>
                        <TableCell align='right' className="font-bold">First Arrival</TableCell>
                        <TableCell align='right' className="font-bold">Last Arrival</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {counterResult.map((row) => (
                        <TableRow key={row.elementName}>
                            <TableCell component="th" scope="row">
                                {row.elementName}
                            </TableCell>
                            <TableCell align="right">{row.finalCount.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.productionRate.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.averageInterArrivalTime.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.firstArrival.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.lastArrival.toFixed(3)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3 className="m-3 font-bold">Waiting File Result:</h3>
            <Table sx={{ minWidth: 650 }} aria-label="Waiting File Result">
                <TableHead>
                    <TableRow>
                        <TableCell className="font-bold">Element Name</TableCell>
                        <TableCell align='right' className="font-bold">Average Length</TableCell>
                        <TableCell align='right' className="font-bold">Standard Deviasion</TableCell>
                        <TableCell align='right' className="font-bold">Max Length</TableCell>
                        <TableCell align='right' className="font-bold">Current Length</TableCell>
                        <TableCell align='right' className="font-bold">Average Wait Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {waitingFileResult.map((row) => (
                        <TableRow key={row.elementName}>
                            <TableCell component="th" scope="row">
                                {row.elementName}
                            </TableCell>
                            <TableCell align="right">{row.averageLength.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.stdDev.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.maxLength.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.currentLength.toFixed(3)}</TableCell>
                            <TableCell align="right">{row.avgWaitTime.toFixed(3)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

export default ResultView;