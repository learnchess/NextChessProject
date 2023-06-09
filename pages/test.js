import React, { useState } from "react";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Button, IconButton, Typography, ThemeProvider, Stack, Container } from "@mui/material";
import Chessground from "@react-chess/chessground";
import { Chess, SQUARES } from "chess.js";
import { DoneOutline, Close, LocalHospitalTwoTone } from "@mui/icons-material";
import {useRouter} from 'next/router'
import theme from "../components/Theme";
import dynamic from 'next/dynamic'

const TestSet = dynamic(
  () => import('../components/TestSet'),
  { ssr: false }
);


//const newPlayer = localStorage.getItem('newPlayer');
//// Assuming the current URL is '/firstPage'
// const newPlayer = true;
// const nextPageUrl = `/secondPage?newPlayer=${newPlayer}`;
// router.push(nextPageUrl);

let level = [true, 0, [0, 0, 0, 0, 0, 0, 0]]
//

export function Test() {

  const router = useRouter();
  
  const [showQuestion1, setShowQuestion1] = useState(true);
  const [showTestSet, setShowTestSet] = useState(false);
  
  const Next = (s) => {
    if (s === "new") {
      // localStorage.setItem('newPlayer', true)
      // localStorage.setItem('newPlayer', true)
      localStorage.clear();
      localStorage.setItem('level', JSON.stringify(level))
      router.push({      
      pathname: '/dashboard',
      query: { newPlayer: 'true' },})
    } else if (s === "not new") {
      // localStorage.setItem('newPlayer', false)
      // localStorage.setItem('newPlayer', false)
      localStorage.clear();
      setShowQuestion1(false);
      setShowTestSet(true);
    } else {
      alert("please click one of the options");
    }
  };

  const Question = () => {
    return (
      <div className="testFirstQuestion">
        <ThemeProvider theme={theme}>
          <Typography
            className="sectionPart"
            color="greenShades.title"
            variant="h3"
          >
            Welcome to ChessMadeBetter!
          </Typography>
          <Typography
            className="sectionPart"
            color="text.testFirstQuestion"
            variant="h5"
          >
            Are you new to chess?
          </Typography>
          <Typography
            className="sectionPart"
            color="text.testFirstQuestion"
            variant="inherit"
          >
            If you know the rules, say no. If you don&apos;t know the rules or need a
            refresher, say yes.
          </Typography>
          <div className="button5">
            <Button
              className="sectionPart section2Part"
              color="success"
              variant="outlined"
              startIcon={<DoneOutline />}
              onClick={() => Next("new")}
            >
              Yes
            </Button>
            <Button
              className="sectionPart section2Part"
              color="error"
              variant="outlined"
              startIcon={<Close />}
              onClick={() => Next("not new")}
            >
              No
            </Button>
          </div>
        </ThemeProvider>
      </div>
    );
  };

  return (
    <div className="page">
      {showQuestion1 ? <Question /> : null}
      {showTestSet ? <TestSet /> : null}
    </div>
  );
}

export default Test;