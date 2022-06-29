import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';


@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})
export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  logoImage = '/assets/logo.png';

  checkoutForm: FormGroup;
  edition: boolean = false;
  testoString!: string;
  noteAll!: Note;
  subscription: Subscription;
  notes = [] as Note[];

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
    this.subscription = this.noteService.secondNoteProvider.subscribe(
      (note: Note) =>{
      this.edition = true;
      this.checkoutForm.value.id = note.id;
      this.testoString = note.text;
      this.noteAll = note;
      }),
 
    this.checkoutForm = this.formBuilder.group({
      textNote: ['', [Validators.required, Validators.minLength(5)]],
      });
  }

  ngOnInit(): void {}

  sendNote() {
      if (this.edition){
       this.noteAll.text = this.checkoutForm.value.textNote;
       this.noteService.putNote(this.noteAll);
       this.checkoutForm.reset();
       this.edition = false;
       }else{
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      this.noteService.postNotes(this.checkoutForm.value.textNote).subscribe({
        //next é chamado quando as coisas dão certo
        next: (note) => {
          this.checkoutForm.reset();
          this.noteService.notifyNewNoteAdded(note);
        },
        //error é chamado no caso de excessões
        error: (error) => alert("Algo errado na inserção! " + error)
      });
    }
    }
  }

  get textNote() {
    return this.checkoutForm.get('textNote');
  }

}
