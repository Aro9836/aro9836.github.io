const Button = document.querySelector('Button');
const QuoteText = document.getElementsByClassName('QuoteText');
const Author = document.getElementsByClassName('QuoteAuthor');

console.log ();
console.log (Author);
Button.addEventListener('click', function() {  
    console.log('Button was clicked');
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
        console.log(`${data.content} —${data.author}`);
        QuoteText[0].innerHTML = data.content;
        Author[0].textContent = data.author;
        })
        .catch(error => console.error(error));


    });