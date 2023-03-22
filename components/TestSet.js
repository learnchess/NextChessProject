import React, { useState, useCallback } from "react";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Button, Typography, ThemeProvider } from "@mui/material";
import { Chess, SQUARES } from "chess.js";
import theme from "../components/Theme";
import {useRouter} from 'next/router'
import dynamic from 'next/dynamic'
import {useMutation} from 'react-query'

const Chessground = dynamic(
  () => import('@react-chess/chessground'),
  { ssr: false }
);

const firstPuzzleFen = "8/5p2/5N2/5p2/1p3P2/3k3p/P2r2r1/3RR2K w - - 3 42";
const firstPuzzleOrig = "Rg1";

//puzzle 2
const secondPuzzleFen =
  "r4rk1/1p3pp1/p2p1n1p/3P4/1P1Q1Bqn/P1N5/2B2PPP/2R1R1K1 w - - 0 1";
const secondPuzzleOrig = "g3";
//puzzle 3
const thirdPuzzleFen =
  "rn1qr1k1/ppp3pp/6b1/5p2/1bPP3P/4BP2/1P1NQ1P1/2KR1B1R w - - 0 1";
const thirdPuzzleOrig = "Qd3";
//puzzle 4
const fourthPuzzleFen = 
  "r1b1r1k1/pp2bppp/1qn2n2/3p4/2pP4/2P1BN1P/PPBQ1PP1/RN3RK1 b - - 0 1";
  const fourthPuzzleOrig = "Qxb2";

let puzzleStatus = 1;

const chess = new Chess(firstPuzzleFen);
let fenNoUpdate = firstPuzzleFen;
let origMove = firstPuzzleOrig;
let orientationColor = "black";
let firstRun = 1;
let incorrectPuzzle = false;
let numCorrect = 0;
let move = 1;
let level = [1, -1, [-1, -1, -1, -1]]

async function createUserRequest(userData) {
  const settings = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({user: userData})
 };
 try {
  const response = await fetch("/api/users/create", settings);
  const data = await response.json();
  return data;
 } catch(e) {
    return e;
 }
}

