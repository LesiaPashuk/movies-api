import React, { useCallback } from "react";
import { useMemo } from "react";
import { changeFavoriteStatusAC } from "../../state/reducer-for-card";
import '/фронт/alfaTest/src/components/card/card.css'
import { Link, Navigate } from "react-router-dom";
export type CardType={
    id:string,
    title:string,
    content:string,
    favoriteStatus:boolean,
    imgPath:string,
    release_date:string,
    vote_average:number,
    original_language:string,
    original_title:string,
}
export type PropsType={
    id:string,
    title:string,
    content:string,
    favoriteStatus:boolean,
    imgPath:string,
    release_date:string,
    vote_average:number,
    original_language:string,
    original_title:string,
    removeCard:(id:string)=>void,
    addCard:(title:string, content:string, imgPath:string,release_date:string,vote_average:number,original_language:string,original_title:string,favoriteStatus:boolean)=>void,
    changeFavoriteStatus:(favoriteStatus:boolean, id:string)=>void
    onlyFavorite:()=>void
}

export const Card= React.memo(function Card(props:PropsType){
   const removeCard=useCallback(()=>{
    props.removeCard(props.id)
   },[props.removeCard, props.id])
   const changeFavoriteStatus=useCallback(()=>{
    props.changeFavoriteStatus(props.favoriteStatus,props.id)
   },[props.changeFavoriteStatus, props.changeFavoriteStatus, props.id])
    return <>
    <div className="card"> 
       

        
        <div className ="favoriteIcon"onClick={changeFavoriteStatus}>
            {props.favoriteStatus?(  <img className="favoriteIconIMG"src="https://img.icons8.com/?size=45&id=85339&format=png&color=a50606" alt="favoriteIcon" />):(  <img className="favoriteIconIMG" src="https://img.icons8.com/?size=45&id=85339&format=png&color=939393" alt="favoriteIcon" />)}
       <div className="closeIcon"onClick={removeCard}>
        <img src="https://img.icons8.com/?size=43&id=23537&format=png&color=939393"/></div>
        </div>
        <Link to={`${props.id}`} key={props.id}>
        <div className="divForImgCard"> <img className="imgCard"src={props.imgPath}></img>
        <div className="infoDiv">
            <h3>{props.title}</h3>
        <h3>Рейтинг: {props.vote_average} ★</h3>
        <h3>Дата выхода: {props.release_date}</h3>
      
        </div></div>
        
        </Link>
       
        
    </div>
    
    </>
})