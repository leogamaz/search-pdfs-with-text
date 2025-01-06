import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DirectoryDialogComponent } from './directory-dialog/directory-dialog.component';

@Component({
  selector: 'app-pdf-search',
  templateUrl: './pdf-search.component.html',
  styleUrls: ['./pdf-search.component.scss'],
})
export class PdfSearchComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  ngOnInit() {
    //this.loadPdfFiles();
  }
  openDirectoryDialog(): void {
    const dialogRef = this.dialog.open(DirectoryDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Diretório selecionado:', result);
      }
    });
  }
}
