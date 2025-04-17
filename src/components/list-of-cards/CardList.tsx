import React, { useCallback, useEffect, useState } from "react";
import { Card, CardType } from "../card/Card";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../../store/store";
import { createSelector } from "@reduxjs/toolkit";
import {addCardAC, allMoviesAC, changeFavoriteStatusAC, onlyFavoriteAC, removeCardAC,  sortVoteAverageMaxAC,  sortVoteAverageMinAC} from '../../state/reducer-for-card'
import { loadPopularMovies } from "../../api/tmdb";
import { Link } from "react-router-dom";
export type CardListType={
    cardList: Array<CardType>,
}
export const CardList = React.memo(function(){
    const dispatchCard =useDispatch();
    const selectCardList=(state:RootStateType)=>state.cards.cardList;
    const selectCardListHistory=(state:RootStateType)=>state.cards.cardListHistory;
    const memorizedCardList= createSelector(
        [selectCardList],
        (card)=>card
    )
    const memorizedCardListHistory = createSelector(
        [selectCardListHistory],
        (card)=>card
    )
    const cardList=useSelector(memorizedCardList);
    const cardListHistory=useSelector(memorizedCardListHistory)
    const[hasInitialLoad, setHasInitialLoad]=useState(false)

    const addCard=useCallback((title:string, content:string, imgPath:string,release_date:string,vote_average:number,original_language:string,original_title:string, favoriteStatus:boolean)=>{
        const action = addCardAC(title, content, imgPath, release_date, vote_average, original_language, original_title, favoriteStatus);
        dispatchCard(action)
    },[dispatchCard])
    const removeCard=useCallback((id:string)=>{
        const action = removeCardAC(id);
        dispatchCard(action);
    },[dispatchCard])
    const changeFavoriteStatus=useCallback((favoriteStatus:boolean, id:string)=>{
        const action = changeFavoriteStatusAC(favoriteStatus, id)
        dispatchCard(action)
    }, [dispatchCard])
    const onlyFavorite= useCallback(()=>{
        const action = onlyFavoriteAC()
        dispatchCard(action);
    }, [dispatchCard])
    const allMovies=useCallback(()=>{
        const action =allMoviesAC()
        dispatchCard(action)
    }, [dispatchCard])
    const sortVoteAverageMin=useCallback(()=>{
        const action=sortVoteAverageMinAC();
        dispatchCard(action)
    }, [dispatchCard])
    const sortVoteAverageMax=useCallback(()=>{
        const action=sortVoteAverageMaxAC();
        dispatchCard(action)
    }, [dispatchCard])

    useEffect(()=>{
        if(!hasInitialLoad){
        loadPopularMovies()
      
    .then(movies=>{
          if (cardList.length === 0 && cardListHistory.length === 0) {
        movies.forEach(movie=>{
            dispatchCard(addCardAC(movie.title, movie.overview, `https://image.tmdb.org/t/p/w500${movie.poster_path}`, movie.release_date, movie.vote_average, movie.original_language, movie.original_title, false))
        });
    }
        setHasInitialLoad(true)
    });
}
    }, [dispatchCard, hasInitialLoad, cardList.length])
    
    return <>
   <Link to='/create-card'>
   <button type="button"  className="
    absolute top-5 right-5
    w-[170px] h-11
    bg-[#a50606] hover:bg-white  
    text-white hover:text-[#a50606]
    rounded-full
    flex items-center justify-center
    transition-colors
  ">+ Добавить фильм</button></Link>
        <select name="sort" id="sortType"
        className="
        block
        w-full
        md:w-28
        ml-2
        mb-6
        px-4
        py-2
        text-base
        text-gray-700
        bg-[#e6e6e6]
        border
        border-gray-300
        rounded-md
        shadow-sm
        focus:outline-none
        focus:ring-2
        transition
        duration-150
        ease-in-out
        appearance-none
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')]
        bg-no-repeat
        bg-[center_right_1rem]
        bg-[length:1.5rem_1.5rem]
        cursor-pointer
      "
        onChange={(e:React.ChangeEvent<HTMLSelectElement>)=> {
            switch(e.target.value){
                case "onlyFavorite":
                    return onlyFavorite()
                case "allCards":
                    return allMovies()
                case "min":
                    return sortVoteAverageMin()
                case 'max':
                    return sortVoteAverageMax()
                default:
                    return allMovies()
            }
        }}>
             
            <option className="text-gray-700" value="allCards" >Все</option>
            <option className="text-gray-700" value="onlyFavorite">Избранное</option>
            <option  className="text-gray-700" value="min">Оценка по возрастанию</option>
            <option className="text-gray-700" value="max">Оценка по убыванию</option>
        </select>
     
    
    <div className='flex flex-row flex-wrap  gap-3 p-2'>{
        cardList.map((card)=>{
            return (
                <Card key={card.id}
                id={card.id}
                title={card.title}
                content={card.content}
                imgPath={card.imgPath}
                favoriteStatus={card.favoriteStatus}
                release_date={card.release_date}    
                vote_average={card.vote_average}
                original_language={card.original_language}
                original_title={card.original_title}
                removeCard={removeCard}
                addCard={addCard}
                changeFavoriteStatus={changeFavoriteStatus}
                onlyFavorite={onlyFavorite}
                
                ></Card>
            )
        })
    }</div>
    </>
})
