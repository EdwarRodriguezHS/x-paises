import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pais, Clima } from '../../interfaces/pais';
import { PaisesService } from '../../services/paises/paises';
import { ClimaService } from '../../services/clima/clima';
import { Tarjeta } from '../../components/tarjeta/tarjeta';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, Tarjeta],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  busqueda: string = '';
  todosPaises: Pais[] = [];
  paisesFiltrados: Pais[] = [];

  modalDatosVisible: boolean = false;
  modalClimaVisible: boolean = false;
  paisSeleccionado: Pais | null = null;
  climaSeleccionado: Clima | null = null;
  descripcionClima: string = '';
  cargandoClima: boolean = false;
  cargando: boolean = false;

  private busquedaSubject = new Subject<string>();

  constructor(
    private paisesService: PaisesService,
    private climaService: ClimaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargando = true;
    this.paisesService.obtenerTodos().subscribe({
      next: (data: Pais[]) => {
        this.todosPaises = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('ERROR:', err);
        this.cargando = false;
      }
    });

    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((query: string) => {
      if (query.length < 1) {
        this.paisesFiltrados = [];
        return;
      }
      this.filtrarLocal(query);
    });
  }

  ngOnDestroy() {
    this.busquedaSubject.complete();
  }

  filtrarPaises() {
    this.busquedaSubject.next(this.busqueda);
  }

  filtrarLocal(query: string) {
    this.paisesFiltrados = this.todosPaises.filter((p: Pais) =>
      p.nombre.toLowerCase().startsWith(query.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  abrirModalDatos(pais: Pais) {
    this.paisSeleccionado = pais;
    this.modalDatosVisible = true;
    this.modalClimaVisible = false;
  }

  abrirModalClima(pais: Pais) {
    this.paisSeleccionado = pais;
    this.modalClimaVisible = true;
    this.modalDatosVisible = false;
    this.cargandoClima = true;

    this.climaService.obtenerClima(pais.latitud, pais.longitud).subscribe({
      next: (clima: Clima) => {
        this.climaSeleccionado = clima;
        this.descripcionClima = this.climaService.obtenerDescripcionClima(clima.codigoClima);
        this.cargandoClima = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('ERROR CLIMA:', err);
        this.cargandoClima = false;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarModales() {
    this.modalDatosVisible = false;
    this.modalClimaVisible = false;
    this.paisSeleccionado = null;
    this.climaSeleccionado = null;
  }
}