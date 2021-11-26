import React, { useState, useEffect ,useRef } from 'react'
import './App.css'
import TextField from "@material-ui/core/TextField";

import { useReactToPrint } from "react-to-print";
//note app which listens voice as well as typed contents


const SpeechRecog =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mike = new SpeechRecog()

mike.continuous = true
mike.interimResults = true
mike.lang = 'en-US'

function App() {
  const componentReference = useRef();
  //the handlePrint function save the content of the para in pdf form
  const handlePrintFunc = useReactToPrint({
    content: () => componentReference.current})
  const [isListening, setIsListening] = useState(false)
  const [notes, setNotes] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    const handleListenFunc = () => {
      if (isListening) {
        mike.start()
        mike.onend = () => {
          console.log('Working')
          mike.start()
        }
      } else {
        mike.stop()
        mike.onend = () => {
          console.log('Stopped Mic on Click')
        }
      }
      mike.onstart = () => {
        console.log('Mic is on')
      }
  
      mike.onresult = event => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        console.log(transcript)
        setNotes(transcript)
        mike.onerror = event => {
          console.log(event.error)
        }
      }
    }
    handleListenFunc()
    
  }, [isListening])

  

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, notes])
    setNotes('')
  }

  return (
    <>
        <img
              src="finalLogo.png"
              alt="Note"
            />
      <div className="container">
        <div className="box">
          <h2>Current Note  <button onClick={handleSaveNote} disabled={!notes}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button></h2>
          {isListening ? <span>Speak..</span> : <span>Click Start!</span>}
         <TextField className="inputField" id="standard-basic" variant="standard"
        value={notes}
        label=" "
        multiline={true}
        
        onChange={(e) => {
          setNotes(e.target.value);
        }}
      />
         
        </div>
        <div className="box">
          <h2>Saved Notes</h2>
          <div>
      <button
        type="button"
       
        onClick={handlePrintFunc}
      >
        {" "}
        Save as Pdf{" "}
      </button>
    
  
          {savedNotes.map(n => (
            <p key={n} ref={componentReference}>{n}</p>
          )) }
        </div>
      </div>
      </div>
    </>
    
  )
}


export default App
