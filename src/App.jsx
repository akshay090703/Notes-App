import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
// import { nanoid } from "nanoid";
import Split from "react-split";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { dataBase, notesCollection } from "./firebase";

export default function App() {
  // const [notes, setNotes] = React.useState(
  //   () => JSON.parse(localStorage.getItem("Notes")) || []
  // );

  const [notes, setNotes] = React.useState([]);

  // useEffect(() => {
  //   localStorage.setItem("Notes", JSON.stringify(notes));
  // }, [notes]);

  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = useState("");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      // Sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      // id: nanoid(),
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    // setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNoteRef.id);
  }

  // function updateNote(text) {
  //   setNotes((oldNotes) => {
  //     const newArray = [];
  //     oldNotes.forEach((oldNote) => {
  //       if (oldNote.id === currentNoteId) {
  //         newArray.unshift({ ...oldNote, body: text });
  //       } else {
  //         newArray.push(oldNote);
  //       }
  //     });
  //     return newArray;
  //   });
  // }
  async function updateNote(text) {
    const docRef = doc(dataBase, "notes", currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  // function deleteNode(event, noteId) {
  //   event.stopPropagation();
  //   setNotes((note) => note.filter((note) => note.id !== noteId));
  // }

  async function deleteNode(noteId) {
    const docRef = doc(dataBase, "notes", noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            onClick={deleteNode}
          />
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
