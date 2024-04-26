import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, Stack, styled } from '@mui/material';

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
    min: string;
    max: string;
    mean: string;
    stdDev: string;
    current: string;
}

export interface NIRRow {
    elementName: string;
    min: string;
    max: string;
    mean: string;
    stdDev: string;
    observationCount: string;
}

export interface CounterRow {
    elementName: string;
    finalCount: string;
    productionRate: string;
    averageInterArrivalTime: string;
    firstArrival: string;
    lastArrival: string;
}

export interface WFRow {
    elementName: string;
    averageLength: string;
    stdDev: string;
    maxLength: string;
    currentLength: string;
    avgWaitTime: string;
}

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
}));


function ResultView(props: ResultViewProps | null): JSX.Element {

    if (!props || !props.data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Stack direction="column">
                    <Item><h2>Waiting for Results</h2></Item>
                    <Item><CircularProgress /></Item>
                </Stack>
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
                            <TableCell align="right">{row.mean}</TableCell>
                            <TableCell align="right">{row.stdDev}</TableCell>
                            <TableCell align="right">{row.min}</TableCell>
                            <TableCell align="right">{row.max}</TableCell>
                            <TableCell align="right">{row.current}</TableCell>
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
                            <TableCell align="right">{row.mean}</TableCell>
                            <TableCell align="right">{row.stdDev}</TableCell>
                            <TableCell align="right">{row.observationCount}</TableCell>
                            <TableCell align="right">{row.min}</TableCell>
                            <TableCell align="right">{row.max}</TableCell>
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
                            <TableCell align="right">{row.finalCount}</TableCell>
                            <TableCell align="right">{row.productionRate}</TableCell>
                            <TableCell align="right">{row.averageInterArrivalTime}</TableCell>
                            <TableCell align="right">{row.firstArrival}</TableCell>
                            <TableCell align="right">{row.lastArrival}</TableCell>
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
                            <TableCell align="right">{row.averageLength}</TableCell>
                            <TableCell align="right">{row.stdDev}</TableCell>
                            <TableCell align="right">{row.maxLength}</TableCell>
                            <TableCell align="right">{row.currentLength}</TableCell>
                            <TableCell align="right">{row.avgWaitTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

export default ResultView;