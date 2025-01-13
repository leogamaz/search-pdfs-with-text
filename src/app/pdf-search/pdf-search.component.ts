import { Component, OnInit } from '@angular/core';
import { count } from 'console';
import * as pdfjsLib from 'pdfjs-dist';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-pdf-search',
  templateUrl: './pdf-search.component.html',
  styleUrls: ['./pdf-search.component.scss'],
})
export class PdfSearchComponent implements OnInit {
  selectedFiles: File[] = [];
  expandedIndex: number | null = null;
  buttonText = 'Selecione uma pasta';
  searchResults: {
    fileName: string;
    occurrences: number;
    snippets: string[];
    file: File;
  }[] = [];
  searchQuery: string = '';
  progress = 0;

  constructor() {}

  ngOnInit() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.13.216/pdf.worker.min.js';
  }

  onFolderSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFiles = Array.from(input.files).filter(
        (file) => file.type === 'application/pdf'
      );
    }
  }

  triggerFileInput(): void {
    const input = document.getElementById('inputFolder') as HTMLInputElement;
    input.click();
  }

  async extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
    }

    return text;
  }

  async extractTextFromPdfUsingOCR(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const {
        data: { text: ocrText },
      } = await Tesseract.recognize(canvas, 'eng');
      text += ocrText + '\n';
    }

    return text;
  }

  async searchInPdfs(): Promise<void> {
    this.searchResults = [];
    if (!this.searchQuery.trim()) {
      return;
    }

    let count = 1;
    for (const file of this.selectedFiles) {
      this.progress = (count / this.selectedFiles.length) * 100;
      count++;
      try {
        const text = await this.extractTextFromPdf(file);
        const occurrences = (
          text.match(new RegExp(this.searchQuery, 'gi')) || []
        ).length;

        if (occurrences > 0) {
          const snippets = text
            .split('\n')
            .filter((line) =>
              line.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
            .slice(0, 5);

          this.searchResults.push({
            fileName: file.name,
            occurrences,
            snippets,
            file,
          });
        }
      } catch (error) {
        console.error(`Erro ao processar o arquivo ${file.name}:`, error);
      }
    }
  }

  async searchInPdfsUsingOCR(): Promise<void> {
    this.searchResults = [];
    if (!this.searchQuery.trim()) {
      return;
    }

    for (const file of this.selectedFiles) {
      try {
        const text = await this.extractTextFromPdfUsingOCR(file);
        const occurrences = (
          text.match(new RegExp(this.searchQuery, 'gi')) || []
        ).length;

        if (occurrences > 0) {
          const snippets = text
            .split('\n')
            .filter((line) =>
              line.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
            .slice(0, 5);

          this.searchResults.push({
            fileName: file.name,
            occurrences,
            snippets,
            file,
          });
        }
      } catch (error) {
        console.error(`Erro ao processar o arquivo ${file.name}:`, error);
      }
    }
  }

  toggleDetails(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  openPdf(file: File): void {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  reloadPage(): void {
    window.location.reload();
  }
}
