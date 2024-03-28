const books = [];
const STORAGE_KEY = 'STORAGE_KEY';
function isStorageExist(){
    if (typeof(Storage) !== undefined){
        return true;
    } else {
        alert('Browser kamu tidak mendukung Web Storage. Silahkan gunakan browser yang mendukung.');
        return false;
    }
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
        for (const dataItem of data) {
            books.push(dataItem);
        }
    } 
    renderEvent(books);
}

function generateObject(id, title, author, year, IsComplete){
    return {
        id,
        title,
        author,
        year,
        IsComplete
    }
}

function findBook(bookId){
    for (const bookItem of books){
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
    return null
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBook(bookObject){
    const {id, title, author, year, IsComplete} = bookObject;
    
    const textTitle = document.createElement('h4');
    textTitle.innerText = title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;

    const textYear = document.createElement('p');
    textYear.innerText = year;

    const buttonMove = document.createElement('button');
    buttonMove.classList.add('button', 'button-move');

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('button', 'button-delete');
    buttonDelete.innerText = 'Hapus buku';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.append(buttonMove,buttonDelete);
    
    const container = document.createElement('div');
    container.classList.add('box-book');
    container.append(textTitle,textAuthor,textYear,buttonContainer);
    container.setAttribute('id', id);

    if (IsComplete){
        buttonMove.innerText = 'Belum selesai dibaca';
        document.getElementById('complete').append(container);
    } else {
        buttonMove.innerText = 'Sudah selesai dibaca';
        document.getElementById('not-complete').append(container);
    };

    buttonMove.addEventListener('click', function(){
        const bookTarget = findBook(bookObject.id);
        if (bookTarget === null){
            return;
        }
        else if (bookTarget.IsComplete===true){
            bookTarget.IsComplete = false;
        } else {
            bookTarget.IsComplete = true;
        }
        renderEvent(books);
        saveData();
    });

    buttonDelete.addEventListener('click', function (){
        const overlay = document.getElementById('overlay');
        overlay.classList.remove('hidden');
        
        const buttonNo = document.createElement('button');
        buttonNo.setAttribute('id', 'button-no');
        buttonNo.classList.add('button');
        buttonNo.innerText = 'Tidak';

        const buttonYes = document.createElement('button');
        buttonYes.setAttribute('id', 'button-yes');
        buttonYes.classList.add('button');
        buttonYes.innerText = 'Ya';

        const buttonConfirmContainer = document.createElement('div');
        buttonConfirmContainer.append(buttonNo,buttonYes);

        const textConfirm = document.createElement('p').innerText = 'Apakah anda yakin ingin menghapus ?';

        const containerConfirm = document.createElement('div');
        containerConfirm.setAttribute('id', 'popup');
        containerConfirm.append(textConfirm, buttonConfirmContainer);
        containerConfirm.classList.add('box');

        document.querySelector('body').append(containerConfirm);

        document.getElementById('button-no').addEventListener('click', function(){
            overlay.classList.add('hidden');
            containerConfirm.remove();
            renderEvent(books);
            saveData();
        });
    
        document.getElementById('button-yes').addEventListener('click', function(){
            const bookTarget = findBookIndex(bookObject.id);
            overlay.classList.add('hidden');
            if (bookTarget === -1){
                return;
            }
            containerConfirm.remove();
            books.splice(bookTarget,1);
            renderEvent(books);
            saveData();
        });
    });
};


function addBook(){
    const id = +new Date();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const IsComplete = document.getElementById('checkbox').checked;

    const bookObject = generateObject(parseInt(id), title, author, parseInt(year), IsComplete);
    books.push(bookObject);
     
    renderEvent(books);
    saveData();
}

function onOff(condition){
    const formAdd = document.getElementById('form-add');
    const formSearch = document.getElementById('form-search');
    document.getElementById('box-not-complete').classList.toggle('none');
    document.getElementById('box-complete').classList.toggle('none');
    document.getElementById('menu-back').classList.toggle('hidden');
    document.querySelectorAll('.menu-item').forEach(item =>{
        item.classList.toggle('none');
    })
    if (condition==='back'){
        formSearch.classList.add('none');
        formAdd.classList.add('none');
    } else if (condition==='search'){
        formSearch.classList.remove('none');
    } else {
        formAdd.classList.remove('none');
    }
    document.getElementById('form-search').reset();
    document.getElementById('form-add').reset();
}

function renderEvent(bookObject){
    document.getElementById('complete').innerHTML = '';
    document.getElementById('not-complete').innerHTML = '';
    for (const bookItem of bookObject){
        makeBook(bookItem);
    }
};

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('menu-back').addEventListener('click', function(){
        onOff('back')
    });

    document.getElementById('menu-search').addEventListener('click', function(){
        renderEvent(books);
        onOff('search');
    });
    document.getElementById('button-search').addEventListener('click',function(event){
        const inputSearch = document.getElementById('input-search').value;
        if (inputSearch ===''){
            renderEvent(books);
        }
        else {
            const filteredBooks = books.filter(function(key){
                return key.title.toUpperCase().includes(inputSearch.toUpperCase());
            })
            renderEvent(filteredBooks);
        }
        event.preventDefault();
    });
    
    document.getElementById('menu-add').addEventListener('click', function(){
        renderEvent(books);
        onOff('add');
    })
    document.getElementById('button-add').addEventListener('click',function(event){
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        if (title==='' || author==='' || year===''){
            alert('Tidak boleh ada input kosong');
            return null;
        }
        else {
            if (year<=0){
                alert('Tahun buku tidak valid');
            } else {
                addBook();
                document.getElementById('form-add').reset();
            }
        };
        event.preventDefault();
    })
 

    if (isStorageExist()){
        loadDataFromStorage();
    }
});
