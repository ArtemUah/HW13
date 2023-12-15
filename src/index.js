import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector('.search-form');
const submitBtn = document.querySelector('button')
const axios = require('axios').default;
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard')
let counter = 1;

async function callback(entries, observer) {
    entries.forEach(async entry => {
        if(entry.isIntersecting){
            counter +=1;
            const data = await getPictures(searchForm.searchQuery.value);
            const markup = await createMarkup(data.data.hits);
            gallery.insertAdjacentHTML('beforeend', markup);
            
            if(counter === data.data.totalHits/20){
                observer.unobserve(target);
                Notify.failure("We're sorry, but you've reached the end of search results.")
            }
        } 
    });

};
let options = {
        root: null,
        rootMargin: "200px",
        threshold: 1.0,
      };
  
submitBtn.addEventListener('click', handlerOnClick);

async function handlerOnClick (e){
    // counter = 1;
    e.preventDefault();
    const data = await getPictures(searchForm.searchQuery.value);
    const markup = await createMarkup(data.data.hits);
    gallery.innerHTML = await markup;
    
    if(data.data.totalHits){
        Notify.success(`Hooray!We found ${data.data.totalHits} images`);
    } else {
        Notify.failure('Sorry, there are no images matching your search query. Please try again');
    };
    let observer = new IntersectionObserver(callback, options);
    observer.observe(target);
}

async function getPictures (value){
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '33846839-b5c9af3d8a613bdc4bbe809f4';
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type='photo'&orientation='horizontal'&safesearch='true'&page=${counter}&per_page=20`);
        return response;
    } catch (error){
        console.log(error)
    }
};

async function createMarkup (arr){
const response = await arr.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
    return `<a class="photo-card" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
    </a>`
}).join('');
return response;
};

gallery.addEventListener('click', onClick)
function onClick(e){
    e.preventDefault();
    if(e.target.closest('a').classList.contains('photo-card')){
        console.log('hello');
        let gallery = new SimpleLightbox('.gallery a', {
            captionSelector: 'img',
            captionDelay: 200,
            overlayOpacity: 0.9,
        });
            }
}