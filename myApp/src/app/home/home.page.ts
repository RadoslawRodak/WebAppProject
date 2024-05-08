import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent,IonList,IonItem, IonSkeletonText, IonAvatar, IonAlert,IonLabel,IonBadge, IonInfiniteScroll,IonInfiniteScrollContent, IonSearchbar, IonIcon, IonButton, IonButtons} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {addIcons} from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Storage } from '@ionic/storage-angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSkeletonText, IonAvatar, IonAlert, IonLabel,DatePipe, RouterModule,IonBadge,IonInfiniteScroll,IonInfiniteScrollContent,IonSearchbar,IonIcon,IonButton, IonButtons,],
})
export class HomePage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public query: any[] = [];




  constructor(private storage: Storage) {
    //add the star icons
    addIcons({star, starOutline});
    
    //load the search query
    this.loadSearchQuery();

    

    

  }

  async openBrowser() {
    await Browser.open({ url: 'https://www.imdb.com/'
    });
    };

    //load the saved search query
   
   
    //load the movies from the storage
    async loadSearchQuery() {
      const storage = await this.storage.create();
      const storedFilms = await storage.get('query');

      if(storedFilms) {
        this.movies = storedFilms;
      }

      //if the storage is empty, load the trending movies
      if(storedFilms == 0) {
        this.loadMovies();
        console.log("Storage is empty");
      }
      
    }

    
    //save the movies to the storage that showed after user typed in the search bar
    async save() {
      await this.storage.set('query', this.movies);
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

  //search for movies and save the search query
  
  searchMovies(event: CustomEvent) {
    //create the storage
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

      } );



    } else {
      this.loadMovies();
    }

    //refresh the movies list when the search bar is cleared
    if(!query) {
    this.movies = [];
    this.currentPage = 1;
    this.loadMovies(); 
    }  

    //save the search query and store the search results
    this.save();


    }  
}
 


  


