import React, { useEffect, useState, useCallback } from 'react'
import { useInterval } from '../hooks/use-interval'
import Button from './button';
import Timer from './timer';
import secondsToTime from '../utils/seconds-to-time'
const bellStart =require("../sounds/bell-start.mp3")
const bellFinish =require("../sounds/bell-finish.mp3")
const audioStartWorking = new Audio(bellStart)
const audioStopWorking = new Audio(bellFinish)
interface Props {
    pomodoroTime:number;
    shortRestTime:number;
    longRestTime:number;
    cycles:number;
}
export function PomodoroTimer (props:Props): JSX.Element {
    const [mainTime, setMainTime] = useState(props.pomodoroTime)
    const [timeCounting, setTimeCounting] = useState<Boolean>(false)
    const [working, setWorking] = useState<Boolean>(false)
    const [resting, setResting] = useState<Boolean>(false)
    const [cyclesQtdManager, setCyclesQtdManager] = useState<Boolean[]>(new Array(props.cycles).fill(true))
    const [completedCycles, setCompletedCycles] = useState(0)
    const [fullWorkingTime, setFullWorkingTime] = useState(0)
    const [numberOfPomodoros, setNumberOfPomodoros] = useState(0)
    useInterval(()=> {
        setMainTime(mainTime - 1)
        if(working) setFullWorkingTime(fullWorkingTime + 1)
    }, timeCounting ? 1000 : null)
    const configureWork = useCallback(() => {
        setTimeCounting(true)
        setWorking(true)
        setResting(false)
        setMainTime(props.pomodoroTime)
        audioStartWorking.play()
    },[setTimeCounting, setWorking, setResting, setMainTime, props.pomodoroTime])
    const configureRest = useCallback((long:boolean) => {
        setTimeCounting(true)
        setWorking(false)
        setResting(true)
        if(long) {
            setMainTime(props.longRestTime)
        } else {
            setMainTime(props.shortRestTime)
        }
        audioStopWorking.play()
    },[setTimeCounting, setWorking, setResting, setMainTime, props.longRestTime, props.shortRestTime])
    
    useEffect(()=>{
        if(working) document.body.classList.add('working')
        if(resting) document.body.classList.remove('working')
        if(mainTime > 0 ) return 
        if(working && cyclesQtdManager.length > 0){
            configureRest(false)
            cyclesQtdManager.pop()
        }else if(working && cyclesQtdManager.length <= 0) {
            configureRest(true)
            setCyclesQtdManager(new Array(props.cycles).fill(true))
            setCompletedCycles(completedCycles + 1)
        }
        if(working) setNumberOfPomodoros(numberOfPomodoros +1)
        if(resting) configureWork()
    }, [working, resting, mainTime, cyclesQtdManager, numberOfPomodoros, completedCycles, configureRest,setCyclesQtdManager, configureWork, props.cycles])
    return(
        <div className="pomodoro">
            <h2>You are:{working ? "Trabalhando" : "Descansando"}</h2>
            <Timer mainTime={mainTime}/>
            <div className="controls">
            <Button text='Work' onClick={configureWork}/>
            <Button text='Rest' className={!working && !resting ? 'hidden' : ''} onClick={()=> configureRest(false)}/>
            <Button text={timeCounting ? 'Pause' : 'Play'} onClick={()=>setTimeCounting(!timeCounting)}/>
            </div>
            <div className="details">
                <p>Ciclos Concluídos: {completedCycles}</p>
                <p>Horas Trabalhadas: {secondsToTime(fullWorkingTime)}</p>
                <p>Pomodoros Concluídos: {numberOfPomodoros}</p>
            </div>
        </div>
        )
}