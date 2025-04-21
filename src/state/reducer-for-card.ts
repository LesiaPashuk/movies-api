import { CardType } from "../components/card/Card"
import {v1} from 'uuid';
import { produce } from 'immer';
export type initialState={
    cardList: Array<CardType>, 
    addCardButtonStatus:boolean,
    cardListHistory:Array<CardType>
    onlyFavoriteStatus:boolean, 
}
const initialState:initialState={
    cardListHistory:[],
    cardList:[],
    addCardButtonStatus:false,
    onlyFavoriteStatus:false, 
}
type removeCard={
    id:string,
    type:"remove-card"
}
type addCard={
    type:"add-card", 
    newTitle:string,
    content:string,
    imgPath:string,
    release_date:string,
    vote_average:number,
    original_language:string,
    original_title:string,
    favoriteStatus:boolean,
}
type changeFavoriteStatus={
    type:"change-favorite-status", 
    favoriteStatus:boolean,
    id:string,
}
type onlyFavorite={
    type:"onlyFavorite", 
}
type allMovies={
    type:"allMovies"
}
type sortVoteAverageMax={
    type:"sortVoteAverageMax"
}
type sortVoteAverageMin={
    type:"sortVoteAverageMin"
}
type ActionType=removeCard|addCard|changeFavoriteStatus|onlyFavorite|allMovies|sortVoteAverageMax|sortVoteAverageMin;

export const removeCardAC=(id:string):removeCard=>{
    return {id:id, type:"remove-card"}
}
export const addCardAC=(newTitle:string, content:string, imgPath:string,release_date:string,vote_average:number,original_language:string,original_title:string,favoriteStatus:boolean):addCard=>{
    return {type:"add-card", newTitle:newTitle, content:content, imgPath:imgPath, release_date:release_date,vote_average:vote_average, original_language:original_language, original_title:original_title, favoriteStatus:favoriteStatus}
}
export const changeFavoriteStatusAC=(favoriteStatus:boolean, id:string):changeFavoriteStatus=>{
    return {type:"change-favorite-status", favoriteStatus:favoriteStatus, id:id}
}
export const onlyFavoriteAC=():onlyFavorite=>{
    return {type:"onlyFavorite"}
}
export const allMoviesAC=():allMovies=>{
    return {type:"allMovies"}
}
export const sortVoteAverageMaxAC=():sortVoteAverageMax=>{
    return {type:"sortVoteAverageMax"}
}
export const sortVoteAverageMinAC=():sortVoteAverageMin=>{
    return {type:"sortVoteAverageMin"}
}
export const reducerForCard=(state:initialState=initialState, action:ActionType):initialState=>{
    switch(action.type){
        case "remove-card":
            return {...state, 
                cardList:state.cardList.filter(card=>card.id!==action.id),
                cardListHistory:state.cardListHistory.filter(card=>card.id!==action.id),
            }
        case "add-card":
            const newCard = {id: v1(), title:action.newTitle, favoriteStatus:action.favoriteStatus, content:action.content, imgPath:action.imgPath, release_date:action.release_date,vote_average:action.vote_average, original_language:action.original_language, original_title:action.original_title}
            return state.cardList.some(card=>card.original_title===action.original_title&&card.release_date===action.release_date)?
             state:
             {...state,
               cardList:[newCard,...state.cardList],
               cardListHistory:[newCard,...state.cardListHistory],
            }
        case "change-favorite-status":
            return {
                ...state, 
                cardList:!state.onlyFavoriteStatus?state.cardList.map(card=>
                    card.id===action.id?{
                        ...card, 
                        favoriteStatus:!card.favoriteStatus
                    }:card
                ):state.cardList.map(card=>
                    card.id===action.id?{
                        ...card, 
                        favoriteStatus:!card.favoriteStatus
                    }:card
                ).filter(card=>card.favoriteStatus===true),
                cardListHistory:state.cardListHistory.map(card=>
                    
                    card.id===action.id?{
                        ...card, 
                        favoriteStatus:!card.favoriteStatus
                    }:card)
            }
        case "onlyFavorite":
            return {
                ...state, 
                cardList: state.cardListHistory.filter(card=>card.favoriteStatus===true),
                onlyFavoriteStatus:true, 
            }
        case "allMovies":
            return {
                    ...state, 
                    onlyFavoriteStatus:false, 
                    cardList:state.cardListHistory, 
                }
        case "sortVoteAverageMax":
            return  {
                ...state, 
                cardList:[...state.cardListHistory]
                .sort((a, b)=>b.vote_average - a.vote_average)
                .filter((card , index , self) => 
                index ===self.findIndex(c=>
                    c.title===card.title&&
                    c.release_date===card.release_date
                ))
            }
            case "sortVoteAverageMin":
                return  {
                    ...state, 
                    cardList:[...state.cardListHistory]
                    .sort((a, b)=>a.vote_average - b.vote_average)
                    .filter((card , index , self) => 
                    index ===self.findIndex(c=>
                        c.title===card.title&&
                        c.release_date===card.release_date
                    ))
                }
        default:
            return state;
    }

}