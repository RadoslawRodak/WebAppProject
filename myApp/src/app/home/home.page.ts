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
  public dummyArray = new Array(5);

  constructor() {

    addIcons({star, starOutline});
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;
   
    if(!event) {
      this.isLoading = true;
    }

    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if(event) {
          event.target.complete();

        }
      }),
      catchError((err: any) => {
        console.log(err);
        this.error = err.error.status_message;
        return [];
      })
    ).subscribe(
      {
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


  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);   
  }  

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
  }
 
}

  


