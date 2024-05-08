import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable,} from 'rxjs';
import { ApiResult, MovieResult } from './interfaces';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  save(query: string) {
    throw new Error('Method not implemented.');
  }
  loadSearchQuery() {
    throw new Error('Method not implemented.');
  }
  saveSearchQuery(query: string) {
    throw new Error('Method not implemented.');
  }

  //inject the HttpClient service
  private http = inject(HttpClient);
  constructor() { }

  //get the trending movies
  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/movie/popular?page=${page}&api_key=${API_KEY}`);
  }

  //get the movie details
  getMovieDetails(id: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  }

  //sort movies based on rating 
  getBestMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/movie/top_rated?page=${page}&api_key=${API_KEY}`);
  }

  // updated implementation of searchMovies method
  searchMovies(query: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}`);
  }
}
