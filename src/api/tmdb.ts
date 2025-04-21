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

const API_KEY='e2c33959ddbb90f6f7d0d1f033c2b941';
const BASE_URL='https://api.themoviedb.org/3';


let cachedMovies: Movie[] =[]
let hasLoadedInitialMovies = false;
export async function loadPopularMovies(page:number=1, language:string="ru-RU",  forceReload: boolean = false):Promise<Movie[]> {

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