import React, { useState, useEffect } from "react";
import { Board } from "./Board";
import { ResetButton } from "./ResetButton";
import { ScoreBoard } from "./ScoreBoard";
import {Dice} from "./Dice";
import './App.css';
import './Dice.css';
import { initializeApp } from "firebase/app";
import { getFirestore, updateDoc } from "firebase/firestore";
// import { getDatabase, ref, onValue} from "firebase/database";

import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics";


const App = () =>{
  const [playerOne, setPlayerOneBoard] = useState(Array(9).fill(null))
  const [playerTwo, setPlayerTwoBoard] = useState(Array(9).fill(null))
  const [playerXPlaying, setPlayerxPlayer] = useState(true)
  const [check, setCheck] = useState(false)
  const [die, setDie] = useState(Math.floor(Math.random() * 6 + 1))
  const IntialzeBoard = false; 

  const firebaseConfig = {
    apiKey: "AIzaSyBkt0D-cnJzFByMFBh7_yrbeerM_-wA8pU",
    authDomain: "coltbend-29196.firebaseapp.com",
    projectId: "coltbend-29196",
    storageBucket: "coltbend-29196.appspot.com",
    messagingSenderId: "270225133744",
    appId: "1:270225133744:web:70eab2be1f13fc0f32ab75",
    measurementId: "G-5CV2GTKP3Q"
  };
  

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);


  useEffect ( () => {
  const IntialzeBoard = async () =>{
    const docRef = doc(db, "Sessions", "234567890");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setPlayerOneBoard(doc.data().playerone)
      setPlayerTwoBoard(doc.data().playertwo)
      setDie(doc.data().die)
      setPlayerxPlayer(doc.data().playerXPlaying)
      alert(playerXPlaying);
      // setCheck(true);
    } else {
      // doc.data() will be undefined in this case
      await setDoc(doc(db, "Sessions", "234567890"), {
        playerone: playerOne,
        playertwo: playerTwo,
        die: die,
        finished: handleGameOver(), 
        PlayeroneName:  "ReadyPlayerOne", 
        playerXPlaying: true
        //TODO: 
        //PlayertwoName: "null", // TODO: Get player name 
  
      });
      console.log("Writing  data...");
    } 
  

  }


    IntialzeBoard(); 
  

},[])
  
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Sessions", "234567890"), (doc) => {
        console.log("Current Data: ", doc.data());
        console.log("PlayerTwo: ", doc.data().playertwo);
        console.log("Die: ", doc.data().die);
        console.log("GameOver: ", doc.data().finished);
        setPlayerOneBoard(doc.data().playerone)
        setPlayerTwoBoard(doc.data().playertwo)
        setDie(doc.data().die)
        setPlayerxPlayer(doc.data().playerXPlaying)
      }
  )
  }, [])

  const handleGameOver = () => {
    if (!playerOne.includes(null) || !playerTwo.includes(null)) {
      return true
    }
    return false
  }



  const handleBoxClickPlayerOne = (indx) => {
    //alert(playerXPlaying);
    const updateBoard = playerOne.map((value, index) => {
      if (index === indx && playerXPlaying === true) {
        update2(die, index);
        //setPlayerxPlayer(!playerXPlaying)
        //setDie(Math.floor(Math.random() * 6 + 1))
        return die;
      } else {
        return value;
      }
    })

    if (playerXPlaying){ 
    let diemove = Math.floor(Math.random() * 6 + 1); 
    const Ref = doc(db, "Sessions", "234567890" );
    updateDoc(  Ref, {
      playerone: updateBoard,
      playertwo: playerTwo,
      playerXPlaying: false,  
      die: diemove,
    });
  } 
    
  }


  const handleBoxClickPlayerTwo = (indx) => {
    //alert(playerXPlaying);
    const updateBoard = playerTwo.map((value, index) => {
      if (index === indx && playerXPlaying === false) {
        update1(die, index)
       // setPlayerxPlayer(!playerXPlaying)
      //  setDie(Math.floor(Math.random() * 6 + 1))
        
        return die;
      } else {
        return value;
      }
    })

    if (!playerXPlaying)
    {
    const  Ref = doc(db, "Sessions", "234567890" );
    let diemove = Math.floor(Math.random() * 6 + 1); 

    updateDoc(Ref, {
      playerone: playerOne,
      playertwo: updateBoard,
      playerXPlaying: true, 
      die: diemove
      
    });
  }


  }

  const resetBoard = () => {
    
    // setPlayerOneBoard(Array(9).fill(null));
    // setPlayerTwoBoard(Array(9).fill(null));
    // setDie(Math.floor(Math.random() * 6 + 1))
    const Ref = doc(db, "Sessions", "234567890" );
    let diemove = Math.floor(Math.random() * 6 + 1); 
    updateDoc(Ref, {
      playerone: Array(9).fill(null),
      playertwo: Array(9).fill(null),
      die: diemove,
      playerXPlaying: true
      
    });
    
  }

  const points = (board, index) => {
    
    const column = [board[index],board[index+3], board[index + 6]]
    
    if (column[0] === column[1] && column[0] === column[2]) {
      return column[0] * 9;
    }
    if (column[0] === column[2]) {
      return column[0] * 4 + column[1];
    }
    if (column[1] === column[2]) {
      return column[1] * 4 + column[0];
    }
    if (column[0] === column[1]) {
      return column[0] * 4 + column[2];
    } else {
      return column[0] + column[1] + column[2];
    }
  };
  
  const updateScore = () => {
    const calcScore = (player) => {
      return points(player, 0) + points(player, 1) + points(player, 2)
    }
    return({playerOne: calcScore(playerOne), playerTwo: calcScore(playerTwo)})
  }

  const sort = (board) => {
    function moveZerosToEnd(arr) {
      let nonNull = [];
      let Null = [];
      
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null) {
          Null.push(arr[i]);
        } else {
          nonNull.push(arr[i]);
        }
      }
      
      return nonNull.concat(Null);
    }
  
    const col0 = moveZerosToEnd([board[0],board[0+3],board[0+6]]);
    const col1 = moveZerosToEnd([board[1],board[1+3],board[1+6]]);
    const col2 = moveZerosToEnd([board[2],board[2+3],board[2+6]]);


    let combinedList1 = []
    for (let i = 0; i < 3; i++){
      combinedList1.push(col0[i], col1[i], col2[i]);
    }
    
    return combinedList1
  };
  
  const update1 = (roll, index) => {
    let i = index % 3;
    
    

    if (playerOne[i] === roll) {
      playerOne[i] = null;
    }
    if (playerOne[i + 3] === roll) {
      playerOne[i + 3] = null;
    }
    if (playerOne[i + 6] === roll) {
      playerOne[i + 6] = null;
    }
    sort(playerOne)
  }

  const update2 = (roll, index) => {
    let i = index % 3;
    
    

    if (playerTwo[i] === roll) {
      playerTwo[i] = null;
    }
    if (playerTwo[i + 3] === roll) {
      playerTwo[i + 3] = null;
    }
    if (playerTwo[i + 6] === roll) {
      playerTwo[i + 6] = null;
    }
    sort(playerTwo)
  }
  //  {WriteData()}

    return(

      <div>
        {handleGameOver() ? (
        <div className="GameOver">
          
          <ScoreBoard names={{playerOneName: "POne", playerTwoName: "PTwo"}} scores={updateScore()} playerXPlaying={playerXPlaying} />
          <Board name={"X"} board={playerOne} onClick={null}/>
          <h1 style={{fontSize: "30px", color: "red", background: "lightblue", textAlign: "center"}}>gameover</h1>
          <Board name={"O"} board={playerTwo} onClick={null}/>
          <ResetButton resetBoard={resetBoard} />
        </div>):
        (<div className="Game">
          <ScoreBoard names={{playerOneName: "POne", playerTwoName: "PTwo"}} scores={updateScore()} playerXPlaying={playerXPlaying} />
          <Board name={"X"} board={playerOne} onClick={handleBoxClickPlayerOne}/>
          <Dice roll={die} clicked={false}/>
          <Board name={"O"} board={playerTwo} onClick={handleBoxClickPlayerTwo}/>
          <ResetButton resetBoard={resetBoard} />
          
        </div>)}
      </div>
    )
  }

export default App;
