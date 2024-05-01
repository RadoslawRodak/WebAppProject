import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent,IonList,IonItem, IonSkeletonText, IonAvatar, IonAlert,IonLabel,IonBadge, IonInfiniteScroll,IonInfiniteScrollContent, IonSearchbar, IonIcon, IonButton, IonButtons} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {addIcons} from 'ionicons';
import { star, starOutline } from 'ionicons/icons';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSkeletonText, IonAvatar, IonAlert, IonLabel,DatePipe, RouterModule,IonBadge,IonInfiniteScroll,IonInfiniteScrollContent,IonSearchbar,IonIcon,IonButton, IonButtons],
})
export class HomePage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor() {
    //add the star icons
    addIcons({star, starOutline});

    //load the trending movies
    this.loadMovies();
  }

  //load the trending movies
  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;
   
    //show the loading spinner when the page is loading
    if(!event) {
      this.isLoading = true;
    }

    //get the trending movies
    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if(event) {
          event.target.complete();

        }
      }),

      //handle any errors that occur
      catchError((err: any) => {
        console.log(err);
        this.error = err.error.status_message;
        return [];
      })
    ).subscribe(
      {
        //add the movies to the list
        next: (res) => {
          console.log(res);
          this.movies.push(...res.results);
          if(event){
            event.target.disabled = res.total_pages === this.currentPage;
          }
        }
      }
    )
  }

  //load more movies when the user scrolls to the bottom of the page
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);   
  }  

  //search for movies
  searchMovies(event: CustomEvent) {
    const query = (event.target as HTMLInputElement).value;
    if(query) {
      this.movieService.searchMovies(query).subscribe({
        next: (res) => {
          this.movies = res.results;
        },
        error: (err) => {
          console.log(err);
          this.error = err.error.status_message;
        }
      });
    } else {
      this.loadMovies();
    }

    //refresh the movies list when the search bar is cleared
    if(!query) {
    this.movies = [];
    this.currentPage = 1;
    this.loadMovies(); 
    }  
    }    
  }
 


  


