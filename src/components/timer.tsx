import secondsToMinutes from '../utils/seconds-to-minutes'
interface Props {
    mainTime:number
}
export default function Timer(props:Props) : JSX.Element{
    return(
        <div className="timer">{secondsToMinutes(props.mainTime)}</div>)
}