// Automatically load the image when the page is loaded
window.onload = function() {
    const imageUrl = "file:///D:/html/puzzle/ss.png"; // Set your image path here
    createPuzzle(imageUrl);
    shufflePuzzle();
}

function createPuzzle(imgSrc) {
    let imageElement = new Image();
    imageElement.src = imgSrc;
    imageElement.onload = () => {
        const imgWidth = imageElement.width;
        const imgHeight = imageElement.height;

        // Resize the image to fit the grid size (450px x 450px)
        const resizeFactor = Math.min(450 / imgWidth, 450 / imgHeight);
        const resizedWidth = imgWidth * resizeFactor;
        const resizedHeight = imgHeight * resizeFactor;

        // Create 3x3 pieces (cut the image into 9 equal pieces)
        for (let i = 0; i < 9; i++) {
            let piece = document.createElement("div");
            piece.classList.add("piece");
            piece.style.backgroundImage = `url(${imgSrc})`;
            piece.style.backgroundSize = `${resizedWidth}px ${resizedHeight}px`;

            // Calculate background position for each piece
            let row = Math.floor(i / 3);
            let col = i % 3;

            // Calculate the position for each piece by dividing the resized image into 3 parts for both rows and columns
            piece.style.backgroundPosition = `${-col * resizedWidth / 3}px ${-row * resizedHeight / 3}px`;

            piece.setAttribute('data-id', i);
            piece.setAttribute('id', 'piece-' + i); // Set a unique id for each piece
            piece.setAttribute('draggable', true);
            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('dragover', dragOver);
            piece.addEventListener('drop', dropPiece);
            piece.addEventListener('dragenter', dragEnter);
            piece.addEventListener('dragleave', dragLeave);

            document.getElementById("puzzle-container").appendChild(piece);
        }
    }
}

function shufflePuzzle() {
    let shuffledIndices = Array.from(Array(9).keys()).sort(() => Math.random() - 0.5);
    let pieces = document.querySelectorAll('.piece');
    pieces.forEach((piece, index) => {
        piece.style.order = shuffledIndices[index];
    });
}

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
    e.dataTransfer.setData("text", draggedPiece.id);
    setTimeout(() => {
        draggedPiece.style.opacity = '0.5';
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.style.backgroundColor = "#f0f0f0";
}

function dragLeave(e) {
    e.target.style.backgroundColor = "#eee";
}

function dropPiece(e) {
    e.preventDefault();
    e.target.style.backgroundColor = "#eee";
    if (e.target !== draggedPiece) {
        let draggedId = draggedPiece.getAttribute("id");
        let targetId = e.target.getAttribute("id");

        // Swap the data-id and background positions of the two pieces
        let tempBg = draggedPiece.style.backgroundPosition;
        draggedPiece.style.backgroundPosition = e.target.style.backgroundPosition;
        e.target.style.backgroundPosition = tempBg;

        let tempId = draggedPiece.getAttribute('data-id');
        draggedPiece.setAttribute('data-id', e.target.getAttribute('data-id'));
        e.target.setAttribute('data-id', tempId);

        // Check if puzzle is solved
        if (isPuzzleSolved()) {
            document.getElementById("message").textContent = "We cannot collect all the dots in life, let me enjoy collecting the dots";
        }
    }
}

function isPuzzleSolved() {
    let pieces = document.querySelectorAll('.piece');
    return Array.from(pieces).every((piece, index) => {
        return parseInt(piece.getAttribute('data-id')) === index;
    });
}
