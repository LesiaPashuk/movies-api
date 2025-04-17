import axios,{AxiosError, AxiosResponse} from "axios";
interface Movie {
    id:number;
    title:string;
    overview:string;
    poster_path:string;
    release_date:string;
    vote_average:number;
    original_language:string;
    original_title:string;
}
interface ApiResponse{
    page:number;
    results:Movie[]
    total_pages:number;
    total_results:number;
}

  //"request_token":"309f10d01e45e155d8d6753daf922e161a7716aa"

const API_KEY='e2c33959ddbb90f6f7d0d1f033c2b941';
const BASE_URL='https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const accountId='21945639'
const session_id= "dc296173250c109e04a58ff7f25dc730c748c790";
const CACHE_EXPIRATION_TIME = 45 * 60 *60* 1000;

//const movieCache= new Map<string, {data: Movie[]; timestamp:number}>()
let cachedMovies: Movie[] =[]
let hasLoadedInitialMovies = false;
export async function loadPopularMovies(page:number=1, language:string="ru-RU",  forceReload: boolean = false):Promise<Movie[]> {
  //  const cacheKey=`movies_${page}_${language}`
  //  const cachedData=movieCache.get(cacheKey);
    if(hasLoadedInitialMovies&& !forceReload)
        return cachedMovies
    try{
        const response:AxiosResponse<ApiResponse>=await axios.get( `${BASE_URL}/movie/popular`,
        {
            params:{
                api_key: API_KEY,
                page,
                language,
            },
            
        }
    ); 
  if(!hasLoadedInitialMovies||forceReload){
   cachedMovies=response.data.results;
   hasLoadedInitialMovies=true
}
    return cachedMovies;
    }
   catch(error){
    const AxiosError = error as AxiosError;
    console.log('ошибочка ', AxiosError.message);
    if (cachedMovies.length>0) {
        console.warn('Используются устаревшие данные из кеша');
        return cachedMovies;
    }
    alert("Данные с сервера недоступны в вашей стране. Используйте ВПН")
    throw new Error("не удалось загрузить фильм")
   }
}