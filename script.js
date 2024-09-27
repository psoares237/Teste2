const words = ['Xiri', 'Napoleon', 'JUJUba', 'tata'];
const gridSize = 10;
let selectedCells = [];
const wordsearchElement = document.getElementById('wordsearch');
const wordsListElement = document.getElementById('words');

// Cria a lista de palavras a serem encontradas
function createWordList() {
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.dataset.word = word.toLowerCase();
        wordsListElement.appendChild(li);
    });
}

// Cria a grade do caça-palavras
function createGrid() {
    const grid = [];
    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            grid[row][col] = '';
        }
    }
    return grid;
}

// Preenche a grade com letras aleatórias
function fillGrid(grid) {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = String.fromCharCode(97 + Math.floor(Math.random() * 26));
            }
        }
    }
    return grid;
}

// Posiciona as palavras na grade
function placeWords(grid) {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.floor(Math.random() * 2); // 0 = horizontal, 1 = vertical
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (canPlaceWord(word, row, col, direction, grid)) {
                for (let i = 0; i < word.length; i++) {
                    if (direction === 0) {
                        grid[row][col + i] = word[i].toLowerCase();
                    } else {
                        grid[row + i][col] = word[i].toLowerCase();
                    }
                }
                placed = true;
            }
        }
    });
}

// Verifica se é possível posicionar a palavra na posição desejada
function canPlaceWord(word, row, col, direction, grid) {
    if (direction === 0) {
        if (col + word.length > gridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '') return false;
        }
    } else {
        if (row + word.length > gridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '') return false;
        }
    }
    return true;
}

// Renderiza a grade no HTML
function renderGrid(grid) {
    wordsearchElement.innerHTML = '';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => selectCell(cell));
            wordsearchElement.appendChild(cell);
        }
    }
}

// Função para selecionar células e verificar se formam uma palavra
function selectCell(cell) {
    cell.classList.toggle('selected');
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellPos = { row, col, letter: cell.textContent };
    
    if (cell.classList.contains('selected')) {
        selectedCells.push(cellPos);
    } else {
        selectedCells = selectedCells.filter(pos => pos.row !== row || pos.col !== col);
    }
    
    checkSelectedWord();
}

// Verifica se as células selecionadas formam uma palavra
function checkSelectedWord() {
    const selectedWord = selectedCells.map(cell => cell.letter).join('');
    const selectedWordReversed = selectedCells.map(cell => cell.letter).reverse().join('');

    const wordFound = words.find(word => word.toLowerCase() === selectedWord || word.toLowerCase() === selectedWordReversed);

    if (wordFound) {
        markWordFound();
    }
}

// Marca a palavra encontrada e remove-a da lista
function markWordFound() {
    selectedCells.forEach(cell => {
        const element = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
        element.classList.remove('selected');
        element.classList.add('found');
    });

    const foundWordElement = document.querySelector(`[data-word="${selectedCells.map(cell => cell.letter).join('')}"], [data-word="${selectedCells.map(cell => cell.letter).reverse().join('')}"]`);
    if (foundWordElement) {
        foundWordElement.classList.add('found');
    }

    selectedCells = [];
}

// Inicializa o caça-palavras
function init() {
    createWordList();
    let grid = createGrid();
    placeWords(grid);
    grid = fillGrid(grid);
    renderGrid(grid);
}

// Executa a inicialização
init();
