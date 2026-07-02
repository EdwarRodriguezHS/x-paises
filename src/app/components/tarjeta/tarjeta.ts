import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pais } from '../../interfaces/pais';

@Component({
  selector: 'app-tarjeta',
  imports: [CommonModule],
  templateUrl: './tarjeta.html',
  styleUrl: './tarjeta.css',
})
export class Tarjeta {

  @Input() pais!: Pais;
  @Output() verDatos = new EventEmitter<Pais>();
  @Output() verClima = new EventEmitter<Pais>();

  onVerDatos() {
    this.verDatos.emit(this.pais);
  }

  onVerClima() {
    this.verClima.emit(this.pais);
  }
}