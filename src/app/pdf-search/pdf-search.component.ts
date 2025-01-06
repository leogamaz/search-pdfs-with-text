import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-search',
  templateUrl: './pdf-search.component.html',
  styleUrls: ['./pdf-search.component.scss'],
})
export class PdfSearchComponent implements OnInit {
  selectedFile: File | null = null;
  buttonText = 'Selecione uma pasta'; // Texto do botão personalizado

  ngOnInit() {
    //this.loadPdfFiles();
  }
  onFolderSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0]; // Armazena o arquivo selecionado
    }
  }
}