function TestSet() {

  const mutation = useMutation(createUserRequest 
    //     {
    //     onMutate: async sightingData => {
    //     //1) cancel queries
    //     await queryClient.cancelQueries("sightings");
    
    //     //2 save snapshot
    //     const previousSightings = queryClient.getQueryData("sightings");
        
    //     //3 optimistically update cache
    //     queryClient.setQueryData("sightings", old => [...(old || []), sightingData]);
    //     runFrame(!frame)
    //     //4 return rollback function which reset cache back to snapshot
    //     return {previousSightings};
    //   },
    //   onError: (err, sightingData, rollback) => rollback(),
    //   onSettled: () => queryClient.invalidateQueries("sightings"),
    // }
    );

    const router = useRouter();
    const [frame, runFrame] = useState(false);
    const [showButton1, setShowButton1] = useState(false);
    const [showButton2, setShowButton2] = useState(false);
    const [showNoClueButton, setShowNoClueButton] = useState(true);
    const [showNextPuzzleMove, setShowNextPuzzleMove] = useState(false);

    const firstPuzzleMove = () => {
      // setTimeout(() => {
      chess.move(origMove);
      fenNoUpdate = chess.fen();
      runFrame(!frame);
      // }, 1000);
    };
    if (firstRun === 1) {
      firstRun++;
      firstPuzzleMove();
    }

    const NoClueButton = () => (
      <div className="button">
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            sx={{ bgcolor: "text.light" }}
            onClick={onClickNoClueButton}
          >
            I Don&apos;t Know
          </Button>
        </ThemeProvider>
      </div>
    );
    const Button1 = () => (
      <div className="button">
        <Button variant="contained" color="success" onClick={onClickButton1}>
          Continue
        </Button>
      </div>
    );

    const Button2 = () => (
      <div className="button">
        <Button variant="contained" color="error" onClick={onClickButton2}>
          Try Again.
        </Button>
      </div>
    );

    const onClickNoClueButton = () => {
      //bug occuring: on two move puzzles, if you click i don't know after the first move nothing happens.
      level[1]=numCorrect
      if (puzzleStatus === 1) {
        level[2] = [0, 0, 0, 0]
      }
      else if(puzzleStatus===2) {
        level[2][1] = 0
        level[2][2] = 0
        level[2][3] = 0
      }
      else if(puzzleStatus===3) {
        level[2][2] = 0
        level[2][3] = 0
      }
      else if(puzzleStatus===4) {
        level[2][3] = 0;
        onTestCompletion();
        router.push("/dashboard");
      }
      incorrectPuzzle=true;
      onClickButton1();

    };

    const onClickButton1 = () => {

      if (puzzleStatus !== 4) {
        move = 1;
        if (puzzleStatus === 1) {
          if (incorrectPuzzle === false) {
            level[2][0] = 1;
            numCorrect++;
          } else {
            incorrectPuzzle=false;
            level[2][0] = 0;
          }
          fenNoUpdate = secondPuzzleFen;
          origMove = secondPuzzleOrig;
          orientationColor="black";
        } else if (puzzleStatus === 2) {
          if (incorrectPuzzle === false) {
            numCorrect++;
            level[2][1] = 1;
          } else {
            incorrectPuzzle=false;
            level[2][1] = 0;
          }
          fenNoUpdate = thirdPuzzleFen;
          origMove = thirdPuzzleOrig;
          orientationColor="black";
        }
        else if (puzzleStatus === 3) {
          if (incorrectPuzzle === false) {
            numCorrect++;
            level[2][2] = 1;
          } else {
            level[2][2] = 0;
            incorrectPuzzle=false;
          }
          fenNoUpdate=fourthPuzzleFen;
          origMove = fourthPuzzleOrig;
          orientationColor="white";
        }
        chess.load(fenNoUpdate);
        //setTimeout
        firstPuzzleMove(origMove);
        setShowNoClueButton(true);
      
      }
      else if(puzzleStatus===4) {
          if (incorrectPuzzle === false) {
            numCorrect++;
            level[2][3] = 1;
          } else {
            level[2][3] = 0;
            incorrectPuzzle=false;
          }
        level[1] = numCorrect;
        onTestCompletion();
        router.push("/dashboard")
      }
      

      puzzleStatus++;
      setShowButton1(false);
    };
    const onClickButton2 = () => {
      incorrectPuzzle = true;
      chess.undo();
      fenNoUpdate = chess.fen();
      setShowButton2(false);
      setShowNoClueButton(true);
    };

    const checkOneMovePuzzle = (theMove, theCorrectMove) => {
      if (theMove === theCorrectMove) {
        setShowButton1(true);
        setShowNoClueButton(false);
      } else {
        setShowButton2(true);
        setShowNoClueButton(false);
      }
    };
    const checkTwoMovePuzzle = (
      theMove,
      correctFirstMove,
      theResponse,
      correctSecondMove
    ) => {
      if (move === 1) {
        if (theMove === correctFirstMove) {
          chess.move(theResponse);
          fenNoUpdate = chess.fen();
          move++;
          setShowNextPuzzleMove(true);
        } else {
          setShowButton2(true);
          setShowNoClueButton(false);
        }
      } else if (move === 2) {
        setShowNextPuzzleMove(false);
        if (theMove === correctSecondMove) {
          setShowButton1(true);
          setShowNoClueButton(false);
        } else {
          setShowButton2(true);
          setShowNoClueButton(false);
        }
      }
    };

    const squaros = SQUARES;
    const turnColor = chess.turn() === "w" ? "black" : "white";
    const toDests = (chess) => {
      const dests = new Map();
      squaros.forEach((s) => {
        const ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
          dests.set(
            s,
            ms.map((m) => m.to)
          );
      });
      return dests;
    };

    const handleMove = (from, to) => {
      let newMove = chess.move({ from, to });
      fenNoUpdate = chess.fen();
      if (puzzleStatus === 1) {
        checkOneMovePuzzle(newMove.san, "Rh2#");
      } else if (puzzleStatus === 2) {
        checkTwoMovePuzzle(newMove.san, "Nf3+", "Kg2", "Nxd4");
      } else if (puzzleStatus === 3) {
        checkOneMovePuzzle(newMove.san, "f4");
      }
      else if(puzzleStatus===4) {
        checkTwoMovePuzzle(newMove.san, "Bxh7+", "Kxh7", "Qxb2");
      }
      runFrame(!frame);
    };

    const onTestCompletion = React.useCallback(() => {
      mutation.mutate({
        level1: 1,
        level2: level[1],
        level3: level[2][0],
        level4: level[2][1],
        level5: level[2][2],
        level6: level[2][3]
      })
    }, [mutation]);

    return (
      <div className="container4">
        <ThemeProvider theme={theme}>
          <div className="item">
            <Chessground className="ground"
              width={600}
              height={600}
              config={{
                fen: fenNoUpdate,
                orientation: orientationColor,
                movable: {
                  // color: turnColor==='w' ? 'white' : "black",
                  free: false,
                  dests: toDests(chess),
                  showDests: true,
                },
                draggable: {
                  showGhost: true,
                  deleteOnDropOff: false,
                },
                events: {
                  move: handleMove,
                },
                drawable: {
                  defaultSnapToValidMove: false,
                  enabled: true,
                  visible: true,
                  eraseOnClick: false,
                },
              }}
            />
          </div>
          <div className="button-text">
            <div className="anItem">
              {orientationColor === "white" ? (
                <Typography variant="h3" color="greenShades.title">
                  White To Move
                </Typography>
              ) : (
                <Typography variant="h3" color="greenShades.title">
                  Black To Move
                </Typography>
              )}
              {showButton1 ? <Button1 /> : null}
              {showButton2 ? <Button2 /> : null}
              {showNoClueButton ? <NoClueButton /> : null}

              {puzzleStatus === 1 &&
              showButton1 === false &&
              showButton2 === false &&
              incorrectPuzzle === false ? (
                <div className="introText">
                  <Typography variant="h6" color="text.TestFirstQuestion">
                    What&apos;s the best move in this position? If you have no idea
                    what this is, just click I don&apos;t know. Don&apos;t spend more than
                    a minute or two per position.
                  </Typography>
                </div>
              ) : null}
              {showNextPuzzleMove ? (
                <div className="nextPuzzle">
                  <Typography color="green" variant="h6">
                    Correct! Can you find the next move?
                  </Typography>
                </div>
              ) : null}
            </div>
          </div>
        </ThemeProvider>
      </div>
    );
  }

  export default TestSet;