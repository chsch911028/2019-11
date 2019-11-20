import React, { useState, useEffect }from 'react';
import styled from 'styled-components';
import { CardContainer } from '../../components';
import { populars, deadlines } from '../../mock';

const MainStyle = styled.div`
  display: flex;
  font-family: 'BMJUA';
  width: 100%;
  flex-direction: column;
  justify-content: center;
  .category {
    display: flex;
    font-size: xx-large;
    justify-content: flex-start;
    padding-left:10rem;
  }
`;

const Main = () => {
  const [popular, setPopular] = useState([]);
  const [deadline, setDeadline] = useState([]);

  const getPopularList = () => {
    // fetch('/mock/popular-items/popular-items.json')
    // .then(result => result.json())
    // .then(result => setPopular(result))
    setPopular(populars);
  }

  const getDeadLineList = () => {
    // fetch('/mock/deadline-items/deadline-items.json')
    // .then(result => result.json())
    // .then(result => setDeadline(result))
    setDeadline(deadlines);
  }

  useEffect(() => {
    getPopularList();
    getDeadLineList()
  },[])

  return (
    <MainStyle>
      <CardContainer items={popular} title={"HOT - 인기 경매 상품"}/>
      <CardContainer items={deadline} title={"HURRY UP - 마감 임박 경매 상품"}/>
    </MainStyle>
  )
}

export default Main;