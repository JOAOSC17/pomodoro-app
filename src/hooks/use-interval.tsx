import { useEffect, useRef } from 'react'

export function useInterval<C extends CallableFunction> (callback: C, delay:number | null):void {
    const savedCalback = useRef<C>()
    useEffect(()=>{
        savedCalback.current = callback
    }, [callback])
    useEffect(()=>{
        function tick () {
            if(savedCalback.current) savedCalback.current()
        }
        if(delay!== null){
            const id = setInterval(tick, delay);
            return () => clearInterval(id)
        }
    }, [delay])
}