import { useState } from "react"

const useWordle = (solution) =>{

    const[turn,setTurn] = useState(0)
    const[currentGuess,setCurrentGuess] = useState('')
    const[guesses,setGuesses] = useState([...Array(6)])
    const[history,setHistory] = useState([])
    const[isCorrect,setIsCorrect] = useState(false)
    const[usedKeys,setUsedKeys] = useState({})

    const formatGuess = () => {
        let solutionArray = [...solution]
        let formatedGuess = [...currentGuess].map((l)=>{
            return {key:l,color:'grey'}
        })

        //Green Letters
        formatedGuess.forEach((l,i)=>{
            if(solutionArray[i]===l.key){
                formatedGuess[i].color = 'green'
                solutionArray[i] = null
            }
        })

        //Yellow Letters
        formatedGuess.forEach((l,i)=>{
            if(solutionArray.includes(l.key) && l.color!=='green'){
                formatedGuess[i].color = 'yellow'
                solutionArray[solutionArray.indexOf(l.key)]=null
            }
        })
        return formatedGuess
    }

    const addNewGuess = (formatedGuess) => {
        if(currentGuess === solution){
            setIsCorrect(true)
        }
        setGuesses((prevGuesses)=>{
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formatedGuess
            return newGuesses
        })
        setHistory((prevHistory)=>{
            return [...prevHistory,currentGuess]
        })
        setTurn((prevTurn)=>{
            return prevTurn+1
        })
        setUsedKeys((prevUsedKeys)=>{
            let newKeys = {...prevUsedKeys}
            formatedGuess.forEach((l)=>{
                const currentColor = newKeys[l.key]
                if(l.color ==='green'){
                    newKeys[l.key] = 'green'
                    return
                }
                if(l.color ==='yellow' && currentColor!=='green'){
                    newKeys[l.key] = 'yellow'
                    return
                }
                if(l.color ==='grey' && currentColor!=='green' && currentColor!=='yellow'){
                    newKeys[l.key] = 'grey'
                    return
                }
            })
            return newKeys
        })
        setCurrentGuess('')
    }

    const handleKeyup = ({key}) => {

        if(key === 'Enter'){
            if(turn>5){
                console.log('Game Over')
                return
            }
            if(history.includes(currentGuess)){
                console.log('Already Guessed')
                return
            }
            if(currentGuess.length!==5){
                console.log('Word must be 5 characters long')
                return
            }
            const formatted = formatGuess()
            addNewGuess(formatted)
        }

        if(key === 'Backspace'){
            setCurrentGuess(prev=>prev.slice(0,-1))
            return
        }


        if(/^[A-Za-z]$/.test(key)){
            if(currentGuess.length<5){
                setCurrentGuess(prev=>prev+key)
            }
        }
    }
    return {turn,currentGuess,guesses,isCorrect,usedKeys,handleKeyup}

}

export default useWordle