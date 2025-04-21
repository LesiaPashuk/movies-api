import React, { useCallback } from "react";
import { CardType, PropsType } from "../card/Card";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { RootStateType } from "@/store/store";
import { string } from "zod";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "/фронт/alfaTest/src/components/infoCard/infoCard.css";
import { changeFavoriteStatusAC } from "/фронт/alfaTest/src/state/reducer-for-card";


export const InfoCard = React.memo(function InfoCard(props: PropsType) {
  const { id } = useParams<{ id: string }>();
  const selectCardList = (state: RootStateType) => {
    return state.cards.cardList; 
  };
  const memorizedCardList = createSelector([selectCardList], (card) => card);
  const cardList = useSelector(memorizedCardList);
  const myCard = cardList.find((el) => el.id === id);
  const dispatch = useDispatch();

  const changeFavoriteStatus= useCallback(()=>{
    if(myCard){
    const action = changeFavoriteStatusAC(myCard.favoriteStatus, myCard?.id)
  dispatch(action)
  }
   },[])
 
  return (
    <>
    <div
            className="favoriteIconInfo"
            onClick={ changeFavoriteStatus
}
          >
            {myCard?.favoriteStatus ? (
              <img
                className="favoriteIconIMGInfo"
                src="https://img.icons8.com/?size=45&id=85339&format=png&color=a50606"
                alt="favoriteIcon"
              />
            ) : (
              <img
                className="favoriteIconIMGInfo"
                src="https://img.icons8.com/?size=45&id=85339&format=png&color=939393"
                alt="favoriteIcon"
              />
            )}
           
          </div> 
        <Link to='/'><div className="closeIconInfo" >
              <img src="https://img.icons8.com/?size=43&id=23537&format=png&color=939393"  />
            </div></Link> 
      <div className="cardInfo">
        <img src={myCard?.imgPath}></img>
        
          
       
        <div className="infoText">
          <h1>{myCard?.title}</h1>
          <h3>Оригинальное название: {myCard?.original_title}</h3>
          <h3>Язык оригинала: {myCard?.original_language}</h3>
          <h3>Дата выхода: {myCard?.release_date}</h3>
          <h3>Оценка: {myCard?.vote_average} ★</h3>
          <h2>Описание</h2>
          <p>{myCard?.content}</p>
        </div>
      </div>
    </>
  );
});
