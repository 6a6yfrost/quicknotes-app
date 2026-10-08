// Select elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

// Render notes
function render(notesToRender = notes) {
    notesList.textContent = "";

    notesToRender.forEach((note) => {

        const li = document.createElement("li");
        li.classList.add("note-card");
        li.classList.add(`category-${note.category}`);

        const text = document.createElement("p");
        text.textContent = note.text;

        const category = document.createElement("small");
        category.textContent = `Category: ${note.category}`;

        const date = document.createElement("small");
        date.textContent = `Created: ${new Date(note.createdAt).toLocaleString()}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteNote(note.id);
        });

        li.appendChild(text);
        li.appendChild(category);
        li.appendChild(document.createElement("br"));
        li.appendChild(date);
        li.appendChild(document.createElement("br"));
        li.appendChild(deleteButton);

        notesList.appendChild(li);
    });

    updateCount(notesToRender.length);
}


// Update note count
function updateCount(count) {

    if (count === 0) {
        noteCount.textContent = "No notes";
    } else if (count === 1) {
        noteCount.textContent = "1 note";
    } else {
        noteCount.textContent = `${count} notes`;
    }
}


// Save notes
function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}


// Add note
noteForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Validation
    if (text.length === 0) {
        errorMessage.textContent = "Please enter a note.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = "Note cannot be longer than 200 characters.";
        return;
    }

    // Clear error
    errorMessage.textContent = "";

    // Create note object
    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toISOString()
    };

    // Add to array
    notes.push(newNote);

    // Save
    saveNotes();

    // Render
    render();

    // Clear input
    noteInput.value = "";
});


// Delete note
function deleteNote(id) {

    notes = notes.filter((note) => note.id !== id);

    saveNotes();

    render();
}


// Search notes
searchInput.addEventListener("input", () => {

    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchTerm)
    );

    render(filteredNotes);
});


// Initial render
render();